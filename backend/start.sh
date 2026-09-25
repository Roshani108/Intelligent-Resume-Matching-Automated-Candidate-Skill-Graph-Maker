#!/bin/bash
PORT=${PORT:-10000}
echo "Starting uvicorn on port $PORT"
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
