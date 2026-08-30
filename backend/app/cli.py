import re

import click
from flask import Flask

from .extensions import db
from .models import AdminUser

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


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
