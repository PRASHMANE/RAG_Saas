import os
import shutil

from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
)

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user

from app.db.dependencies import get_db

from app.models.user import User
from app.models.document import Document

from app.schemas.document import (
    DocumentResponse,
)

from app.rag.loader import load_pdf
from app.rag.splitter import (
    split_documents,
)
from app.rag.vectorstore import (
    create_vectorstore,
)

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True,
)


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    file_path = os.path.join(
        UPLOAD_DIR,
        f"{current_user.id}_{file.filename}",
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    documents = load_pdf(file_path)

    chunks = split_documents(
        documents
    )

    create_vectorstore(
        chunks,
        str(current_user.id),
    )

    document = Document(
        filename=file.filename,
        user_id=current_user.id,
    )

    db.add(document)

    db.commit()

    db.refresh(document)

    return {
        "message": "PDF uploaded successfully",
        "file_name": file.filename,
        "document_id": str(document.id),
    }


@router.get(
    "/",
    response_model=list[DocumentResponse],
)
async def get_documents(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    result = db.execute(
        select(Document).where(
            Document.user_id
            == current_user.id
        )
    )

    return result.scalars().all()