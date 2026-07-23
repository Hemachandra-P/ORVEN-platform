from pydantic import BaseModel


class BenchmarkItem(BaseModel):
    model_name: str
    provider: str

    evaluations: int

    average_success_rate: float
    average_latency: float

    total_tokens: int
    total_cost: float


class BenchmarkResponse(BaseModel):
    models: list[BenchmarkItem]