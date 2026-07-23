from pydantic import BaseModel


class OrganizationCreate(BaseModel):
    name: str
    description: str | None = None


class OrganizationUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None


class OrganizationResponse(BaseModel):
    id: int
    name: str
    description: str | None
    is_active: bool

    model_config = {
        "from_attributes": True
    }