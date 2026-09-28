from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from ..auth import admin_required
from ..models import Publication
from ..publications import (
    PublicationValidationError,
    build_publication_content,
    build_publication_payload,
    delete_publication,
    discard_publication_draft,
    publish_publication,
    save_editorial_draft,
    save_publication,
    slug_conflict,
    slug_exists,
    unpublish_publication,
)
from . import api_v1_bp


def validation_json(message: str, error: str = "validation_error", status_code: int = 400):
    payload = {"error": error, "message": message}
    return jsonify(payload), status_code


def not_found_response():
    return jsonify({"error": "not_found"}), 404


@api_v1_bp.get("/admin/publications")
@admin_required
def list_admin_publications():
    publications = Publication.query.order_by(Publication.updated_at.desc()).all()
    return jsonify({"items": [publication.to_admin_list_dict() for publication in publications]})


@api_v1_bp.post("/admin/publications")
@admin_required
def create_admin_publication():
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return validation_json("Valid JSON payload is required.")

    try:
        data = build_publication_payload(payload)
    except PublicationValidationError as exc:
        return validation_json(exc.message, exc.error)

    if slug_exists(data["slug"]):
        return validation_json("Slug already exists.", "slug_already_exists")

    publication = Publication()

    try:
        save_publication(publication, data)
    except PublicationValidationError as exc:
        return validation_json(exc.message, exc.error)
    except SQLAlchemyError:
        return jsonify({"error": "persistence_error"}), 500

    return jsonify(publication.to_dict()), 201


@api_v1_bp.get("/admin/publications/<int:publication_id>")
@admin_required
def get_admin_publication(publication_id: int):
    publication = db_get_publication(publication_id)

    if publication is None:
        return not_found_response()

    return jsonify(publication.to_dict())


@api_v1_bp.put("/admin/publications/<int:publication_id>")
@admin_required
def update_admin_publication(publication_id: int):
    """Salva a EDICAO (rascunho). NUNCA altera a versao publica de uma publicada.

    Mudar status nao e uma operacao de edicao: use /publish ou /unpublish.
    """
    publication = db_get_publication(publication_id)

    if publication is None:
        return not_found_response()

    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return validation_json("Valid JSON payload is required.")

    if payload.get("status") is not None:
        try:
            requested_status = Publication.normalize_status(payload["status"])
        except ValueError as exc:
            return validation_json(str(exc))

        if requested_status != publication.status:
            return validation_json(
                "Status changes require an explicit action. Use /publish or /unpublish.",
                "status_change_requires_explicit_action",
            )

    try:
        data = build_publication_content(payload, publication.editor_data())
    except PublicationValidationError as exc:
        return validation_json(exc.message, exc.error)

    if slug_conflict(data["slug"], ignore_publication_id=publication.id):
        return validation_json("Slug already exists.", "slug_already_exists")

    try:
        save_editorial_draft(publication, data)
    except PublicationValidationError as exc:
        return validation_json(exc.message, exc.error)
    except SQLAlchemyError:
        return jsonify({"error": "persistence_error"}), 500

    return jsonify(publication.to_dict())


@api_v1_bp.post("/admin/publications/<int:publication_id>/publish")
@admin_required
def publish_admin_publication(publication_id: int):
    """Aplica a edicao pendente na versao publica.

    `published_at` so e definido na primeira publicacao; atualizacoes o preservam.
    """
    publication = db_get_publication(publication_id)

    if publication is None:
        return not_found_response()

    pending_slug = publication.editor_data()["slug"]

    if slug_conflict(pending_slug, ignore_publication_id=publication.id):
        return validation_json("Slug already exists.", "slug_already_exists")

    try:
        publish_publication(publication)
    except PublicationValidationError as exc:
        return validation_json(exc.message, exc.error)
    except SQLAlchemyError:
        return jsonify({"error": "persistence_error"}), 500

    return jsonify(publication.to_dict())


@api_v1_bp.post("/admin/publications/<int:publication_id>/unpublish")
@admin_required
def unpublish_admin_publication(publication_id: int):
    """Remove do site preservando o historico de `published_at`.

    A confirmacao e responsabilidade do frontend.
    """
    publication = db_get_publication(publication_id)

    if publication is None:
        return not_found_response()

    try:
        unpublish_publication(publication)
    except PublicationValidationError as exc:
        return validation_json(exc.message, exc.error)
    except SQLAlchemyError:
        return jsonify({"error": "persistence_error"}), 500

    return jsonify(publication.to_dict())


@api_v1_bp.post("/admin/publications/<int:publication_id>/revert")
@admin_required
def revert_admin_publication(publication_id: int):
    """Descarta a edicao pendente. A versao publica nunca e afetada."""
    publication = db_get_publication(publication_id)

    if publication is None:
        return not_found_response()

    try:
        discard_publication_draft(publication)
    except PublicationValidationError as exc:
        return validation_json(exc.message, exc.error)
    except SQLAlchemyError:
        return jsonify({"error": "persistence_error"}), 500

    return jsonify(publication.to_dict())


@api_v1_bp.delete("/admin/publications/<int:publication_id>")
@admin_required
def delete_admin_publication(publication_id: int):
    publication = db_get_publication(publication_id)

    if publication is None:
        return not_found_response()

    try:
        delete_publication(publication)
    except SQLAlchemyError:
        return jsonify({"error": "persistence_error"}), 500

    return jsonify({"deleted": True})


def db_get_publication(publication_id: int) -> Publication | None:
    return Publication.query.filter_by(id=publication_id).first()
