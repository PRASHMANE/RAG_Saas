# 🤖 RAG SaaS – Multi-Tenant AI PDF Chat Platform

A production-oriented Retrieval-Augmented Generation (RAG) SaaS platform that enables users to upload PDF documents and interact with them using Large Language Models.

The application extracts content from PDFs, generates semantic embeddings, stores them in user-specific vector databases, retrieves relevant context, and produces accurate responses using Groq LLMs.

Built with scalability, security, and multi-tenancy in mind.

---

## 🚀 Live Features

* 🔐 JWT-based authentication
* 👤 Multi-user architecture
* 📄 PDF upload and management
* 🧠 Automatic text extraction and chunking
* 🔎 Semantic search using vector embeddings
* 🗂️ User-isolated FAISS vector databases
* 💬 Conversational AI over uploaded documents
* 🔑 User-provided Groq API keys
* 🔒 Fernet-encrypted API key storage
* ⚡ FastAPI backend with async support
* 🎨 React + TypeScript frontend
* 🐳 Docker-ready project structure

---

# 📸 Screenshots

Add screenshots here before publishing:

* Login page
* Dashboard
* PDF upload flow
* Chat interface
* API key modal

Example:

```md
![Dashboard](./assets/dashboard.png)
```

---

# 🏗️ High-Level Architecture

```text
┌──────────────┐
│ React Client │
└──────┬───────┘
       │ HTTP/JSON
       ▼
┌──────────────┐
│   FastAPI    │
│ Authentication
│ Document APIs
│ Chat APIs
└──────┬───────┘
       │
       ├───────────────┐
       │               │
       ▼               ▼
┌──────────┐    ┌───────────────┐
│ SQL DB   │    │ FAISS Vector  │
│ Users    │    │ Stores        │
│ Docs     │    │ Per User      │
│ API Keys │    └──────┬────────┘
└──────────┘           │
                       ▼
               ┌──────────────┐
               │ HuggingFace  │
               │ Embeddings   │
               └──────┬───────┘
                      ▼
               ┌──────────────┐
               │ Groq LLM API │
               └──────────────┘
```

---

# 🧠 RAG Pipeline

```text
PDF Upload
    │
    ▼
Text Extraction
    │
    ▼
Chunking
    │
    ▼
Embedding Generation
    │
    ▼
FAISS Vector Storage
    │
    ▼
Retriever
    │
    ▼
Prompt Construction
    │
    ▼
Groq LLM
    │
    ▼
Response
```

---

# ⚙️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Zustand
* Axios
* Tailwind CSS
* Lucide Icons

## Backend

* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication
* Alembic

## AI Stack

* LangChain
* HuggingFace Embeddings
* FAISS
* Groq LLMs

## Database

* PostgreSQL / SQLite

## Security

* Fernet Encryption
* Password Hashing
* Environment Variables

## DevOps

* Docker
* GitHub
* GitHub Actions (planned)

---

# 📂 Project Structure

```text
rag-saas/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── document.py
│   │   │   ├── chat.py
│   │   │   └── api_key.py
│   │   │
│   │   ├── auth/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── rag/
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── vectorstores/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── App.tsx
│   │
│   ├── package.json
│   └── .env
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

---

# 🗄️ Database Design

## users

| Column             | Type      | Description      |
| ------------------ | --------- | ---------------- |
| id                 | UUID      | Primary key      |
| full_name          | String    | User name        |
| email              | String    | Unique email     |
| hashed_password    | String    | Bcrypt hash      |
| encrypted_groq_key | Text      | Fernet encrypted |
| created_at         | Timestamp | Creation time    |

---

## refresh_tokens

| Column     | Type      | Description   |
| ---------- | --------- | ------------- |
| id         | UUID      | Primary key   |
| user_id    | UUID      | Foreign key   |
| token      | String    | Refresh token |
| expires_at | Timestamp | Expiry time   |

---

## documents

| Column     | Type      | Description       |
| ---------- | --------- | ----------------- |
| id         | UUID      | Primary key       |
| user_id    | UUID      | Foreign key       |
| filename   | String    | Original filename |
| created_at | Timestamp | Upload time       |

---

# 🧩 Entity Relationship Diagram

```text
Users
  │
  ├───< Documents
  │
  └───< RefreshTokens
```

---

# 🔒 Security Design

## Authentication

* Access tokens via JWT
* Refresh token support
* Password hashing using bcrypt

## API Key Security

Groq API keys are:

1. Submitted by users
2. Encrypted using Fernet
3. Stored in the database
4. Decrypted only during inference

## Data Isolation

Each user receives a dedicated vector store.

Example:

```text
vectorstores/

├── user_1/
├── user_2/
├── user_3/
```

Users cannot access each other's documents.

---

# 📄 PDF Processing Flow

```python
documents = load_pdf(file_path)

chunks = split_documents(documents)

create_vectorstore(
    chunks,
    str(current_user.id),
)
```

### Step 1: Extract Text

Uses PDF loaders to extract content.

### Step 2: Chunk Documents

Splits large text into smaller semantic chunks.

### Step 3: Generate Embeddings

Uses:

```text
sentence-transformers/all-MiniLM-L6-v2
```

### Step 4: Store Embeddings

Stores vectors inside FAISS.

---

# 🔎 Retrieval Flow

```python
vectorstore = load_vectorstore(
    str(current_user.id)
)

retriever = vectorstore.as_retriever(
    search_kwargs={"k": 4}
)
```

The retriever fetches the top 4 relevant chunks.

These chunks are injected into the LLM prompt.

---

# 💬 Chat Flow

```text
User Question
      │
      ▼
Retrieve Similar Chunks
      │
      ▼
Build Prompt
      │
      ▼
Send to Groq
      │
      ▼
Return Response
```

---

# ⚡ API Endpoints

## Authentication

```http
POST /auth/register
POST /auth/login
POST /auth/refresh
GET  /auth/me
```

---

## Documents

```http
POST /documents/upload
GET  /documents
DELETE /documents/{id}
```

---

## Chat

```http
POST /chat
```

Request:

```json
{
  "document_id": "uuid",
  "question": "Summarize this PDF"
}
```

Response:

```json
{
  "answer": "..."
}
```

---

## API Keys

```http
POST /api-keys
GET  /api-keys/status
DELETE /api-keys
```

---

# 🧪 Local Development Setup

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/rag-saas.git

cd rag-saas
```

---

## Backend Setup

```bash
cd backend

python -m venv myvenv

source myvenv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env`:

```env
DATABASE_URL=sqlite:///./rag.db

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30

ENCRYPTION_KEY=your_fernet_key
```

Generate encryption key:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Run backend:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

# 🐳 Docker Commands

Build containers:

```bash
docker compose build
```

Start services:

```bash
docker compose up
```

Stop services:

```bash
docker compose down
```

Rebuild:

```bash
docker compose up --build
```

---

# 🧰 Useful Development Commands

## Backend

Run server:

```bash
uvicorn app.main:app --reload
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Freeze requirements:

```bash
pip freeze > requirements.txt
```

Run migrations:

```bash
alembic upgrade head
```

Create migration:

```bash
alembic revision --autogenerate -m "message"
```

---

## Frontend

Install packages:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint code:

```bash
npm run lint
```

---

## Git

Initialize:

```bash
git init
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Initial commit"
```

Push:

```bash
git push origin main
```

---

# 📈 Future Improvements

* Multi-document retrieval
* Streaming responses
* Chat history persistence
* Background processing with Celery
* Redis caching
* S3 document storage
* Kubernetes deployment
* Rate limiting
* Usage analytics
* Team workspaces
* Subscription billing
* Admin dashboard

---

# 🎯 Engineering Challenges Solved

* Multi-tenant vector storage
* Secure API key management
* RAG pipeline orchestration
* JWT authentication
* Vector similarity search
* Document lifecycle management
* Frontend state synchronization

---

# 💡 Key Learnings

* Designing scalable RAG architectures
* Handling user isolation in vector databases
* Securing third-party API credentials
* Building production-ready FastAPI services
* Integrating LangChain with modern frontend stacks

---

# 🤝 Contributing

```bash
git checkout -b feature/new-feature

git commit -m "Add new feature"

git push origin feature/new-feature
```

Open a Pull Request.

---

# 📄 License

MIT License

---

# 👨‍💻 Author

**Prashanth V**

If you found this project useful, consider giving it a ⭐ on GitHub.
