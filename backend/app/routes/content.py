from flask import jsonify

from ..contents import get_section, is_valid_content_key, list_sections
from . import api_v1_bp


def not_found_response():
    return jsonify({"error": "not_found"}), 404


def invalid_key_response():
    return jsonify({"error": "invalid_content_key"}), 404


@api_v1_bp.get("/content")
def list_public_content():
    sections = list_sections()

    return jsonify(
        {
            "sections": [section.to_public_dict() for section in sections],
        }
    )


@api_v1_bp.get("/content/<string:key>")
def get_public_content(key: str):
    if not is_valid_content_key(key):
        return invalid_key_response()

    section = get_section(key)

    if section is None:
        return not_found_response()

    return jsonify(section.to_public_dict())
