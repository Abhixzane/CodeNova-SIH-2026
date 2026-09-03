# BharatYatra - FastAPI Backend Service

Production-grade asynchronous REST API backend powering the **BharatYatra (CodeNova-SIH-2026)** smart tourism platform.

## Architecture

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py            # FastAPI application entrypoint & middleware
│   ├── config.py          # Pydantic Settings & environment variables
│   ├── db/                # Database engine, session maker, base models
│   ├── models/            # SQLAlchemy / SQLModel ORM entities
│   ├── schemas/           # Pydantic validation schemas (API Contract)
│   ├── routers/           # Sub-routers for states, places, routes, AI, itinerary
│   ├── services/          # Business logic: tourism data, routing, Gemini AI, itineraries
│   └── data/              # Seed datasets & JSON loaders
├── requirements.txt
└── README.md
```

## Running the Backend

### 1. Virtual Environment & Dependencies
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp ../.env.example .env
# Ensure GEMINI_API_KEY is configured
```

### 3. Run Development Server
```bash
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

Interactive API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
