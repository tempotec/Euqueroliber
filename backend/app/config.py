import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
INSTANCE_DIR = BACKEND_DIR / "instance"
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


def parse_bool(value: str | None, *, default: bool) -> bool:
    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "on"}


def normalize_database_url(database_url: str | None) -> str:
    if not database_url:
        sqlite_path = (INSTANCE_DIR / "app.sqlite3").resolve().as_posix()
        return f"sqlite:///{sqlite_path}"

    normalized = database_url.strip()

    if normalized.startswith("postgres://"):
        return normalized.replace("postgres://", "postgresql://", 1)

    return normalized


def parse_cors_origins(raw_origins: str | None) -> list[str]:
    if not raw_origins:
        return DEFAULT_CORS_ORIGINS

    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


def resolve_app_env() -> str:
    return (os.getenv("APP_ENV") or os.getenv("FLASK_ENV") or "development").strip().lower()


def resolve_secret_key(app_env: str, raw_secret_key: str | None) -> str:
    normalized = (raw_secret_key or "").strip()
    insecure_values = {"", "change-me", "dev-insecure-change-me"}

    if app_env == "production" and normalized in insecure_values:
        raise RuntimeError("SECRET_KEY must be configured with a strong value in production.")

    if normalized:
        return normalized

    return "dev-insecure-change-me"


class Config:
    APP_ENV = resolve_app_env()
    IS_PRODUCTION = APP_ENV == "production"
    TESTING = False
    SECRET_KEY = resolve_secret_key(APP_ENV, os.getenv("SECRET_KEY"))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    SQLALCHEMY_DATABASE_URI = normalize_database_url(os.getenv("DATABASE_URL"))
    CORS_ORIGINS = parse_cors_origins(os.getenv("CORS_ORIGINS"))
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = os.getenv("SESSION_COOKIE_SAMESITE", "Lax")
    SESSION_COOKIE_SECURE = parse_bool(
        os.getenv("SESSION_COOKIE_SECURE"),
        default=IS_PRODUCTION,
    )
