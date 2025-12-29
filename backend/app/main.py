# main.py
import os

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from models.bucket_model import S3BucketModel
from models.knowledge_base_model import KnowledgeBaseModel
from models.settings_model import Settings
from models.text_input_model import TextInput

app = FastAPI()
settings = Settings()  # pyright: ignore[reportCallIssue]
origins = ["http://localhost:5173", "http://localhost"]


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
REGION = settings.region
KNOWLEDGE_BASE_ID = settings.knowledge_base_id
KNOWLEDGE_BASE_DATA_SOURCE = settings.knowledge_base_data_source
BUCKET_NAME = settings.bucket_name


# -------------------------
# Routes
# -------------------------
@app.on_event("startup")
def startup_event():
    app.state.kb_model = KnowledgeBaseModel(
        knowledge_base_id=KNOWLEDGE_BASE_ID,
        data_source=KNOWLEDGE_BASE_DATA_SOURCE,
        region=REGION,
        # model_arn="us.anthropic.claude-3-5-haiku-20241022-v1:0",  # Either use inference profilee or model ARN
        # model_arn="arn:aws:bedrock:us-west-2:817406037539:inference-profile/us.amazon.nova-lite-v1:0",  # Either use inference profilee or model ARN
    )

    app.state.s3_model = S3BucketModel(
        bucket_name=BUCKET_NAME,
        region_name=REGION,
    )


@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/retrieve_and_generate")
def chat(payload: TextInput):
    return app.state.kb_model.retrieve_and_generate(
        text=payload.text,
        session_id=payload.session_id,
    )


@app.get("/bucket")
async def list_bucket_objects():
    try:
        objects = app.state.s3_model.list_objects()
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

        app.state.s3_model.upload_bytes(
            data=file_bytes,
            key=s3_key,
            content_type=file.content_type,
        )
        app.state.kb_model.sync_data_source()

        return {
            "message": "Upload successful",
            "filename": file.filename,
            "s3_key": s3_key,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
