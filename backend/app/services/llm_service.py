from time import perf_counter

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.connectors.connector_factory import ConnectorFactory
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.conversation_service import get_conversation
from app.services.message_service import create_message


def generate_chat(
    request: ChatRequest,
    db: Session,
    user: User,
) -> ChatResponse:
    try:
        # Verify the conversation belongs to the current user
        conversation = get_conversation(
            db=db,
            conversation_id=request.conversation_id,
            user=user,
        )

        connector = ConnectorFactory.get_connector(request.provider)

        # Save the user's message
        create_message(
            db=db,
            conversation_id=conversation.id,
            role="user",
            content=request.prompt,
            provider=request.provider,
            model=request.model,
        )

        start_time = perf_counter()

        result = connector.generate(
            model_id=request.model,
            prompt=request.prompt,
        )

        latency = round(perf_counter() - start_time, 3)

        # Save the assistant's response
        create_message(
            db=db,
            conversation_id=conversation.id,
            role="assistant",
            content=result.response,
            provider=request.provider,
            model=request.model,
            latency=latency,
            prompt_tokens=result.prompt_tokens,
            completion_tokens=result.completion_tokens,
            total_tokens=result.total_tokens,
            estimated_cost=result.estimated_cost,
        )

        return ChatResponse(
            response=result.response,
            provider=request.provider,
            model=request.model,
            latency=latency,
            prompt_tokens=result.prompt_tokens,
            completion_tokens=result.completion_tokens,
            total_tokens=result.total_tokens,
            estimated_cost=result.estimated_cost,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response: {str(e)}",
        )