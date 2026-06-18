import uuid

from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.session import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    email = Column(String, unique=True, nullable=False, index=True)

    full_name = Column(String, nullable=True)

    password_hash = Column(String, nullable=True)

    google_id = Column(String, nullable=True, unique=True)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    groq_api_key = Column(
        String,
        nullable=True,
    )

    documents = relationship(
    "Document",
    back_populates="user",
    cascade="all, delete-orphan",
)