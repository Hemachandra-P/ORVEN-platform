from datetime import datetime
from pydantic import BaseModel


class EvaluationResultResponse(BaseModel):
    id: int

    evaluation_id: int
    dataset_prompt_id: int

    prompt: str

    expected_answer: str | None

    model_response: str | None

    score: float | None

    passed: bool | None

    latency: float | None

    created_at: datetime | None

    model_config = {
        "from_attributes": True
    }