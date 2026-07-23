from datetime import datetime
from pydantic import BaseModel

from app.models.enums import EvaluationStatus


class EvaluationCreate(BaseModel):
    name: str
    project_id: int
    dataset_id: int
    model_id: int


class EvaluationUpdate(BaseModel):
    name: str | None = None
    status: EvaluationStatus | None = None


class EvaluationResponse(BaseModel):
    id: int
    name: str
    status: EvaluationStatus

    project_id: int
    dataset_id: int
    model_id: int

    created_by: int

    started_at: datetime | None
    completed_at: datetime | None

    created_at: datetime | None

    model_config = {
        "from_attributes": True
    }