#!/bin/bash

fuser -k 8000/tcp

echo "Starting backend"
uvicorn main:app --host 0.0.0.0 --reload &

echo "Starting frontend"
cd ticket-frontend && npm run dev
