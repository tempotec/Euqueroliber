from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from ..auth import admin_required
from ..contents import (
    ContentValidationError,
    build_content_payload,
    get_section,
    is_valid_content_key,
    list_sections,
    publish_content,
    revert_content,
    save_draft,
)
from . import api_v1_bp


def validation_json(message: str, error: str = "validation_error", status_code: int = 400):
    payload = {"error": error, "message": message}
    return jsonify(payload), status_code


def invalid_key_response():
    return jsonify({"error": "invalid_content_key"}), 404


def not_found_response():
    return jsonify({"error": "not_found"}), 404


def resolve_section(key: str):
    """Retorna (section, response). Nunca cria a secao automaticamente."""

    if not is_valid_content_key(key):
        return None, invalid_key_response()

    section = get_section(key)

    if section is None:
        return None, not_found_response()

    return section, None


@api_v1_bp.get("/admin/content")
@admin_required
def list_admin_content():
    sections = list_sections()

    return jsonify(
        {
            "sections": [section.to_admin_dict() for section in sections],
        }
    )


@api_v1_bp.get("/admin/content/<string:key>")
@admin_required
def get_admin_content(key: str):
    section, error = resolve_section(key)

    if error is not None:
        return error

    return jsonify(section.to_admin_dict())


@api_v1_bp.put("/admin/content/<string:key>")
@admin_required
def update_admin_content(key: str):
    section, error = resolve_section(key)

    if error is not None:
        return error

    payload = request.get_json(silent=True)

    try:
        data = build_content_payload(payload)
    except ContentValidationError as exc:
        return validation_json(exc.message, exc.error)

    try:
        save_draft(section, data)
    except SQLAlchemyError:
        return jsonify({"error": "persistence_error"}), 500

    return jsonify(section.to_admin_dict())


@api_v1_bp.post("/admin/content/<string:key>/publish")
@admin_required
def publish_admin_content(key: str):
    section, error = resolve_section(key)

    if error is not None:
        return error

    try:
        publish_content(section)
    except SQLAlchemyError:
        return jsonify({"error": "persistence_error"}), 500

    return jsonify(section.to_admin_dict())


@api_v1_bp.post("/admin/content/<string:key>/revert")
@admin_required
def revert_admin_content(key: str):
    section, error = resolve_section(key)

    if error is not None:
        return error

    try:
        revert_content(section)
    except SQLAlchemyError:
        return jsonify({"error": "persistence_error"}), 500

    return jsonify(section.to_admin_dict())
