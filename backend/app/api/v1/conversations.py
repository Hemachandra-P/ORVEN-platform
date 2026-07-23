from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.session import get_db

from app.models.user import User

from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
    ConversationResponse,
    ConversationDetailResponse,
)
from app.services.conversation_service import (
    create_conversation,
    get_conversations,
    get_conversation,
    update_conversation,
    delete_conversation,
)

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post(
    "",
    response_model=ConversationResponse,
)
def create(
    request: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return create_conversation(
        db,
        request,
        current_user,
    )

@router.get(
    "",
    response_model=list[ConversationResponse],
)
def list_conversations(
    search: str | None = None,
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_conversations(
    db=db,
    user=current_user,
    search=search,
    page=page,
    size=size,
)

@router.get(
    "/{conversation_id}",
    response_model=ConversationDetailResponse,
)
def get_one(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_conversation(
        db,
        conversation_id,
        current_user,
    )

@router.patch(
    "/{conversation_id}",
    response_model=ConversationResponse,
)
def update(
    conversation_id: int,
    request: ConversationUpdate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return update_conversation(
        db=db,
        conversation_id=conversation_id,
        request=request,
        user=current_user,
    )

@router.delete(
    "/{conversation_id}",
    status_code=204,
)
def delete(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    delete_conversation(
        db=db,
        conversation_id=conversation_id,
        user=current_user,
    )