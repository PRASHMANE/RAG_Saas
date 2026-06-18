from fastapi import APIRouter, Depends, HTTPException
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser

from app.auth.dependencies import get_current_user
from app.models.user import User
from app.rag.vectorstore import load_vectorstore
from app.schemas.chat import ChatRequest
from app.services.encryption import (
    decrypt_api_key,
)

router = APIRouter(prefix="/chat", tags=["Chat"])

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a helpful AI assistant.
Answer the question based ONLY on the context provided below.
If the answer is not in the context, say 'I don't know based on the provided documents.'

<context>
{context}
</context>"""),
    ("human", "{input}")
])

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

@router.post("/")
async def ask_question(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    # 1. Load vector DB
    try:
        vectorstore = load_vectorstore(str(current_user.id))
    except Exception:
        raise HTTPException(status_code=404, detail="No documents found. Upload a PDF first.")

    # 2. Validate API key
    
    
    if not current_user.groq_api_key:
        raise HTTPException(
            status_code=400,
            detail="Please add your Groq API key",
        )

    groq_api_key = decrypt_api_key(
        current_user.groq_api_key
    )

    # 3. LLM
    llm = ChatGroq(
        groq_api_key=groq_api_key,
        model="llama-3.3-70b-versatile",
        temperature=0.2,
        max_tokens=1024,
    )

    # 4. Retriever
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4}
    )

    # 5. LCEL Chain (modern way, no langchain.chains needed)
    chain = (
        {
            "context": retriever | RunnableLambda(format_docs),
            "input": RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    # 6. Run
    try:
        answer = chain.invoke(payload.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")

    return {"answer": answer}