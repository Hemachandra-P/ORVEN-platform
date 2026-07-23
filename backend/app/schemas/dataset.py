from pydantic import BaseModel

from app.models.enums import (
    DatasetType,
    DatasetCreationMethod,
    DatasetStatus,
)


class DatasetCreate(BaseModel):
    name: str
    description: str | None = None
    dataset_type: DatasetType
    creation_method: DatasetCreationMethod
    status: DatasetStatus = DatasetStatus.CREATING
    total_prompts: int = 0
    file_name: str | None = None
    file_path: str | None = None
    project_id: int


class DatasetUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    dataset_type: DatasetType | None = None
    creation_method: DatasetCreationMethod | None = None
    status: DatasetStatus | None = None
    total_prompts: int | None = None
    file_name: str | None = None
    file_path: str | None = None


class DatasetResponse(BaseModel):
    id: int
    name: str
    description: str | None
    dataset_type: DatasetType
    creation_method: DatasetCreationMethod
    status: DatasetStatus
    total_prompts: int
    file_name: str | None
    file_path: str | None
    project_id: int
    created_by: int

    model_config = {
        "from_attributes": True
    }