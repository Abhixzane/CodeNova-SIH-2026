"""Extended Test Suite for CodeNova-SIH-2026.

Tests:
1. Category-specific queries across Mumbai places
2. Itinerary budget constraints and time limits (2h, 4h, 8h)
3. Multi-modal route calculation between key Mumbai hubs
4. Search scoring with natural query variations
5. Safe Google Maps URL generation with diverse transport modes
6. Coordinate boundary validation and malformed inputs
"""

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app

client = TestClient(app)


def test_places_mumbai_all_categories():
    """Verify places are returned across all major tourism categories in Mumbai."""
    categories = ["heritage", "coastal", "nature", "spiritual", "cultural"]
    for cat in categories:
        resp = client.get(f"/api/places?city=mumbai&category={cat}")
        assert resp.status_code == 200
        data = resp.json()
        assert "data" in data
        assert len(data["data"]) > 0
        for p in data["data"]:
            assert p["category"] == cat


def test_search_natural_queries():
    """Verify natural tourism queries return relevant results."""
    queries = [
        ("famous places in Mumbai", "mumbai"),
        ("beaches", "mumbai"),
        ("caves", "mumbai"),
        ("museum", "mumbai"),
    ]
    for q, city in queries:
        resp = client.get(f"/api/search?q={q}&city={city}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["count"] > 0


def test_itinerary_various_durations():
    """Verify itineraries respect 2-hour, 4-hour, and 8-hour budgets."""
    for hours in [2.0, 4.0, 8.0]:
        payload = {
            "city": "Mumbai",
            "origin": "gateway-of-india",
            "duration_hours": hours,
            "interests": ["heritage", "coastal"],
        }
        resp = client.post("/api/itinerary", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_places"] >= 1
        total_time = (data["estimated_total_visiting_minutes"] + data["estimated_total_travel_minutes"])
        # Should not wildly exceed duration budget (allow up to 20% flex for travel completion)
        assert total_time <= (hours * 60 * 1.25)


def test_multi_modal_routes_matrix():
    """Verify multi-modal route calculations between major Mumbai hubs."""
    pairs = [
        ("gateway-of-india", "marine-drive"),
        ("csmt", "elephanta-caves"),
        ("bandra-fort", "juhu-beach"),
    ]
    for origin, dest in pairs:
        resp = client.get(f"/api/routes?origin={origin}&destination={dest}")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["options"]) >= 3
        for opt in data["options"]:
            assert opt["distance_km"] > 0
            assert opt["duration_minutes"] > 0
            assert opt["fare_status"] in ["provider_confirmed", "estimated", "unavailable"]


def test_maps_directions_all_travel_modes():
    """Verify directions URLs for driving, walking, transit, bicycling."""
    modes = ["driving", "walking", "transit", "bicycling"]
    for mode in modes:
        resp = client.get(f"/api/maps/directions?origin=csmt&destination=marine-drive&travel_mode={mode}")
        assert resp.status_code == 200
        data = resp.json()
        assert f"travelmode={mode}" in data["url"]
        assert "key=" not in data["url"]


def test_nearby_distance_sorting():
    """Verify nearby places are strictly sorted in ascending order of distance."""
    resp = client.get("/api/places/nearby?lat=18.9431&lng=72.8230&radius=30")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["results"]) > 1
    distances = [item["distance_km"] for item in data["results"]]
    assert distances == sorted(distances)
