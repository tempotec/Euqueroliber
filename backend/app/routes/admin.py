from flask import jsonify

from ..auth import admin_required, get_current_admin_user
from . import api_v1_bp


@api_v1_bp.get("/admin/session")
@admin_required
def admin_session():
    user = get_current_admin_user()

    return jsonify(
        {
            "authenticated": True,
            "user": user.to_auth_dict(),
        }
    )
