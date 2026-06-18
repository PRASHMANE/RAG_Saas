from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.document import router as document_router 
from app.api.chat import router as chat_router
from app.api.settings import (
    router as settings_router
)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RAG SaaS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(document_router)
app.include_router(chat_router)
app.include_router(
    settings_router
)

@app.get("/")
def health_check():
    return {"status": "ok"}