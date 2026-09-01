from pathlib import Path
import sys
import pytest
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app

client = TestClient(app)


def test_v1_routing_calculate():
    payload = {
        "origin": "Chhatrapati Shivaji Maharaj Terminus",
        "destination": "Gateway of India",
        "origin_lat": 18.9400,
        "origin_lng": 72.8353,
        "dest_lat": 18.9220,
        "dest_lng": 72.8347,
        "preferred_modes": ["WALK", "AUTO_RICKSHAW", "TAXI_CAB", "SUBURBAN_RAIL"]
    }
    response = client.post("/api/v1/routing/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["origin"] == "Chhatrapati Shivaji Maharaj Terminus"
    assert data["destination"] == "Gateway of India"
    assert data["crow_distance_km"] > 0
    assert data["route_count"] >= 1

    modes = [r["mode"] for r in data["routes"]]
    assert "WALK" in modes or "AUTO_RICKSHAW" in modes
    for r in data["routes"]:
        assert "google_maps_url" in r
        assert "min_fare_inr" in r
        assert "duration_min" in r


def test_v1_fare_estimate():
    payload_day = {
        "distance_km": 10.0,
        "mode": "AUTO_RICKSHAW",
        "is_night_time": False
    }
    res_day = client.post("/api/v1/routing/fare-estimate", json=payload_day)
    assert res_day.status_code == 200
    data_day = res_day.json()

    assert data_day["transport_mode"] == "AUTO_RICKSHAW"
    assert data_day["min_fare_inr"] > 0
    assert "₹" in data_day["formatted_fare"]

    payload_night = {
        "distance_km": 10.0,
        "mode": "AUTO_RICKSHAW",
        "is_night_time": True
    }
    res_night = client.post("/api/v1/routing/fare-estimate", json=payload_night)
    assert res_night.status_code == 200
    data_night = res_night.json()

    assert data_night["min_fare_inr"] > data_day["min_fare_inr"]
    assert data_night["surge_multiplier"] == 1.25


def test_v1_itinerary_adjust():
    payload = {
        "city": "Mumbai",
        "duration_hours": 6.0,
        "adjustment_action": "make_cheaper"
    }
    response = client.post("/api/v1/itinerary/adjust", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["city"] == "Mumbai"
    assert data["adjustment_action"] == "make_cheaper"
    assert data["total_stops"] >= 1
    assert "total_entry_fees_formatted" in data
    assert "₹" in data["total_entry_fees_formatted"]


def test_v1_ai_chat_stateful_flow():
    session_id = "test-session-12345"

    turn1_res = client.post("/api/v1/ai/chat", json={
        "message": "Tell me about Gateway of India",
        "session_token": session_id
    })
    assert turn1_res.status_code == 200
    d1 = turn1_res.json()
    assert "Gateway of India" in d1["reply"]
    assert d1["session_token"] == session_id

    turn2_res = client.post("/api/v1/ai/chat", json={
        "message": "How do I reach there and what is the fare?",
        "session_token": session_id
    })
    assert turn2_res.status_code == 200
    d2 = turn2_res.json()
    assert any(act["action_type"] == "SHOW_MAP_ROUTE" for act in d2["ui_actions"])

    turn3_res = client.post("/api/v1/ai/chat", json={
        "message": "Can I see the 3D model of this monument?",
        "session_token": session_id
    })
    assert turn3_res.status_code == 200
    d3 = turn3_res.json()
    assert any(act["action_type"] == "TRIGGER_3D_EXPLORER" for act in d3["ui_actions"])


def test_v1_destinations_listing_and_detail():
    res_list = client.get("/api/v1/destinations?limit=20")
    assert res_list.status_code == 200
    d_list = res_list.json()
    assert d_list["total"] >= 10
    assert len(d_list["destinations"]) <= 20

    res_cat = client.get("/api/v1/destinations?category=heritage")
    assert res_cat.status_code == 200
    d_cat = res_cat.json()
    assert all(p["category"] == "heritage" for p in d_cat["destinations"])

    res_detail = client.get("/api/v1/destinations/gateway-of-india")
    assert res_detail.status_code == 200
    d_detail = res_detail.json()
    assert d_detail["name"] == "Gateway of India"
    assert "heritage_status" in d_detail

    res_404 = client.get("/api/v1/destinations/non-existent-monument-xyz")
    assert res_404.status_code == 404


def test_v1_destination_transit_proximity():
    response = client.get("/api/v1/destinations/gateway-of-india/transit?radius_km=30")
    assert response.status_code == 200
    data = response.json()

    assert data["destination_id"] == "gateway-of-india"
    assert data["transit_hubs_count"] >= 1
    for hub in data["transit_hubs"]:
        assert "distance_km" in hub
        assert "estimated_drive_time_min" in hub


def test_v1_user_preferences_lifecycle():
    res_get = client.get("/api/v1/user/preferences?email=traveler@bharatyatra.in")
    assert res_get.status_code == 200
    d_get = res_get.json()
    assert "interests" in d_get

    update_payload = {
        "interests": ["heritage", "coastal", "cuisine"],
        "budget": "luxury",
        "home_city": "Jaipur"
    }
    res_put = client.put("/api/v1/user/preferences?email=traveler@bharatyatra.in", json=update_payload)
    assert res_put.status_code == 200
    d_put = res_put.json()
    assert d_put["status"] == "success"
    assert d_put["preferences"]["budget"] == "luxury"
    assert d_put["preferences"]["home_city"] == "Jaipur"
