"""
FastAPI Backend Unit Tests.
"""
import sys
import os

try:
    import pytest
except ImportError:
    pytest = None

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, os.path.join(ROOT_DIR, "backend"))

from app.services.tourism_service import tourism_service
from app.services.routing_service import routing_service


def test_tourism_service_states():
    states = tourism_service.get_states()
    assert isinstance(states, list)
    assert len(states) > 0
    first_state = states[0]
    assert "id" in first_state
    assert "name" in first_state


def test_tourism_service_places():
    res = tourism_service.get_places(limit=10)
    assert "total" in res
    assert "data" in res
    assert len(res["data"]) > 0


def test_routing_service_calculation():
    res = routing_service.calculate_multimodal_route(
        origin="Gateway of India",
        destination="Marine Drive",
        mode="DRIVE",
        distance_km=3.5,
    )
    assert res["origin"] == "Gateway of India"
    assert res["destination"] == "Marine Drive"
    assert res["estimated_fare"] > 0
    assert len(res["options"]) >= 3
