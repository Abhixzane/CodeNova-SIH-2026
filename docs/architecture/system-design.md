# System Design & Architecture

## Overview
BharatYatra adopts a decoupled, multi-tier full-stack architecture tailored for high performance, geospatial querying, real-time multimodal transit assistance, and 3D web graphics rendering.

```
┌────────────────────────────────────────────────────────┐
│                   React SPA Frontend                   │
│   (Tailwind CSS, Leaflet Maps, Three.js 3D Viewers)    │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (HTTP/2)
                            ▼
┌────────────────────────────────────────────────────────┐
│                  FastAPI Backend Gateway               │
│  (Pydantic validation, CORS, Routing & Circuit Logic)  │
└───────┬───────────────────┬────────────────────┬───────┘
        │                   │                    │
        ▼                   ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  AI Tourism  │    │  Geospatial  │    │   Multimodal │
│  Assistant   │    │  & Heritage  │    │   Transit    │
│ (Gemini 2.5) │    │  Datasets    │    │   Routing    │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Key Architectural Principles
1. **Separation of Concerns**: Clear boundary between `frontend/`, `backend/`, `ai/`, and `data/` modules.
2. **Deterministic Routing**: Fast local distance and fare algorithms for high-speed offline calculations.
3. **Resilient AI Failover**: Real-time Gemini LLM calls backed by domain-curated fallback responses.
4. **Lightweight 3D Rendering**: Custom Three.js parametric and GLTF heritage models optimized for 60fps across mobile and desktop.
