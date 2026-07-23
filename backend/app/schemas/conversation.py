from datetime import datetime

from pydantic import BaseModel


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    provider: str
    model: str
    latency: float
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    estimated_cost: float
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationCreate(BaseModel):
    title: str

class ConversationUpdate(BaseModel):
    title: str


class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationDetailResponse(ConversationResponse):
    messages: list[MessageResponse]

    class Config:
        from_attributes = True