# Project-RAG
To run:
Requires an aws account. 


In back-end:
Must have a .env located at the root of backend with the following:
```
REGION=<aws-region-here>
KNOWLEDGE_BASE_ID=<knowledge-base-id-here>
KNOWLEDGE_BASE_DATA_SOURCE=<knowledge-base-data-source-here>
BUCKET_NAME=<bucket-name-here>
```
docker build -t rag-app .
docker run -it --rm --env-file .env -v ~/.aws:/root/.aws  -p 8000:8000 rag-app

Running backend locally:
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000


Front-end:
docker build -t rag-front .
docker run -d -p 5173:80 rag-front
