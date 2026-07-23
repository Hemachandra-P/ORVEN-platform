from pydantic import BaseModel



class EvaluationMetricsResponse(BaseModel):
    evaluation_id: int
    total_prompts: int
    passed_prompts: int
    failed_prompts: int
    success_rate: float
    average_latency: float
    total_tokens: int
    total_cost: float

    model_config = {
        "json_schema_extra": {
            "example": {
                "evaluation_id": 8,
                "total_prompts": 10,
                "passed_prompts": 9,
                "failed_prompts": 1,
                "success_rate": 90.0,
                "average_latency": 1.42,
                "total_tokens": 5830,
                "total_cost": 0.0214,
            }
        }
    }


# ----------------------------
# ADD THIS BELOW
# ----------------------------

class ProjectMetricsResponse(BaseModel):
    project_id: int
    total_evaluations: int
    completed_evaluations: int
    failed_evaluations: int
    average_latency: float
    total_tokens: int
    total_cost: float
    average_success_rate: float

    model_config = {
        "json_schema_extra": {
            "example": {
                "project_id": 1,
                "total_evaluations": 5,
                "completed_evaluations": 4,
                "failed_evaluations": 1,
                "average_latency": 1.83,
                "total_tokens": 12540,
                "total_cost": 0.084,
                "average_success_rate": 96.5,
            }
        }
    }

class ProviderMetricsResponse(BaseModel):
    provider: str
    total_evaluations: int
    completed_evaluations: int
    failed_evaluations: int
    average_latency: float
    total_tokens: int
    total_cost: float
    average_success_rate: float

    model_config = {
        "json_schema_extra": {
            "example": {
                "provider": "OPENAI",
                "total_evaluations": 8,
                "completed_evaluations": 8,
                "failed_evaluations": 0,
                "average_latency": 1.82,
                "total_tokens": 24531,
                "total_cost": 0.42,
                "average_success_rate": 98.2,
            }
        }
    }

class DashboardMetricsResponse(BaseModel):
    total_projects: int
    total_models: int
    total_datasets: int
    total_evaluations: int

    completed_evaluations: int
    failed_evaluations: int
    running_evaluations: int
    pending_evaluations: int

    total_tokens: int
    total_cost: float
    average_latency: float

    providers: dict[str, int]

    model_config = {
        "json_schema_extra": {
            "example": {
                "total_projects": 4,
                "total_models": 7,
                "total_datasets": 6,
                "total_evaluations": 24,
                "completed_evaluations": 18,
                "failed_evaluations": 3,
                "running_evaluations": 2,
                "pending_evaluations": 1,
                "total_tokens": 82341,
                "total_cost": 1.284,
                "average_latency": 1.72,
                "providers": {
                    "OPENAI": 8,
                    "GROQ": 7,
                    "OLLAMA": 5,
                    "LMSTUDIO": 4
                }
            }
        }
    }