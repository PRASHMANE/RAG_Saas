from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str
    groq_api_key: str