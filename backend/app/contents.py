from copy import deepcopy

from .extensions import db
from .models import CONTENT_SECTION_KEYS, ContentSection, utc_now


class ContentValidationError(ValueError):
    def __init__(self, message: str, error: str = "validation_error") -> None:
        super().__init__(message)
        self.error = error
        self.message = message


def is_valid_content_key(key: object) -> bool:
    return isinstance(key, str) and key in CONTENT_SECTION_KEYS


def normalize_content_key(key: object) -> str:
    if not is_valid_content_key(key):
        raise ContentValidationError("Invalid content key.", "invalid_content_key")

    return str(key)


def normalize_content_data(value: object) -> dict:
    if not isinstance(value, dict):
        raise ContentValidationError(
            "Content data must be a JSON object.",
            "validation_error",
        )

    return value


def build_content_payload(payload: object) -> dict:
    if not isinstance(payload, dict):
        raise ContentValidationError("Valid JSON payload is required.", "validation_error")

    return normalize_content_data(payload.get("data"))


def get_section(key: str) -> ContentSection | None:
    return ContentSection.query.filter_by(key=key).first()


def list_sections() -> list[ContentSection]:
    return ContentSection.query.order_by(ContentSection.key).all()


def save_draft(section: ContentSection, data: dict) -> ContentSection:
    section.draft_data = deepcopy(data)
    section.updated_at = utc_now()
    db.session.commit()

    return section


def publish_content(section: ContentSection) -> ContentSection:
    section.published_data = deepcopy(section.draft_data)
    section.published_at = utc_now()
    section.updated_at = utc_now()
    db.session.commit()

    return section


def revert_content(section: ContentSection) -> ContentSection:
    section.draft_data = deepcopy(section.published_data)
    section.updated_at = utc_now()
    db.session.commit()

    return section


def create_section(key: str, data: dict) -> ContentSection:
    now = utc_now()
    section = ContentSection(
        key=key,
        draft_data=deepcopy(data),
        published_data=deepcopy(data),
        created_at=now,
        updated_at=now,
        published_at=now,
    )
    db.session.add(section)
    db.session.commit()

    return section
