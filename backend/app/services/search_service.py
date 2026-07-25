from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk
from app.services.embedding_service import EmbeddingService


class SearchService:
    """
    Hybrid Search

    1. Vector Search (Primary)
    2. PostgreSQL Full Text Search (Fallback)
    """

    def __init__(self):
        self.embedding_service = EmbeddingService()

    def search(
        self,
        db: Session,
        query: str,
        limit: int = 5,
    ) -> list[DocumentChunk]:

        query_embedding = self.embedding_service.generate_embedding(query)

        # -------------------------
        # VECTOR SEARCH (PRIMARY)
        # -------------------------

        vector_stmt = (
            select(DocumentChunk)
            .order_by(
                DocumentChunk.embedding.cosine_distance(query_embedding)
            )
            .limit(limit)
        )

        vector_results = list(db.scalars(vector_stmt).all())

        # If vector search found results, use them
        if vector_results:
            return vector_results

        # -------------------------
        # FTS FALLBACK
        # -------------------------

        ts_query = func.plainto_tsquery(
            "english",
            query,
        )

        keyword_stmt = (
            select(DocumentChunk)
            .where(
                DocumentChunk.search_vector.op("@@")(ts_query)
            )
            .order_by(
                func.ts_rank(
                    DocumentChunk.search_vector,
                    ts_query,
                ).desc()
            )
            .limit(limit)
        )

        return list(db.scalars(keyword_stmt).all())