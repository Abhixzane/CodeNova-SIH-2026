# Deployment & DevOps Guide

## Container Architecture
BharatYatra runs as a containerized web application designed for Google Cloud Run:
- **Port**: Ingress traffic is routed through port 3000.
- **Production Bundle**: React frontend is compiled using `vite build` into `dist/`.
- **Node Production Server**: The production server (`server.ts`) is compiled into `dist/server.cjs` via `esbuild` and handles API requests and static asset delivery.
- **Python Backend**: Can be containerized separately or run side-by-side with Uvicorn.

## Environment Variables
Configured via `.env` or container runtime environment variables:
- `GEMINI_API_KEY`: Secret API key for Google Gemini generative AI.
- `PORT`: Default 3000.
- `NODE_ENV`: `production` or `development`.
