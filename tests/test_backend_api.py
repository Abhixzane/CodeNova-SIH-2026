"""Basic Health and API Endpoints Test Suite for CodeNova Backend.

Uses FastAPI TestClient (httpx) to verify application routes, models, and health responses.
"""

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Ensure backend directory is in python path
BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app

client = TestClient(app)


def test_health_check():
    """Verify GET /health returns status: ok."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {"status": "ok"}


def test_root_endpoint():
    """Verify GET / returns welcome information."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["health"] == "/health"


def test_get_states():
    """Verify GET /api/states returns list of states."""
    response = client.get("/api/states")
    assert response.status_code == 200
    states = response.json()
    assert isinstance(states, list)
    assert len(states) > 0
    assert any(s["id"] == "rajasthan" for s in states)


def test_get_places():
    """Verify GET /api/places returns list structure."""
    response = client.get("/api/places")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "data" in data
    assert isinstance(data["data"], list)
    assert data["total"] > 0


def test_get_places_with_filter():
    """Verify GET /api/places with category and state filters."""
    response = client.get("/api/places?state=rajasthan&category=heritage")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert data["data"][0]["state"] == "Rajasthan"
    assert data["data"][0]["category"] == "heritage"


def test_get_place_by_id():
    """Verify GET /api/places/{place_id} for valid and invalid places."""
    # Valid place
    response = client.get("/api/places/hawa-mahal")
    assert response.status_code == 200
    place = response.json()
    assert place["id"] == "hawa-mahal"
    assert place["name"] == "Hawa Mahal"
    assert "coordinates" in place
    assert "model_3d" in place

    # Invalid place (should return 404)
    response_404 = client.get("/api/places/non-existent-monument")
    assert response_404.status_code == 404
    assert "detail" in response_404.json()


def test_search_places():
    """Verify GET /api/search with query string."""
    response = client.get("/api/search?q=hawa")
    assert response.status_code == 200
    search_data = response.json()
    assert search_data["query"] == "hawa"
    assert search_data["count"] > 0
    assert search_data["results"][0]["id"] == "hawa-mahal"
