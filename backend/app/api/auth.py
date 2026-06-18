from fastapi import APIRouter

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.hashing import hash_password
from app.db.dependencies import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest

from app.core.config import settings
from app.models.refresh_token import RefreshToken
from app.auth.hashing import hash_password

from datetime import datetime, timedelta, timezone
from app.auth.hashing import verify_password
from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
)
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
)

from app.auth.dependencies import get_current_user
from app.schemas.auth import UserResponse

from app.auth.hashing import verify_password
from app.schemas.auth import LogoutRequest
from app.models.refresh_token import RefreshToken


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register", status_code=201)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User created successfully"
    }



@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    if not verify_password(
        payload.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    access_token = create_access_token(str(user.id))

    refresh_token = create_refresh_token(str(user.id))

    db_refresh_token = RefreshToken(
    user_id=user.id,
    token_hash=hash_password(refresh_token),
    expires_at=datetime.now(timezone.utc)
    + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )

    db.add(db_refresh_token)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user




@router.post("/logout")
def logout(
    payload: LogoutRequest,
    db: Session = Depends(get_db),
):
    tokens = (
        db.query(RefreshToken)
        .filter(RefreshToken.revoked == False)
        .all()
    )

    matched_token = None

    for token in tokens:
        if verify_password(
            payload.refresh_token,
            token.token_hash,
        ):
            matched_token = token
            break

    if matched_token:
        matched_token.revoked = True
        db.commit()

    return {
        "message": "Logged out successfully"
    }