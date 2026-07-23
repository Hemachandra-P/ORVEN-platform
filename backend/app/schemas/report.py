from pydantic import BaseModel


class EvaluationSummary(BaseModel):
    total_prompts: int
    passed_prompts: int
    failed_prompts: int
    success_rate: float
    average_latency: float
    total_tokens: int
    total_cost: float


class EvaluationResultReport(BaseModel):
    prompt: str
    expected_answer: str | None
    model_response: str | None
    score: float | None
    passed: bool | None
    latency: float | None
    total_tokens: int 


class EvaluationReportResponse(BaseModel):
    evaluation_id: int
    evaluation_name: str

    project_name: str
    dataset_name: str
    model_name: str

    status: str

    summary: EvaluationSummary

    results: list[EvaluationResultReport]

    model_config = {
        "json_schema_extra": {
            "example": {
                "evaluation_id": 1,
                "evaluation_name": "GPT-4 QA Benchmark",
                "project_name": "Customer Support Bot",
                "dataset_name": "FAQ Dataset",
                "model_name": "GPT-4o-mini",
                "status": "COMPLETED",
                "summary": {
                    "total_prompts": 100,
                    "passed_prompts": 94,
                    "failed_prompts": 6,
                    "success_rate": 94.0,
                    "average_latency": 1.42,
                    "total_tokens": 52341,
                    "total_cost": 0.83
                },
                "results": [
                    {
                        "prompt": "What is AI?",
                        "expected_answer": "Artificial Intelligence",
                        "model_response": "AI stands for Artificial Intelligence.",
                        "score": 0.98,
                        "passed": True,
                        "latency": 1.15,
                        "total_tokens": 145
                    }
                ]
            }
        }
    }