from flask import Blueprint

api_v1_bp = Blueprint("api_v1", __name__, url_prefix="/api/v1")

from . import (  # noqa: E402,F401
    admin,
    admin_content,
    admin_publications,
    auth,
    contact,
    content,
    health,
    publications,
)
