from pydantic import BaseModel


class EvaluationLeaderboardItem(BaseModel):
    rank: int
    evaluation_id: int
    evaluation_name: str
    project_name: str
    model_name: str
    provider: str

    success_rate: float
    average_latency: float
    total_tokens: int
    total_cost: float


class EvaluationLeaderboardResponse(BaseModel):
    leaderboard: list[EvaluationLeaderboardItem]