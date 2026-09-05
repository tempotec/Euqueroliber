import re
import unicodedata
from datetime import UTC, datetime

from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db

PUBLICATION_STATUS_DRAFT = "draft"
PUBLICATION_STATUS_PUBLISHED = "published"
PUBLICATION_STATUSES = {
    PUBLICATION_STATUS_DRAFT,
    PUBLICATION_STATUS_PUBLISHED,
}


def utc_now() -> datetime:
    return datetime.now(UTC)


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_only = normalized.encode("ascii", "ignore").decode("ascii")
    lowered = ascii_only.lower().strip()
    hyphenated = re.sub(r"[^a-z0-9]+", "-", lowered)
    collapsed = re.sub(r"-{2,}", "-", hyphenated)
    return collapsed.strip("-")


class AdminUser(db.Model):
    __tablename__ = "admin_users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_auth_dict(self) -> dict[str, int | str]:
        return {
            "id": self.id,
            "email": self.email,
        }


class Publication(db.Model):
    __tablename__ = "publications"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    summary = db.Column(db.Text, nullable=False, default="")
    content = db.Column(db.Text, nullable=False)
    cover_image = db.Column(db.String(500), nullable=True)
    status = db.Column(
        db.String(20),
        nullable=False,
        default=PUBLICATION_STATUS_DRAFT,
    )
    published_at = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        if self.status is None:
            self.status = PUBLICATION_STATUS_DRAFT

    @staticmethod
    def normalize_slug(slug: str) -> str:
        return slugify(slug)

    @staticmethod
    def normalize_status(status: str | None) -> str:
        normalized = (status or PUBLICATION_STATUS_DRAFT).strip().lower()

        if normalized not in PUBLICATION_STATUSES:
            raise ValueError("Invalid publication status.")

        return normalized

    def apply_status(self, next_status: str) -> None:
        normalized_status = self.normalize_status(next_status)
        previous_status = self.status
        self.status = normalized_status

        if normalized_status == PUBLICATION_STATUS_PUBLISHED:
            if previous_status != PUBLICATION_STATUS_PUBLISHED or self.published_at is None:
                self.published_at = utc_now()
        else:
            self.published_at = None

    def to_dict(self) -> dict[str, int | str | None]:
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "summary": self.summary,
            "content": self.content,
            "cover_image": self.cover_image,
            "status": self.status,
            "published_at": self.serialize_datetime(self.published_at),
            "created_at": self.serialize_datetime(self.created_at),
            "updated_at": self.serialize_datetime(self.updated_at),
        }

    def to_public_dict(self) -> dict[str, int | str | None]:
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "summary": self.summary,
            "cover_image": self.cover_image,
            "published_at": self.serialize_datetime(self.published_at),
        }

    @staticmethod
    def serialize_datetime(value: datetime | None) -> str | None:
        if value is None:
            return None

        if value.tzinfo is None:
            value = value.replace(tzinfo=UTC)

        return value.astimezone(UTC).isoformat()


class ContactMessage(db.Model):
    __tablename__ = "contact_messages"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(254), nullable=False)
    organization = db.Column(db.String(180), nullable=True)
    phone = db.Column(db.String(40), nullable=True)
    subject = db.Column(db.String(160), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @staticmethod
    def serialize_datetime(value: datetime | None) -> str | None:
        if value is None:
            return None

        if value.tzinfo is None:
            value = value.replace(tzinfo=UTC)

        return value.astimezone(UTC).isoformat()

    def to_dict(self) -> dict[str, int | str | None]:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "organization": self.organization,
            "phone": self.phone,
            "subject": self.subject,
            "message": self.message,
            "created_at": self.serialize_datetime(self.created_at),
        }
