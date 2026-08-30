from functools import wraps
from typing import Callable

from flask import g, jsonify, session

from .extensions import db
from .models import AdminUser

ADMIN_SESSION_KEY = "admin_user_id"


def get_current_admin_user() -> AdminUser | None:
    if hasattr(g, "current_admin_user"):
        return g.current_admin_user

    user_id = session.get(ADMIN_SESSION_KEY)

    if not user_id:
        g.current_admin_user = None
        return None

    user = db_lookup_admin_user(user_id)

    if user is None or not user.is_active:
        session.pop(ADMIN_SESSION_KEY, None)
        g.current_admin_user = None
        return None

    g.current_admin_user = user
    return user


def db_lookup_admin_user(user_id: int) -> AdminUser | None:
    return db.session.get(AdminUser, user_id)


def log_in_admin_user(user: AdminUser) -> None:
    session.clear()
    session[ADMIN_SESSION_KEY] = user.id


def log_out_admin_user() -> None:
    session.clear()


def admin_required(view: Callable):
    @wraps(view)
    def wrapped(*args, **kwargs):
        user = get_current_admin_user()

        if user is None:
            return jsonify({"authenticated": False}), 401

        return view(*args, **kwargs)

    return wrapped
