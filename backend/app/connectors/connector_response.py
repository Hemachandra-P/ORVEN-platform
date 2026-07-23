from pydantic import BaseModel


class ConnectorResponse(BaseModel):
    response: str

    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0

    estimated_cost: float = 0.0