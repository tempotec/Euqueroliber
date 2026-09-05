from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from ..auth import admin_required
from ..models import Publication
from ..publications import (
    PublicationValidationError,
    build_publication_payload,
    delete_publication,
    save_publication,
    slug_exists,
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
    return jsonify({"items": [publication.to_dict() for publication in publications]})


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
    publication = db_get_publication(publication_id)

    if publication is None:
        return not_found_response()

    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return validation_json("Valid JSON payload is required.")

    try:
        data = build_publication_payload(payload, publication=publication)
    except PublicationValidationError as exc:
        return validation_json(exc.message, exc.error)

    if slug_exists(data["slug"], ignore_publication_id=publication.id):
        return validation_json("Slug already exists.", "slug_already_exists")

    try:
        save_publication(publication, data)
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
