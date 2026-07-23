from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.session import get_db
from app.models.user import User
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
)
from app.services.llm_service import generate_chat

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "/completions",
    response_model=ChatResponse,
)
def chat_completion(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return generate_chat(
        request=request,
        db=db,
        user=current_user,
    )