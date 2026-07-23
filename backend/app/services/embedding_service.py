from sentence_transformers import SentenceTransformer

# Load the model once when the application starts
_embedding_model = SentenceTransformer("BAAI/bge-base-en-v1.5")


class EmbeddingService:
    """
    Generates embeddings for document chunks and search queries.
    """

    def generate_embedding(self, text: str) -> list[float]:
        embedding = _embedding_model.encode(
            text,
            normalize_embeddings=True,
        )

        return embedding.tolist()

    def generate_embeddings(self, texts: list[str]) -> list[list[float]]:
        embeddings = _embedding_model.encode(
            texts,
            normalize_embeddings=True,
        )

        return embeddings.tolist()