from flask import jsonify, request

from ..auth import get_current_admin_user, log_in_admin_user, log_out_admin_user
from ..models import AdminUser
from . import api_v1_bp

INVALID_CREDENTIALS_RESPONSE = {
    "authenticated": False,
    "error": "invalid_credentials",
}


@api_v1_bp.post("/auth/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))

    if not email or not password:
        return jsonify(INVALID_CREDENTIALS_RESPONSE), 401

    user = AdminUser.query.filter_by(email=email).first()

    if user is None or not user.is_active or not user.check_password(password):
        return jsonify(INVALID_CREDENTIALS_RESPONSE), 401

    log_in_admin_user(user)

    return jsonify(
        {
            "authenticated": True,
            "user": user.to_auth_dict(),
        }
    )


@api_v1_bp.post("/auth/logout")
def logout():
    log_out_admin_user()
    return jsonify({"authenticated": False})


@api_v1_bp.get("/auth/me")
def me():
    user = get_current_admin_user()

    if user is None:
        return jsonify({"authenticated": False}), 401

    return jsonify(
        {
            "authenticated": True,
            "user": user.to_auth_dict(),
        }
    )
