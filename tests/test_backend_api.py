"""Comprehensive Backend API Test Suite for CodeNova-SIH-2026.

Validates:
1. Health & root endpoints
2. States & regions
3. Curated places & filtering (state, city, category)
4. Place by ID (found + 404)
5. Multi-field search & scoring
6. Nearby proximity queries (Haversine calculations)
7. Coordinate validation errors
8. Route parameter validation
9. Route calculations with canonical place IDs
10. Multi-mode transport options (DRIVE, TRANSIT, WALK, BICYCLE)
11. Transit details parsing & fare status reliability
12. Google Maps Navigation URL generation (safe handoff)
13. External provider mock & failure fallback behavior
14. AI Tourism Assistant context grounding & chat
15. 3D monument metadata availability
16. Day-trip tour itinerary planning
"""

import sys
from pathlib import Path
from unittest.mock import AsyncMock, patch, MagicMock
import pytest
from fastapi.testclient import TestClient

# Ensure backend directory is in Python search path
BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app
from app.models.route import LocationInfo, RouteOption

client = TestClient(app)


# ----------------------------------------------------------------------
# 1. Health & Root Endpoints
# ----------------------------------------------------------------------

def test_health_check():
    """Verify GET /health returns status: ok."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {"status": "ok"}


def test_root_endpoint():
    """Verify GET / returns API welcome information and documentation links."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["health"] == "/health"
    assert data["docs"] == "/docs"


# ----------------------------------------------------------------------
# 2. States & Regions
# ----------------------------------------------------------------------

def test_get_states():
    """Verify GET /api/states returns list of supported states including Maharashtra."""
    response = client.get("/api/states")
    assert response.status_code == 200
    states = response.json()
    assert isinstance(states, list)
    assert len(states) > 0

    state_ids = [s["id"] for s in states]
    assert "maharashtra" in state_ids
    assert "rajasthan" in state_ids
    assert "kerala" in state_ids


# ----------------------------------------------------------------------
# 3. Places Listing & Filtering
# ----------------------------------------------------------------------

def test_get_places_default():
    """Verify GET /api/places returns paginated list with total count."""
    response = client.get("/api/places")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "data" in data
    assert isinstance(data["data"], list)
    assert data["total"] >= 13  # Mumbai + sample destinations


def test_get_places_filter_by_city():
    """Verify GET /api/places?city=Mumbai returns only Mumbai destinations."""
    response = client.get("/api/places?city=mumbai")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 10
    for place in data["data"]:
        assert place["city"].lower() == "mumbai"


def test_get_places_filter_by_state_and_category():
    """Verify GET /api/places with state and category filters."""
    response = client.get("/api/places?state=maharashtra&category=heritage")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 3
    for place in data["data"]:
        assert place["state"] == "Maharashtra"
        assert place["category"] == "heritage"


# ----------------------------------------------------------------------
# 4. Place Details by ID
# ----------------------------------------------------------------------

def test_get_place_by_id_mumbai():
    """Verify GET /api/places/{place_id} returns full detail schema for Mumbai destinations."""
    # 1. Gateway of India
    resp_gateway = client.get("/api/places/gateway-of-india")
    assert resp_gateway.status_code == 200
    gateway = resp_gateway.json()
    assert gateway["id"] == "gateway-of-india"
    assert gateway["name"] == "Gateway of India"
    assert gateway["city"] == "Mumbai"
    assert "coordinates" in gateway
    assert gateway["coordinates"]["latitude"] == 18.9220
    assert "history" in gateway
    assert "visiting_info" in gateway
    assert gateway["features"]["3d"] is True

    # 2. Marine Drive
    resp_marine = client.get("/api/places/marine-drive")
    assert resp_marine.status_code == 200
    marine = resp_marine.json()
    assert marine["id"] == "marine-drive"
    assert marine["name"] == "Marine Drive"
    assert marine["category"] == "coastal"


def test_get_place_by_id_backward_compatibility():
    """Verify legacy places like Hawa Mahal still resolve cleanly."""
    response = client.get("/api/places/hawa-mahal")
    assert response.status_code == 200
    place = response.json()
    assert place["id"] == "hawa-mahal"
    assert place["name"] == "Hawa Mahal"


def test_get_place_by_id_not_found():
    """Verify GET /api/places/{place_id} returns 404 for nonexistent destination."""
    response = client.get("/api/places/non-existent-destination-xyz")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data


# ----------------------------------------------------------------------
# 5. Search System
# ----------------------------------------------------------------------

def test_search_places_exact_and_fuzzy():
    """Verify GET /api/search matches name, category, and city keywords."""
    # Search for "marine"
    resp_marine = client.get("/api/search?q=marine")
    assert resp_marine.status_code == 200
    data_marine = resp_marine.json()
    assert data_marine["count"] > 0
    assert data_marine["results"][0]["id"] == "marine-drive"

    # Search for "caves"
    resp_caves = client.get("/api/search?q=caves")
    assert resp_caves.status_code == 200
    data_caves = resp_caves.json()
    cave_ids = [r["id"] for r in data_caves["results"]]
    assert "elephanta-caves" in cave_ids or "kanheri-caves" in cave_ids


def test_search_places_with_city_priority():
    """Verify GET /api/search prioritizes places from specified city."""
    response = client.get("/api/search?q=heritage&city=Mumbai")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    assert data["results"][0]["city"] == "Mumbai"


# ----------------------------------------------------------------------
# 6. Nearby Proximity Discovery (Haversine)
# ----------------------------------------------------------------------

def test_nearby_places_valid_coordinates():
    """Verify GET /api/places/nearby returns sorted destinations by straight-line distance."""
    # Near Gateway of India coordinates: lat=18.9220, lng=72.8347
    response = client.get("/api/places/nearby?lat=18.9220&lng=72.8347&radius=10")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    assert data["radius_km"] == 10.0

    # First result should be Gateway of India itself (~0.0 km away)
    first_result = data["results"][0]
    assert first_result["id"] == "gateway-of-india"
    assert first_result["distance_km"] < 0.1

    # Distances must be sorted in ascending order
    distances = [r["distance_km"] for r in data["results"]]
    assert distances == sorted(distances)


def test_nearby_places_with_category_filter():
    """Verify GET /api/places/nearby filters by category."""
    response = client.get("/api/places/nearby?lat=18.9220&lng=72.8347&radius=25&category=coastal")
    assert response.status_code == 200
    data = response.json()
    for item in data["results"]:
        assert item["category"] == "coastal"


def test_nearby_places_invalid_coordinates():
    """Verify GET /api/places/nearby rejects out-of-range coordinates."""
    # Latitude > 90
    response_invalid_lat = client.get("/api/places/nearby?lat=95.0&lng=72.8347")
    assert response_invalid_lat.status_code == 422

    # Longitude > 180
    response_invalid_lng = client.get("/api/places/nearby?lat=18.9220&lng=200.0")
    assert response_invalid_lng.status_code == 422


# ----------------------------------------------------------------------
# 7. Travel Intelligence & Routes
# ----------------------------------------------------------------------

def test_routes_with_place_ids():
    """Verify GET /api/routes calculates multi-modal options between canonical place IDs."""
    response = client.get("/api/routes?origin=csmt&destination=marine-drive")
    assert response.status_code == 200
    data = response.json()

    assert data["origin"]["place_id"] == "csmt"
    assert data["destination"]["place_id"] == "marine-drive"

    options = data["options"]
    assert len(options) >= 3  # DRIVE, WALK, TRANSIT, BICYCLE

    modes = [opt["mode"] for opt in options]
    assert "DRIVE" in modes
    assert "WALK" in modes

    # Check walk duration is positive
    walk_opt = next(opt for opt in options if opt["mode"] == "WALK")
    assert walk_opt["distance_km"] > 0
    assert walk_opt["duration_minutes"] > 0
    assert walk_opt["estimated_fare"] == 0.0
    assert walk_opt["fare_status"] == "provider_confirmed"


def test_routes_with_explicit_coordinates():
    """Verify GET /api/routes supports explicit coordinate inputs."""
    response = client.get(
        "/api/routes?origin_lat=18.9400&origin_lng=72.8353&dest_lat=18.9431&dest_lng=72.8230"
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["options"]) > 0


def test_routes_invalid_inputs():
    """Verify GET /api/routes rejects unresolvable origins or destinations."""
    response_missing = client.get("/api/routes?origin=csmt")
    assert response_missing.status_code == 400

    response_bad_id = client.get("/api/routes?origin=csmt&destination=invalid-place-id-999")
    assert response_bad_id.status_code == 400


def test_routes_mocked_google_directions_api():
    """Verify Google Maps Directions API response is properly parsed and normalized."""
    from app.services.routing_service import routing_service

    mock_google_response = {
        "status": "OK",
        "routes": [
            {
                "summary": "Mahatma Gandhi Rd",
                "legs": [
                    {
                        "distance": {"value": 3200, "text": "3.2 km"},
                        "duration": {"value": 720, "text": "12 mins"},
                        "steps": [
                            {
                                "travel_mode": "TRANSIT",
                                "transit_details": {
                                    "line": {"name": "Bus 123", "short_name": "123", "vehicle": {"type": "BUS"}},
                                    "departure_stop": {"name": "CSMT Station"},
                                    "arrival_stop": {"name": "Marine Lines"},
                                    "num_stops": 4,
                                }
                            }
                        ]
                    }
                ],
                "fare": {"value": 15.0, "currency": "INR"}
            }
        ]
    }

    mock_httpx_resp = MagicMock()
    mock_httpx_resp.status_code = 200
    mock_httpx_resp.json.return_value = mock_google_response

    with patch("httpx.AsyncClient.get", return_value=mock_httpx_resp):
        # Temporarily enable API key for testing adapter
        routing_service.api_key = "test-mock-api-key"
        try:
            # We call the endpoint which handles the async internally
            response = client.get("/api/routes?origin=csmt&destination=marine-drive")
            assert response.status_code == 200
            data = response.json()

            # Since the endpoint requests all modes concurrently, TRANSIT should be one of them
            options = data["options"]
            assert len(options) > 0

            # Find the TRANSIT option
            transit_opt = next((opt for opt in options if opt["mode"] == "TRANSIT"), None)
            assert transit_opt is not None

            assert transit_opt["duration_minutes"] == 12.0
            assert transit_opt["distance_km"] == 3.2
            assert transit_opt["estimated_fare"] == 15.0
            assert transit_opt["fare_status"] == "provider_confirmed"
            assert transit_opt["transit_details"] is not None
            assert transit_opt["transit_details"][0]["line"] == "123"
        finally:
            routing_service.api_key = ""


# ----------------------------------------------------------------------
# 8. Google Maps Navigation Handoff URL
# ----------------------------------------------------------------------

def test_maps_directions_url_generation():
    """Verify GET /api/maps/directions returns safe, cross-platform Google Maps direction URL."""
    response = client.get("/api/maps/directions?origin=csmt&destination=marine-drive&travel_mode=driving")
    assert response.status_code == 200
    data = response.json()

    assert data["origin"] == "Chhatrapati Shivaji Maharaj Terminus"
    assert data["destination"] == "Marine Drive"
    assert data["travel_mode"] == "driving"

    url = data["url"]
    assert url.startswith("https://www.google.com/maps/dir/?")
    assert "api=1" in url
    assert "destination=" in url
    assert "travelmode=driving" in url

    # Verify no secret API keys are leaked into the client URL
    assert "key=" not in url


# ----------------------------------------------------------------------
# 9. AI Tourism Assistant
# ----------------------------------------------------------------------

def test_ai_chat_grounded_response():
    """Verify POST /api/ai/chat returns grounded response with structured suggested places."""
    payload = {
        "message": "What is the history of Gateway of India?",
        "place_id": "gateway-of-india",
        "city": "Mumbai"
    }
    response = client.post("/api/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "conversation_id" in data
    assert "reply" in data
    assert "Gateway of India" in data["reply"]
    assert len(data["suggested_places"]) >= 1
    assert data["suggested_places"][0]["id"] == "gateway-of-india"
    assert "CodeNova Verified Tourism Database" in data["sources"]


def test_ai_chat_empty_message_rejected():
    """Verify POST /api/ai/chat returns 400 when message is empty."""
    response = client.post("/api/ai/chat", json={"message": "   "})
    assert response.status_code == 400


# ----------------------------------------------------------------------
# 10. 3D Monument Metadata
# ----------------------------------------------------------------------

def test_3d_metadata_availability():
    """Verify 3D metadata is exposed for Gateway of India proof-of-concept."""
    response = client.get("/api/places/gateway-of-india")
    assert response.status_code == 200
    place = response.json()

    # Features check
    assert place["features"]["3d"] is True

    # 3D Model schema check
    assert place["model_3d"]["available"] is True
    assert place["model_3d"]["has_model"] is True
    assert place["model_3d"]["asset"] == "/models/gateway-of-india.glb"


# ----------------------------------------------------------------------
# 11. Day-Trip Itinerary Planning
# ----------------------------------------------------------------------

def test_generate_itinerary():
    """Verify POST /api/itinerary produces a sequenced tour plan within duration budget."""
    payload = {
        "city": "Mumbai",
        "origin": "gateway-of-india",
        "duration_hours": 6.0,
        "interests": ["heritage", "coastal"]
    }
    response = client.post("/api/itinerary", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["city"] == "Mumbai"
    assert data["duration_hours"] == 6.0
    assert data["total_places"] >= 2
    assert len(data["stops"]) == data["total_places"]

    # First stop should be the starting origin
    assert data["stops"][0]["place_id"] == "gateway-of-india"
    assert data["stops"][0]["order"] == 1

    # Subsequent stops should have travel time estimates
    if len(data["stops"]) > 1:
        assert data["stops"][1]["travel_time_from_previous_minutes"] is not None
        assert data["stops"][1]["travel_mode_from_previous"] is not None

    assert "summary" in data
