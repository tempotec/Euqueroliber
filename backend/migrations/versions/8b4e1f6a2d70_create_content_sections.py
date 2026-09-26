"""create content sections

Revision ID: 8b4e1f6a2d70
Revises: 3f8a2c9d1b5e
Create Date: 2026-09-26 12:30:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "8b4e1f6a2d70"
down_revision = "3f8a2c9d1b5e"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "content_sections",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("key", sa.String(length=120), nullable=False),
        sa.Column("draft_data", sa.JSON(), nullable=False),
        sa.Column("published_data", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_content_sections_key",
        "content_sections",
        ["key"],
        unique=True,
    )


def downgrade():
    op.drop_index("ix_content_sections_key", table_name="content_sections")
    op.drop_table("content_sections")
