import json
import os
import uuid

import boto3
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
load_dotenv()
# Define allowed origins
origins = [
    "http://localhost:5173",  # your React dev server
    # "https://my-production-site.com"  # add more if needed
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # allow all headers
)

# ENV Variables:
ACCESS_KEY = os.getenv("ACCESS_KEY")
ACCESS_KEY_PASS = os.getenv("ACCESS_KEY_PASS")
REGION = os.getenv("REGION")
KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID")


# -------------------------
# Request models
# -------------------------
class TextInput(BaseModel):
    text: str
    session_id: str | None = None


# -------------------------
# Endpoints
# -------------------------
bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-west-2")
bedrock_agent_runtime = boto3.client("bedrock-agent-runtime", region_name="us-west-2")


@app.get("/")
def health_check():
    """
    Simple health check endpoint
    """
    return {"status": "ok"}


@app.post("/retrieve_and_generate")
def chat(payload: TextInput):
    model_arn = "us.amazon.nova-micro-v1:0"
    session_id = payload.session_id or None

    response = bedrock_agent_runtime.retrieve_and_generate(
        input={"text": payload.text},
        retrieveAndGenerateConfiguration={
            "type": "KNOWLEDGE_BASE",
            "knowledgeBaseConfiguration": {
                "knowledgeBaseId": KNOWLEDGE_BASE_ID,
                "modelArn": model_arn,
                "generationConfiguration": {
                    "inferenceConfig": {
                        "textInferenceConfig": {
                            "maxTokens": 1000,
                            "temperature": 0.4,
                            "topP": 0.9,
                        }
                    }
                },
            },
        },
    )

    output_text = response["output"]["text"]
    session_id = response["sessionId"]

    citations = []
    for citation in response.get("citations", []):
        refs = []
        for ref in citation.get("retrievedReferences", []):
            refs.append(
                {
                    "text": ref["content"]["text"],
                    "location": ref.get("location"),
                    "score": ref.get("score"),
                }
            )
        citations.append(refs)

    rag_response = {
        "text": output_text,
        "citations": citations,
        "session_id": session_id,
    }

    return rag_response


@app.post("/echo")
def echo_text(payload: TextInput):
    """
    Echoes back the provided text
    """
    return {"original_text": payload.text, "length": len(payload.text)}


def main():
    uvicorn.run(
        "main:app",  # module:app
        host="127.0.0.1",
        port=8000,
        reload=True,  # auto-reload in development
    )


if __name__ == "__main__":
    main()
