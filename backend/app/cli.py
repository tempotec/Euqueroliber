import json
import re
from pathlib import Path

import click
from flask import Flask

from .contents import create_section, get_section, publish_content, save_draft
from .extensions import db
from .models import CONTENT_SECTION_KEYS, AdminUser

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
CONTENT_SEED_PATH = Path(__file__).resolve().parent / "data" / "content_seed.json"


def validate_email(value: str) -> str:
    normalized = value.strip().lower()

    if not EMAIL_PATTERN.fullmatch(normalized):
        raise click.ClickException("Invalid email.")

    return normalized


def register_commands(app: Flask) -> None:
    @app.cli.command("create-admin")
    def create_admin_command() -> None:
        email = validate_email(click.prompt("Email", type=str))
        password = click.prompt(
            "Senha",
            type=str,
            hide_input=True,
            confirmation_prompt=True,
        ).strip()

        if not password:
            raise click.ClickException("Password cannot be empty.")

        existing_user = AdminUser.query.filter_by(email=email).first()

        if existing_user is not None:
            raise click.ClickException("Admin user already exists for this email.")

        user = AdminUser(email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        click.echo(f"Admin user created: {user.email}")

    @app.cli.command("seed-content")
    @click.option(
        "--force",
        is_flag=True,
        default=False,
        help="Sobrescreve secoes existentes com os dados do seed.",
    )
    def seed_content_command(force: bool) -> None:
        if not CONTENT_SEED_PATH.exists():
            raise click.ClickException(f"Seed file not found: {CONTENT_SEED_PATH}")

        seed = json.loads(CONTENT_SEED_PATH.read_text(encoding="utf-8"))

        if not isinstance(seed, dict):
            raise click.ClickException("Seed file must contain a JSON object.")

        unknown_keys = sorted(key for key in seed if key not in CONTENT_SECTION_KEYS)

        if unknown_keys:
            raise click.ClickException(
                "Unknown content keys in seed: " + ", ".join(unknown_keys)
            )

        created = 0
        skipped = 0
        overwritten = 0

        for key, data in seed.items():
            section = get_section(key)

            if section is None:
                create_section(key, data)
                created += 1
                continue

            if force:
                save_draft(section, data)
                publish_content(section)
                overwritten += 1
                continue

            skipped += 1

        click.echo(f"Content sections created: {created}")
        click.echo(f"Content sections skipped: {skipped}")

        if force:
            click.echo(f"Content sections overwritten: {overwritten}")
