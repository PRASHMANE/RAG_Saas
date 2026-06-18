from pydantic import BaseModel, EmailStr
from uuid import UUID


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str | None

    model_config = {
        "from_attributes": True
    }

class LogoutRequest(BaseModel):
    refresh_token: str