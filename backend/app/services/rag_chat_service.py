from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse

from app.services.search_service import SearchService
from app.services.prompt_builder import PromptBuilder

from app.connectors.connector_factory import ConnectorFactory

from app.services.conversation_service import get_conversation
from app.services.message_service import create_message


class RAGChatService:

    def __init__(self):
        self.search_service = SearchService()

    def generate_chat(
        self,
        request: ChatRequest,
        db: Session,
        user: User,
    ) -> ChatResponse:

        conversation = get_conversation(
            db=db,
            conversation_id=request.conversation_id,
            user=user,
        )

        create_message(
            db=db,
            conversation_id=conversation.id,
            role="user",
            content=request.prompt,
            provider=request.provider,
            model=request.model,
        )

        chunks = self.search_service.search(
            db=db,
            query=request.prompt,
            limit=5,
        )

        prompt = PromptBuilder.build(
            question=request.prompt,
            context_chunks=[
                chunk.content
                for chunk in chunks
            ],
        )

        connector = ConnectorFactory.get_connector(
            request.provider
        )

        result = connector.generate(
            model_id=request.model,
            prompt=prompt,
        )

        create_message(
            db=db,
            conversation_id=conversation.id,
            role="assistant",
            content=result.response,
            provider=request.provider,
            model=request.model,
            latency=0,
            prompt_tokens=result.prompt_tokens,
            completion_tokens=result.completion_tokens,
            total_tokens=result.total_tokens,
            estimated_cost=result.estimated_cost,
        )

        return ChatResponse(
            response=result.response,
            provider=request.provider,
            model=request.model,
            latency=0,
            prompt_tokens=result.prompt_tokens,
            completion_tokens=result.completion_tokens,
            total_tokens=result.total_tokens,
            estimated_cost=result.estimated_cost,
        )