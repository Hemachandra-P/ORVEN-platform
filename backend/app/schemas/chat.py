from pydantic import BaseModel


class ChatRequest(BaseModel):
    conversation_id: int
    provider: str
    model: str
    prompt: str

class ChatResponse(BaseModel):
    response: str

    provider: str
    model: str

    latency: float

    prompt_tokens: int
    completion_tokens: int
    total_tokens: int

    estimated_cost: float