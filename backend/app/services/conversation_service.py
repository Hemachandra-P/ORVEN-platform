from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, selectinload
from fastapi import HTTPException
from app.models.conversation import Conversation
from app.models.user import User
from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
)


def create_conversation(
    db: Session,
    request: ConversationCreate,
    user: User,
) -> Conversation:

    conversation = Conversation(
        title=request.title,
        user_id=user.id,
    )

    try:
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        return conversation

    except SQLAlchemyError:
        db.rollback()
        raise

def get_conversations(
    db: Session,
    user: User,
    search: str | None = None,
    page: int = 1,
    size: int = 10,
):
    query = (
        db.query(Conversation)
        .filter(Conversation.user_id == user.id)
    )

    if search:
        query = query.filter(
            Conversation.title.ilike(f"%{search}%")
        )

    return (
        query.order_by(Conversation.updated_at.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

def get_conversation(
    db: Session,
    conversation_id: int,
    user: User,
):
    conversation = (
        db.query(Conversation)
        .options(
            selectinload(Conversation.messages)
        )
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user.id,
        )
        .first()
    )

    if conversation is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    conversation.messages.sort(
        key=lambda message: message.created_at
    )

    return conversation

def update_conversation(
    db: Session,
    conversation_id: int,
    request: ConversationUpdate,
    user: User,
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user.id,
        )
        .first()
    )

    if conversation is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    try:
        conversation.title = request.title

        db.commit()
        db.refresh(conversation)

        return conversation

    except SQLAlchemyError:
        db.rollback()
        raise

def delete_conversation(
    db: Session,
    conversation_id: int,
    user: User,
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user.id,
        )
        .first()
    )

    if conversation is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    try:
        db.delete(conversation)
        db.commit()

    except SQLAlchemyError:
        db.rollback()
        raise