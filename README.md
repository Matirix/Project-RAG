# Project-RAG
To run:
Requires an aws account. 
In back-end:
docker build -t rag-app .
docker run -it --rm --env-file .env -v ~/.aws:/root/.aws  -p 8000:8000 rag-app
