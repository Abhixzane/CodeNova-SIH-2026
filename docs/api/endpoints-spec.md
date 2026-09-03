# API Endpoints Specification

For complete request and response schemas, see [docs/api-contract.md](../api-contract.md).

## Summary Table

| Category | Method | Path | Description |
|---|---|---|---|
| **System** | `GET` | `/api/health` | Service health and uptime |
| **States** | `GET` | `/api/states` | List all Indian states and Union Territories |
| **Places** | `GET` | `/api/places` | Filtered list of places (by state, city, category) |
| **Places** | `GET` | `/api/places/{id}` | Detailed place metadata and 3D specifications |
| **Search** | `GET` | `/api/search` | Search places by keyword query |
| **Transit** | `POST` | `/api/routes/calculate` | Multimodal route options and fares |
| **Transit** | `GET` | `/api/railway/stations` | Railway and suburban transit stations catalogue |
| **Itinerary**| `POST` | `/api/itinerary/plan` | Day circuit planner with topological sequence |
| **AI Guide** | `POST` | `/api/ai/chat` | Conversational travel assistant |
| **Trips** | `GET` | `/api/trips` | User saved bookmarks and itineraries |
| **Trips** | `POST` | `/api/trips` | Save custom trip itinerary |
| **Trips** | `DELETE`| `/api/trips/{id}` | Remove saved trip |
