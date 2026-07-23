from pydantic import BaseModel


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5


class SearchResult(BaseModel):
    document_id: int
    chunk_index: int
    content: str