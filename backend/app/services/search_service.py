from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk
from app.services.embedding_service import EmbeddingService


class SearchService:
    """
    Performs semantic search over document chunks.
    """

    def __init__(self):
        self.embedding_service = EmbeddingService()

    def search(
        self,
        db: Session,
        query: str,
        limit: int = 5,
    ) -> list[DocumentChunk]:
        """
        Return the most relevant chunks for a query.
        """

        query_embedding = self.embedding_service.generate_embedding(query)

        statement = (
            select(DocumentChunk)
            .order_by(
                DocumentChunk.embedding.cosine_distance(query_embedding)
            )
            .limit(limit)
        )

        return list(db.scalars(statement).all())