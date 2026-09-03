# Team Structure & Domain Responsibilities

## SIH 2026 Team CodeNova

| Member | Primary Domain | Target Working Directory | Key Deliverables |
|---|---|---|---|
| **Member 1** | System Architecture & Integration | `backend/`, Root orchestrators | FastAPI gateway, CORS, Dockerization, contracts |
| **Member 2** | Frontend & UI/UX Design | `frontend/src/`, `frontend/public/` | React UI, Tailwind styles, responsive navigation |
| **Member 3** | Interactive India Map & Geospatial | `frontend/src/components/map/` | Leaflet map, geocoordinates, custom pins, filters |
| **Member 4** | AI Tourism Assistant | `ai/`, `backend/app/routers/ai.py` | Gemini 2.5 integration, prompts, memory, tool calls |
| **Member 5** | 3D Heritage & Visual Navigation | `frontend/src/components/threed/` | Three.js monument models, orbital cameras, lighting |
| **Member 6** | Tourism Research, Content & Datasets | `data/`, `docs/datasets/` | Verified heritage facts, timings, fees, railways |

## Branching & Code Review Policy
- Feature work is confined to `feature/<domain-name>`.
- Merges are reviewed before landing on `develop`.
- Stable release snapshots are merged from `develop` into `main`.
