import os

from langchain_community.vectorstores import FAISS

from app.rag.embeddings import embeddings


VECTOR_DIR = "vectorstores"


def create_vectorstore(chunks, user_id: str):
    vectorstore = FAISS.from_documents(
        chunks,
        embeddings,
    )

    path = os.path.join(VECTOR_DIR, user_id)

    vectorstore.save_local(path)

    return path


def load_vectorstore(user_id: str):
    path = os.path.join(VECTOR_DIR, user_id)

    return FAISS.load_local(
        path,
        embeddings,
        allow_dangerous_deserialization=True,
    )