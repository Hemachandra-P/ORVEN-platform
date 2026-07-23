from pydantic import BaseModel, EmailStr, Field
from app.core.roles import UserRole
from pydantic import BaseModel
from app.core.roles import UserRole


class UpdateUserRole(BaseModel):
    role: UserRole


class UserCreate(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    role: UserRole

    model_config = {
        "from_attributes": True
    }

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str