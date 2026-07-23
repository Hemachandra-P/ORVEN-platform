from pydantic import BaseModel


class PromptInsight(BaseModel):
    prompt: str
    score: float
    latency: float


class EvaluationInsightsResponse(BaseModel):
    average_score: float
    pass_rate: float

    best_prompt: PromptInsight
    worst_prompt: PromptInsight

    fastest_prompt: PromptInsight
    slowest_prompt: PromptInsight