from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.session import get_db
from app.models.user import User
from app.schemas.search import SearchRequest, SearchResult
from app.services.search_service import SearchService

router = APIRouter(
    prefix="/search",
    tags=["Semantic Search"],
)


@router.post(
    "",
    response_model=list[SearchResult],
)
def semantic_search(
    request: SearchRequest,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    service = SearchService()

    chunks = service.search(
        db=db,
        query=request.query,
        limit=request.top_k,
    )

    return [
        SearchResult(
            document_id=chunk.document_id,
            chunk_index=chunk.chunk_index,
            content=chunk.content,
        )
        for chunk in chunks
    ]