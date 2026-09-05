"""create contact messages

Revision ID: 3f8a2c9d1b5e
Revises: 7a60e6331bd2
Create Date: 2026-09-05 18:20:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "3f8a2c9d1b5e"
down_revision = "7a60e6331bd2"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "contact_messages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=254), nullable=False),
        sa.Column("organization", sa.String(length=180), nullable=True),
        sa.Column("phone", sa.String(length=40), nullable=True),
        sa.Column("subject", sa.String(length=160), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("contact_messages")
