from openai import OpenAI

from app.core.config import settings

EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 768  # matches the existing Vector(768) column — no DB migration needed
BATCH_SIZE = 100  # keeps each request comfortably under OpenAI's per-request token limit

_client = OpenAI(api_key=settings.openai_api_key)


class EmbeddingService:
    """
    Generates embeddings for document chunks and search queries
    using OpenAI's API (no local model, no torch/transformers needed).
    """

    def generate_embedding(self, text: str) -> list[float]:
        response = _client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=text,
            dimensions=EMBEDDING_DIMENSIONS,
        )

        return response.data[0].embedding

    def generate_embeddings(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []

        all_embeddings: list[list[float]] = []

        for start in range(0, len(texts), BATCH_SIZE):
            batch = texts[start:start + BATCH_SIZE]

            response = _client.embeddings.create(
                model=EMBEDDING_MODEL,
                input=batch,
                dimensions=EMBEDDING_DIMENSIONS,
            )

            # OpenAI returns results in order, but sort by index defensively
            sorted_data = sorted(response.data, key=lambda item: item.index)
            all_embeddings.extend(item.embedding for item in sorted_data)

        return all_embeddings
