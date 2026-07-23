from pydantic import BaseModel


class EvaluationComparisonItem(BaseModel):
    evaluation_id: int
    evaluation_name: str

    project_name: str
    model_name: str
    provider: str

    success_rate: float
    average_latency: float

    total_prompts: int
    passed_prompts: int
    failed_prompts: int

    total_tokens: int
    total_cost: float


class EvaluationComparisonResponse(BaseModel):
    evaluations: list[EvaluationComparisonItem]