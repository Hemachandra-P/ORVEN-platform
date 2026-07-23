from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.message import Message


def create_message(
    db: Session,
    conversation_id: int,
    role: str,
    content: str,
    provider: str,
    model: str,
    latency: float = 0.0,
    prompt_tokens: int = 0,
    completion_tokens: int = 0,
    total_tokens: int = 0,
    estimated_cost: float = 0.0,
):
    try:
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            provider=provider,
            model=model,
            latency=latency,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            estimated_cost=estimated_cost,
        )

        db.add(message)
        db.commit()
        db.refresh(message)

        return message

    except SQLAlchemyError:
        db.rollback()
        raise