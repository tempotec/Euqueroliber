"""add draft_data to publications

Revision ID: c4f1a9b27d30
Revises: 8b4e1f6a2d70
Create Date: 2026-09-28 10:30:00

Adiciona a edicao pendente das publicacoes (Ticket 8).

E uma coluna ADITIVA e NULLABLE: nenhum registro existente e alterado.
Para uma publicacao ja publicada, `draft_data = NULL` significa, exatamente,
"nao ha alteracao pendente" — o comportamento anterior ao ticket.

Nao ha backfill: as colunas title/slug/summary/content/cover_image continuam
sendo a versao publica e ja estao preenchidas.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c4f1a9b27d30"
down_revision = "8b4e1f6a2d70"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("publications") as batch_op:
        batch_op.add_column(sa.Column("draft_data", sa.JSON(), nullable=True))


def downgrade():
    with op.batch_alter_table("publications") as batch_op:
        batch_op.drop_column("draft_data")
