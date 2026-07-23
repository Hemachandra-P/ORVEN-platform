from pydantic import BaseModel


class EvaluationAnalyticsResponse(BaseModel):
    total_evaluations: int

    completed_evaluations: int
    failed_evaluations: int
    running_evaluations: int
    pending_evaluations: int

    average_success_rate: float
    average_latency: float

    total_tokens: int
    total_cost: float

    best_provider: str