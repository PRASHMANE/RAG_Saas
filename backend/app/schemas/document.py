from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    id: UUID
    filename: str

    model_config = ConfigDict(
        from_attributes=True
    )