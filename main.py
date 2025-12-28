# main.py
import os
from uuid import uuid4

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from backend.BucketModel import S3BucketModel
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
KNOWLEDGE_BASE_DATA_SOURCE = os.getenv("KNOWLEDGE_BASE_DATA_SOURCE")
BUCKET_NAME = os.getenv("BUCKET_NAME")

# -------------------------
# Services
# -------------------------
kb_model = KnowledgeBaseModel(
    knowledge_base_id=KNOWLEDGE_BASE_ID,
    data_source=KNOWLEDGE_BASE_DATA_SOURCE,
    region=REGION,
    # model_arn="us.anthropic.claude-3-5-haiku-20241022-v1:0",  # Either use inference profilee or model ARN
    # model_arn="arn:aws:bedrock:us-west-2:817406037539:inference-profile/us.amazon.nova-lite-v1:0",  # Either use inference profilee or model ARN
)

s3_model = S3BucketModel(
    bucket_name=BUCKET_NAME,
    region_name=REGION,
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


@app.get("/bucket")
async def list_bucket_objects():
    try:
        objects = s3_model.list_objects()
        return {"documents": objects}
    except Exception as e:
        return {"error": str(e)}


@app.post("/bucket/upload")
async def upload_file(file: UploadFile = File(...)):
    print(file)
    try:
        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(status_code=400, detail="Empty file")

        extension = os.path.splitext(file.filename)[1]
        name = file.filename
        s3_key = f"{name}{extension}"

        s3_model.upload_bytes(
            data=file_bytes,
            key=s3_key,
            content_type=file.content_type,
        )
        kb_model.sync_data_source()

        return {
            "message": "Upload successful",
            "filename": file.filename,
            "s3_key": s3_key,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def main():
    uvicorn.run(
        "main:app",  # module:app
        host="127.0.0.1",
        port=8000,
        reload=True,  # auto-reload in development
    )


if __name__ == "__main__":
    main()
