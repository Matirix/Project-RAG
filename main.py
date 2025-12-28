# main.py
import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.KnowledgeBaseModel import KnowledgeBaseModel
from backend.schemas import TextInput

load_dotenv()

app = FastAPI()
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# ENV
# -------------------------
REGION = os.getenv("REGION", "us-west-2")
KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID")

# -------------------------
# Services
# -------------------------
kb_model = KnowledgeBaseModel(
    knowledge_base_id=KNOWLEDGE_BASE_ID,
    region=REGION,
    # model_arn="us.anthropic.claude-3-5-haiku-20241022-v1:0",  # Either use inference profilee or model ARN
    # model_arn="arn:aws:bedrock:us-west-2:817406037539:inference-profile/us.amazon.nova-lite-v1:0",  # Either use inference profilee or model ARN
)


# -------------------------
# Routes
# -------------------------
@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/retrieve_and_generate")
def chat(payload: TextInput):
    return kb_model.retrieve_and_generate(
        text=payload.text,
        session_id=payload.session_id,
    )


def main():
    uvicorn.run(
        "main:app",  # module:app
        host="127.0.0.1",
        port=8000,
        reload=True,  # auto-reload in development
    )


if __name__ == "__main__":
    main()
