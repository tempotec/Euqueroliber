from sqlalchemy.exc import IntegrityError

from .extensions import db
from .models import Publication


class PublicationValidationError(ValueError):
    def __init__(self, message: str, error: str = "validation_error") -> None:
        super().__init__(message)
        self.error = error
        self.message = message


def normalize_optional_text(value: object) -> str:
    if value is None:
        return ""

    return str(value).strip()


def normalize_required_text(value: object, *, field_label: str) -> str:
    normalized = normalize_optional_text(value)

    if not normalized:
        raise PublicationValidationError(f"{field_label} is required.")

    return normalized


def normalize_cover_image(value: object) -> str | None:
    normalized = normalize_optional_text(value)
    return normalized or None


def build_publication_content(payload: dict, base: dict | None = None) -> dict:
    """Normaliza os campos editoriais (sem `status`).

    `base` fornece os valores para os campos omitidos no payload.
    """
    base = base or {}

    title = normalize_required_text(
        payload.get("title", base.get("title", "")),
        field_label="Title",
    )
    content = normalize_required_text(
        payload.get("content", base.get("content", "")),
        field_label="Content",
    )
    summary = normalize_optional_text(payload.get("summary", base.get("summary", "")))
    cover_image = normalize_cover_image(payload.get("cover_image", base.get("cover_image")))
    requested_slug = payload.get("slug")

    slug_source = title if requested_slug is None else str(requested_slug)
    slug = Publication.normalize_slug(slug_source)

    if not slug:
        raise PublicationValidationError("Slug is required after normalization.")

    return {
        "title": title,
        "slug": slug,
        "summary": summary,
        "content": content,
        "cover_image": cover_image,
    }


def build_publication_payload(payload: dict, publication: Publication | None = None) -> dict:
    base = publication.public_snapshot() if publication else None
    data = build_publication_content(payload, base)

    try:
        data["status"] = Publication.normalize_status(
            payload.get("status", publication.status if publication else None)
        )
    except ValueError as exc:
        raise PublicationValidationError(str(exc)) from exc

    return data


def slug_exists(slug: str, *, ignore_publication_id: int | None = None) -> bool:
    query = Publication.query.filter_by(slug=slug)

    if ignore_publication_id is not None:
        query = query.filter(Publication.id != ignore_publication_id)

    return db.session.query(query.exists()).scalar()


def slug_conflict(slug: str, *, ignore_publication_id: int | None = None) -> bool:
    """Colide com o slug publico de outra publicacao?

    Considera tambem o slug de uma EDICAO PENDENTE de outra publicacao: se um
    rascunho pendente reivindica o slug, publicar a outra depois quebraria a
    constraint UNIQUE. Bloquear na origem evita um 500 no publish.
    """
    if slug_exists(slug, ignore_publication_id=ignore_publication_id):
        return True

    draft_query = Publication.query.filter(
        Publication.draft_data.isnot(None),
        Publication.draft_data["slug"].as_string() == slug,
    )

    if ignore_publication_id is not None:
        draft_query = draft_query.filter(Publication.id != ignore_publication_id)

    return bool(db.session.query(draft_query.exists()).scalar())


def _write_public_fields(publication: Publication, data: dict) -> None:
    for field in Publication.CONTENT_FIELDS:
        setattr(publication, field, data[field])


def _commit(publication: Publication) -> Publication:
    try:
        db.session.commit()
    except IntegrityError as exc:
        db.session.rollback()

        if "slug" in str(exc).lower():
            raise PublicationValidationError(
                "Slug already exists.",
                error="slug_already_exists",
            ) from exc

        raise

    return publication


def save_publication(publication: Publication, data: dict) -> Publication:
    _write_public_fields(publication, data)
    publication.apply_status(data["status"])

    db.session.add(publication)

    return _commit(publication)


def save_editorial_draft(publication: Publication, data: dict) -> Publication:
    """Salva a EDICAO sem alterar a versao publica de uma publicacao publicada.

    - Publicacao publicada  -> grava `draft_data`; colunas intactas.
    - Nunca publicada       -> as colunas sao a fonte canonica; grava nelas.
    """
    if publication.is_published:
        publication.save_pending_draft(data)
    else:
        _write_public_fields(publication, data)

    db.session.add(publication)

    return _commit(publication)


def publish_publication(publication: Publication) -> Publication:
    """Aplica a edicao pendente na versao publica e publica.

    `published_at` e definido apenas na PRIMEIRA publicacao; atualizacoes
    preservam a data original (editar um artigo nao deve reordena-lo).
    """
    publication.apply_pending_draft()
    publication.mark_published()

    db.session.add(publication)

    return _commit(publication)


def unpublish_publication(publication: Publication) -> Publication:
    """Remove do site preservando o historico de `published_at`.

    Uma edicao pendente e promovida as colunas antes de sair do ar: a
    publicacao volta a ser um rascunho editavel e nenhum trabalho e perdido.
    """
    publication.apply_pending_draft()
    publication.mark_unpublished()

    db.session.add(publication)

    return _commit(publication)


def discard_publication_draft(publication: Publication) -> Publication:
    """Descarta a edicao pendente. A versao publica nunca e afetada."""
    publication.discard_pending_draft()

    db.session.add(publication)

    return _commit(publication)


def delete_publication(publication: Publication) -> None:
    db.session.delete(publication)

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
