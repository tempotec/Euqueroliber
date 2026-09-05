from flask import jsonify, request

from . import api_v1_bp
from ..contact import ContactValidationError, build_contact_message, save_contact_message


def validation_json(message: str, error: str = "validation_error", status_code: int = 400):
    response = jsonify({"error": error, "message": message})
    response.status_code = status_code
    return response


@api_v1_bp.post("/contact")
def create_contact_message():
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return validation_json("Corpo da requisição inválido.")

    # Honeypot simples: campo invisível que humanos não preenchem.
    if payload.get("website"):
        return jsonify({"sent": True, "message": "Mensagem recebida."}), 201

    try:
        message = build_contact_message(payload)
    except ContactValidationError as exc:
        return validation_json(str(exc))

    save_contact_message(message)

    return jsonify({"sent": True, "message": "Mensagem recebida."}), 201
