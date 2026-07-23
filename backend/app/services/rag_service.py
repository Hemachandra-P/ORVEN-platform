from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService


class RAGService:
    """
    Handles document ingestion for RAG.
    """

    def __init__(self):
        self.chunking_service = ChunkingService()
        self.embedding_service = EmbeddingService()

    def process_document(
        self,
        db: Session,
        document: Document,
    ) -> None:
        """
        Chunk the document, generate embeddings,
        and store them in the database.
        """

        chunks = self.chunking_service.split_text(
            document.extracted_text
        )

        if not chunks:
            return

        embeddings = self.embedding_service.generate_embeddings(chunks)

        for index, (chunk, embedding) in enumerate(
            zip(chunks, embeddings)
        ):
            db.add(
                DocumentChunk(
                    document_id=document.id,
                    chunk_index=index,
                    content=chunk,
                    embedding=embedding,
                )
            )

        db.commit()