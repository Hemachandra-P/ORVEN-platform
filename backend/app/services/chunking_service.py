from langchain_text_splitters import RecursiveCharacterTextSplitter


class ChunkingService:
    """
    Splits extracted document text into overlapping chunks
    suitable for embedding generation.
    """

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                "",
            ],
        )

    def split_text(self, text: str) -> list[str]:
        """
        Split document into chunks.
        """

        if not text or not text.strip():
            return []

        return self.splitter.split_text(text)