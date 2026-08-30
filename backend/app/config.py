import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
INSTANCE_DIR = BACKEND_DIR / "instance"
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


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


class Config:
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    SQLALCHEMY_DATABASE_URI = normalize_database_url(os.getenv("DATABASE_URL"))
    CORS_ORIGINS = parse_cors_origins(os.getenv("CORS_ORIGINS"))
