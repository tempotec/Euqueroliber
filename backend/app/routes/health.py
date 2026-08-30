from flask import jsonify
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from ..extensions import db
from . import api_v1_bp


@api_v1_bp.get("/health")
def healthcheck():
    return jsonify({"status": "ok"})


@api_v1_bp.get("/health/db")
def database_healthcheck():
    try:
        db.session.execute(text("SELECT 1"))
    except SQLAlchemyError:
        return jsonify({"status": "error", "database": "unavailable"}), 503

    return jsonify({"status": "ok", "database": "connected"})
