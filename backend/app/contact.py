from .extensions import db
from .models import ContactMessage

CONTACT_SUBJECTS = {
    "Gestão de Resíduos",
    "Educação Ambiental",
    "Inclusão Produtiva e Economia Circular",
    "Projetos e Parcerias",
    "Outro",
}

LIMITS = {
    "name": 120,
    "email": 254,
    "organization": 180,
    "phone": 40,
    "subject": 160,
    "message": 5000,
}


class ContactValidationError(ValueError):
    """Raised when the contact payload is invalid."""


def _clean_optional(value: str | None) -> str | None:
    if value is None:
        return None

    cleaned = value.strip()
    return cleaned or None


def _clean_required(value: str | None, field: str, limit: int) -> str:
    if value is None:
        raise ContactValidationError(f"O campo {field} é obrigatório.")

    cleaned = value.strip()

    if not cleaned:
        raise ContactValidationError(f"O campo {field} é obrigatório.")

    if len(cleaned) > limit:
        raise ContactValidationError(f"O campo {field} excede o limite de {limit} caracteres.")

    return cleaned


def is_valid_email(email: str) -> bool:
    if email.count("@") != 1:
        return False

    local, domain = email.split("@")

    if not local or not domain:
        return False

    if "." not in domain:
        return False

    if domain.startswith(".") or domain.endswith("."):
        return False

    return True


def build_contact_message(payload: dict) -> ContactMessage:
    if not isinstance(payload, dict):
        raise ContactValidationError("Corpo da requisição inválido.")

    name = _clean_required(payload.get("name"), "nome", LIMITS["name"])
    email = _clean_required(payload.get("email"), "e-mail", LIMITS["email"])
    subject = _clean_required(payload.get("subject"), "assunto", LIMITS["subject"])
    message = _clean_required(payload.get("message"), "mensagem", LIMITS["message"])

    if not is_valid_email(email):
        raise ContactValidationError("Informe um e-mail válido.")

    if subject not in CONTACT_SUBJECTS:
        raise ContactValidationError("Assunto inválido.")

    organization = _clean_optional(payload.get("organization"))
    if organization is not None and len(organization) > LIMITS["organization"]:
        raise ContactValidationError(
            f"O campo organização excede o limite de {LIMITS['organization']} caracteres."
        )

    phone = _clean_optional(payload.get("phone"))
    if phone is not None and len(phone) > LIMITS["phone"]:
        raise ContactValidationError(f"O campo telefone excede o limite de {LIMITS['phone']} caracteres.")

    return ContactMessage(
        name=name,
        email=email,
        organization=organization,
        phone=phone,
        subject=subject,
        message=message,
    )


def save_contact_message(message: ContactMessage) -> ContactMessage:
    db.session.add(message)
    db.session.commit()
    return message
