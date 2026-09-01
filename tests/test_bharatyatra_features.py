import sys
from pathlib import Path
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app

client = TestClient(app)

def test_cities_endpoint():
    resp = client.get("/api/cities")
    assert resp.status_code == 200
    cities = resp.json()
    assert len(cities) >= 5
    city_names = [c["name"] for c in cities]
    assert "Mumbai" in city_names
    assert "Jaipur" in city_names

def test_railway_stations_endpoints():
    # List all
    resp = client.get("/api/railway-stations?city=mumbai")
    assert resp.status_code == 200
    stations = resp.json()
    assert len(stations) >= 5
    codes = [s["code"] for s in stations]
    assert "CSMT" in codes
    assert "CCG" in codes

    # Nearby
    resp = client.get("/api/railway-stations/nearby?lat=18.9220&lng=72.8347&limit=3")
    assert resp.status_code == 200
    nearby = resp.json()
    assert len(nearby) == 3
    assert nearby[0]["distance_km"] is not None

def test_weather_endpoint():
    resp = client.get("/api/weather?city=mumbai")
    assert resp.status_code == 200
    data = resp.json()
    assert data["city"] == "Mumbai"
    assert data["temperature_c"] > 0
    assert "condition" in data

def test_auth_and_profile_flow():
    # Register / Login
    resp = client.post("/api/auth/register", json={
        "name": "Dev Traveler",
        "email": "dev@bharatyatra.in",
        "password": "pass",
        "home_city": "Jaipur"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "token" in data
    token = data["token"]
    assert data["profile"]["name"] == "Dev Traveler"

    # Get profile
    resp = client.get("/api/profile", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == "dev@bharatyatra.in"

    # Save survey
    resp = client.post("/api/profile/survey", headers={"Authorization": f"Bearer {token}"}, json={
        "traveler_type": "Heritage explorer",
        "trip_duration": "2-3 days",
        "budget_range": "budget",
        "preferred_transport": "mixed",
        "interests": ["heritage", "architecture"]
    })
    assert resp.status_code == 200
    assert resp.json()["is_survey_completed"] is True

def test_favorites_and_trips_endpoints():
    # Add favorite
    resp = client.post("/api/favorites", json={"place_id": "gateway-of-india"})
    assert resp.status_code == 200
    assert resp.json()["place_id"] == "gateway-of-india"

    # List favorites
    resp = client.get("/api/favorites")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1

    # Create trip
    resp = client.post("/api/trips", json={
        "title": "My Mumbai Tour",
        "city": "Mumbai",
        "duration_hours": 5.0,
        "stops": [
            {"order": 1, "place_id": "gateway-of-india", "place_name": "Gateway of India", "visit_minutes": 60}
        ],
        "estimated_cost": 50.0
    })
    assert resp.status_code == 200
    assert resp.json()["title"] == "My Mumbai Tour"

    # List trips
    resp = client.get("/api/trips")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
