# CodeNova-SIH-2026

An intelligent, next-generation tourism exploration platform built for the **Smart India Hackathon (SIH) 2026**. CodeNova integrates rich regional tourism data, interactive geospatial maps, conversational AI travel assistance, and immersive 3D virtual monuments into a unified web application.

---

## 🏛️ Project Domains

The project is structured across six core collaborative domains:

1. **System Architecture + Integration**: System design, FastAPI orchestration, REST APIs, deployment pipelines, and cross-domain integration.
2. **Frontend/UI**: Modern React user interface, responsive styling, navigation, component design, and UX flows.
3. **Interactive India Map + Location**: Geospatial exploration, state and regional map boundaries, location pins, and interactive layer controls.
4. **AI Tourism Assistant**: Conversational guidance, intelligent trip recommendation engine, prompt engineering, and LLM integrations.
5. **3D + Navigation**: Virtual 3D heritage site models, spatial exploration, landmark tours, and interactive visual navigation.
6. **Tourism Research + Content**: Curated tourism datasets across Indian states, historical context, travel facts, media, and verified metadata.

---

## 📁 Repository Structure

```
CodeNova-SIH-2026/
├── frontend/             # React 18 SPA (Tailwind CSS, Leaflet, Three.js)
│   ├── src/              # Components, pages, contexts, services, types
│   ├── public/           # Static icons and assets
│   ├── package.json      # Frontend npm dependencies
│   ├── package-lock.json # Lockfile
│   ├── vite.config.ts    # Vite bundler configuration
│   ├── tsconfig.json     # TypeScript compiler options
│   ├── tailwind.config.js
│   └── index.html        # Entry HTML
├── backend/              # Python FastAPI asynchronous backend service
│   ├── app/
│   │   ├── main.py       # FastAPI application gateway & CORS
│   │   ├── config.py     # Environment settings & Pydantic config
│   │   ├── db/           # SQLAlchemy session and base models
│   │   ├── models/       # ORM entities (Place, State, Itinerary, User)
│   │   ├── schemas/      # Pydantic schemas (API contract)
│   │   ├── routers/      # Endpoints for states, places, routes, itinerary, AI
│   │   ├── services/     # Business logic for tourism, routing, AI, itinerary
│   │   └── data/         # Seed datasets for backend service
│   ├── requirements.txt  # Python requirements
│   └── README.md
├── ai/                   # AI & Gemini LLM subsystem
│   ├── services/         # Gemini agent orchestrator
│   ├── prompts/          # System prompts and heritage explainer templates
│   ├── tools/            # Function-calling declarations (places, fares, railway)
│   ├── models/           # Data contracts for LLM payloads
│   ├── memory/           # Sliding-window conversational context buffer
│   └── README.md
├── data/                 # Comprehensive Indian tourism datasets
│   ├── cities.json
│   ├── states.json
│   ├── india_tourism.json
│   ├── railway_stations.json
│   ├── heritage/         # Architectural & monument metadata
│   ├── mumbai/           # Mumbai landmarks & coordinates
│   ├── delhi/            # Delhi monuments & heritage sites
│   ├── rajasthan/        # Jaipur, Udaipur & desert forts
│   ├── maharashtra/      # Ajanta, Ellora & Western Ghats
│   └── kerala/           # Backwaters, hill stations & temples
├── docs/                 # Architectural & team documentation
│   ├── architecture/     # System design & tier breakdown
│   ├── roadmap/          # SIH 2026 milestone checklists
│   ├── api/              # RESTful API specifications & contract
│   ├── datasets/         # Data dictionaries & schemas
│   ├── team/             # 6-member domain ownership & PR workflow
│   ├── deployment/       # Containerization & Cloud Run guides
│   ├── api-contract.md   # Baseline REST endpoint contract
│   ├── architecture.md   # System architecture diagram
│   ├── development-guide.md # Git branching model & rules
│   └── README.md         # Central documentation index
├── scripts/              # Automation and development utilities
│   ├── data_import/      # Dataset parsing & validation scripts
│   ├── database/         # Database migration & seeding utilities
│   └── development/      # Local server launch scripts
└── tests/                # Automated test suites
    ├── backend/          # Pytest API endpoint and service tests
    ├── ai/               # Unit tests for prompt construction and memory
    ├── integration/      # Multimodal route and itinerary pipeline tests
    ├── frontend/         # TypeScript tests for fare and distance math
    └── README.md
```

---

## 📚 Project Documentation

Detailed design specifications and team protocols are documented in the `docs/` folder:

- **[System Architecture](file:///docs/architecture.md)**: Architectural tiers, service modules, and request flow.
- **[API Contract](file:///docs/api-contract.md)**: Specification for planned REST endpoints, request parameters, and response schemas.
- **[Development Guide](file:///docs/development-guide.md)**: Git branching strategy (`main`, `develop`, `feature/*`), PR workflow, and domain ownership.