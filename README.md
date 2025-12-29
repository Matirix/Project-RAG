# Project-RAG
A Retrieval-Augmented Generation (RAG) application consisting of:
	•	Backend: Python + FastAPI + AWS Bedrock / Knowledge Base
	•	Frontend: Vite + React (built and served via Nginx)
	•	Containerized using Docker and Docker ComposeTo run:

The Bedrock / Knowledge base relies on Amazon Micro. This can be reconfigured, depending on 
the model, but do note that there may be different processes you need to go through before using
different models (like Anthropic).


## Pre-Reqs
Before running this project, ensure you have:
AWS Account:
- Configured Knowledge Base
- S3 bucket
Aws credentials configured locally (via aws login)
Docker and Docker Compose v2
Python 3.12+, Deno

## Environment Variables
### In the Backend folder:
Have a .env located at the root of backend with the following:
backend/.env
```
REGION=<aws-region-here>
KNOWLEDGE_BASE_ID=<knowledge-base-id-here>
KNOWLEDGE_BASE_DATA_SOURCE=<knowledge-base-data-source-here>
BUCKET_NAME=<bucket-name-here>
```
## Running Options
This is configured for docker and just for local environment.

### Local Environment:
Make a py_env in the backend folder and install requirements:
```python
python -m venv py_env
source py_env/bin/activate
pip install -r requirements.txt
```

Option 1: Run ./dev.sh
Option 2: Manually:
Backend:
```bash
cd backend/app
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Frontend:
```bash
cd frontend
deno run dev
```
### Docker
Option 1: docker compose up --build
Option 2: Manual
Backend:
```bash
docker build -t rag-app .
docker run -it --rm --env-file .env -v ~/.aws:/root/.aws  -p 8000:8000 rag-app
```
Frontend:
```bash
docker build -t rag-front .
docker run -d -p 5173:80 rag-front
```

### Change Log:
V1.0 - Initial 

### TBD:
- Documentation/Errors
- A yaml that builds the infrastructure for this.
- Fine-tuning
- Local RAG
