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


def build_publication_payload(payload: dict, publication: Publication | None = None) -> dict:
    current_title = publication.title if publication else ""
    current_content = publication.content if publication else ""
    current_summary = publication.summary if publication else ""
    current_cover_image = publication.cover_image if publication else None
    current_status = publication.status if publication else None

    title = normalize_required_text(
        payload.get("title", current_title),
        field_label="Title",
    )
    content = normalize_required_text(
        payload.get("content", current_content),
        field_label="Content",
    )
    summary = normalize_optional_text(payload.get("summary", current_summary))
    cover_image = normalize_cover_image(payload.get("cover_image", current_cover_image))
    try:
        status = Publication.normalize_status(payload.get("status", current_status))
    except ValueError as exc:
        raise PublicationValidationError(str(exc)) from exc
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
        "status": status,
    }


def slug_exists(slug: str, *, ignore_publication_id: int | None = None) -> bool:
    query = Publication.query.filter_by(slug=slug)

    if ignore_publication_id is not None:
        query = query.filter(Publication.id != ignore_publication_id)

    return db.session.query(query.exists()).scalar()


def save_publication(publication: Publication, data: dict) -> Publication:
    publication.title = data["title"]
    publication.slug = data["slug"]
    publication.summary = data["summary"]
    publication.content = data["content"]
    publication.cover_image = data["cover_image"]
    publication.apply_status(data["status"])

    db.session.add(publication)

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


def delete_publication(publication: Publication) -> None:
    db.session.delete(publication)

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
