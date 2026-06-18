from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.auth.dependencies import (
    get_current_user,
)

from app.models.user import User

from app.schemas.api_key import (
    ApiKeyRequest,
)

from app.services.encryption import (
    encrypt_api_key,
)

router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


@router.post("/api-key")
def save_api_key(
    payload: ApiKeyRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    current_user.groq_api_key = (
        encrypt_api_key(
            payload.api_key
        )
    )

    db.add(current_user)

    db.commit()

    return {
        "message": "API key saved"
    }