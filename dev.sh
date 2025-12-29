#!/usr/bin/env bash

set -e

echo "Starting backend..."
(cd backend/app && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000) &

echo "Starting frontend..."
(cd frontend && deno run dev) &

wait
