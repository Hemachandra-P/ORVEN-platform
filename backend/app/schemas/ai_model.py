from pydantic import BaseModel

from app.models.enums import AIProvider


class AIModelCreate(BaseModel):
    name: str
    provider: AIProvider
    model_id: str
    description: str | None = None
    endpoint: str | None = None
    context_window: int | None = None
    supports_vision: bool = False
    supports_tool_calling: bool = False
    supports_streaming: bool = False
    temperature: float = 0.7
    max_tokens: int = 4096
    project_id: int


class AIModelUpdate(BaseModel):
    name: str | None = None
    provider: AIProvider | None = None
    model_id: str | None = None
    description: str | None = None
    endpoint: str | None = None
    context_window: int | None = None
    supports_vision: bool | None = None
    supports_tool_calling: bool | None = None
    supports_streaming: bool | None = None
    temperature: float | None = None
    max_tokens: int | None = None
    is_active: bool | None = None


class AIModelResponse(BaseModel):
    id: int
    name: str
    provider: AIProvider
    model_id: str
    description: str | None
    endpoint: str | None
    context_window: int | None
    supports_vision: bool
    supports_tool_calling: bool
    supports_streaming: bool
    temperature: float
    max_tokens: int
    is_active: bool
    project_id: int

    model_config = {
        "from_attributes": True
    }