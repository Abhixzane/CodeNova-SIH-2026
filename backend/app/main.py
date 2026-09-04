from fastapi import FastAPI, Depends, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional, List
import uuid

from backend.app.db.session import engine, get_db, Base
from backend.app.models.entities import User, Favorite, Trip, Report
from backend.app.services.tourism_service import tourism_service
from backend.app.services.routing_service import routing_service

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="YatraVerse API (CodeNova-SIH-2026)",
    description="Intelligent Tourism, Heritage, Railway & Routing Platform API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "YatraVerse Python FastAPI Gateway",
        "database": "SQLite (SQLAlchemy)",
        "version": "2.0.0"
    }

# States
@app.get("/api/states")
def get_states():
    return tourism_service.get_states()

@app.get("/api/states/{state_id}")
def get_state(state_id: str):
    state = tourism_service.get_state(state_id)
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    return state

# Cities
@app.get("/api/cities")
def get_cities(state: Optional[str] = None):
    return tourism_service.get_cities(state=state)

# Places
@app.get("/api/places")
def get_places(city: Optional[str] = None, category: Optional[str] = None, limit: int = 50):
    return tourism_service.get_places(city=city, category=category, limit=limit)

# Heritage
@app.get("/api/heritage")
def get_heritage(unesco_only: bool = False, state: Optional[str] = None):
    return tourism_service.get_heritage_monuments(unesco_only=unesco_only, state=state)

# Railway stations
@app.get("/api/railway-stations")
def get_railway_stations():
    return tourism_service.railway_stations

# Mumbai local
@app.get("/api/mumbai-local/stations")
def get_mumbai_local_stations():
    return tourism_service.mumbai_local.get("stations", [])

@app.get("/api/mumbai-local/lines")
def get_mumbai_local_lines():
    return tourism_service.mumbai_local.get("lines", [])

# Routing
@app.post("/api/routes/calculate")
async def calculate_route(request: Request):
    body = await request.json()
    start_lat = float(body.get("origin_lat", 18.9220))
    start_lon = float(body.get("origin_lon", 72.8347))
    end_lat = float(body.get("destination_lat", 19.0760))
    end_lon = float(body.get("destination_lon", 72.8777))
    return routing_service.calculate_multimodal_route(start_lat, start_lon, end_lat, end_lon)

# Persistent Favorites
@app.get("/api/user/favorites")
def get_favorites(db: Session = Depends(get_db)):
    favs = db.query(Favorite).all()
    return [{"id": f.id, "place_id": f.place_id, "title": f.title, "state": f.state} for f in favs]

@app.post("/api/user/favorites")
async def add_favorite(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    new_fav = Favorite(
        id=str(uuid.uuid4()),
        user_id="default_user",
        place_id=body.get("place_id", "place-1"),
        title=body.get("title", "Destination"),
        state=body.get("state", "India")
    )
    db.add(new_fav)
    db.commit()
    return {"success": True, "favorite": {"id": new_fav.id, "place_id": new_fav.place_id}}

# Persistent Trips
@app.get("/api/user/trips")
def get_trips(db: Session = Depends(get_db)):
    trips = db.query(Trip).all()
    return [{
        "id": t.id,
        "title": t.title,
        "city": t.city,
        "duration_hours": t.duration_hours,
        "estimated_cost": t.estimated_cost
    } for t in trips]

@app.post("/api/user/trips")
async def save_trip(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    new_trip = Trip(
        id=str(uuid.uuid4()),
        user_id="default_user",
        title=body.get("title", "My Circuit"),
        city=body.get("city", "Mumbai"),
        duration_hours=body.get("duration_hours", 8),
        estimated_cost=body.get("estimated_cost", 500),
        stops_json=str(body.get("stops", []))
    )
    db.add(new_trip)
    db.commit()
    return {"success": True, "trip_id": new_trip.id}

# Persistent Reports
@app.get("/api/reports")
def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()

@app.post("/api/reports")
async def submit_report(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    new_report = Report(
        id=str(uuid.uuid4()),
        monument_id=body.get("monument_id", "mon-1"),
        monument_name=body.get("monument_name", "Monument"),
        issue_type=body.get("issue_type", "Maintenance"),
        severity=body.get("severity", "Medium"),
        description=body.get("description", "")
    )
    db.add(new_report)
    db.commit()
    return {"success": True, "report_id": new_report.id}

# Tourism intelligence endpoints
@app.get("/api/accessibility")
def get_accessibility():
    return tourism_service.accessibility

@app.get("/api/facilities")
def get_facilities():
    return tourism_service.facilities

@app.get("/api/artisans")
def get_artisans():
    return tourism_service.artisans

@app.get("/api/culture")
def get_culture():
    return tourism_service.culture

@app.get("/api/destination-health")
def get_destination_health():
    return tourism_service.destination_health
