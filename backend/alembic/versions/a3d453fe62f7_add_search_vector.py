"""add_search_vector

Revision ID: a3d453fe62f7
Revises: e645430db887
Create Date: 2026-07-24 10:38:21.159009
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "a3d453fe62f7"
down_revision: Union[str, Sequence[str], None] = "e645430db887"
branch_labels = None
depends_on = None


def upgrade() -> None:

    # Add tsvector column
    op.add_column(
        "document_chunks",
        sa.Column(
            "search_vector",
            postgresql.TSVECTOR(),
            nullable=True,
        ),
    )

    # Populate existing rows
    op.execute("""
        UPDATE document_chunks
        SET search_vector = to_tsvector('english', content);
    """)

    # Create GIN index
    op.execute("""
        CREATE INDEX ix_document_chunks_search_vector
        ON document_chunks
        USING GIN(search_vector);
    """)


def downgrade() -> None:

    op.execute("""
        DROP INDEX IF EXISTS ix_document_chunks_search_vector;
    """)

    op.drop_column(
        "document_chunks",
        "search_vector",
    )