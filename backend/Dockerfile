# Alpine is tiny but may need build tools for some packages
FROM python:3.12-alpine

WORKDIR /code/app

# Install build dependencies if needed (common for numpy, pandas, etc.)
RUN apk add --no-cache gcc musl-dev libffi-dev

COPY ./app/requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Clean up build dependencies to save space
RUN apk del gcc musl-dev libffi-dev

COPY ./app /code/app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
