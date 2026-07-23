from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    organization_id: int


class ProjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str | None
    organization_id: int
    is_active: bool

    model_config = {
        "from_attributes": True
    }