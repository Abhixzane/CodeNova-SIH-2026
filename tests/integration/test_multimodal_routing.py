"""
Integration tests verifying Multimodal Travel Routes and Fare Calculation.
"""
import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, os.path.join(ROOT_DIR, "backend"))

from app.services.routing_service import routing_service
from app.services.itinerary_service import itinerary_service


def test_full_itinerary_and_routing_pipeline():
    itinerary = itinerary_service.generate_day_circuit(
        city="Mumbai",
        duration_hours=6.0,
        interests=["heritage", "colonial"],
    )

    assert itinerary["city"] == "Mumbai"
    assert itinerary["total_places"] >= 2
    assert len(itinerary["stops"]) == itinerary["total_places"]

    first_stop = itinerary["stops"][0]
    second_stop = itinerary["stops"][1]

    route = routing_service.calculate_multimodal_route(
        origin=first_stop["name"],
        destination=second_stop["name"],
        distance_km=3.2,
    )

    assert route["distance_km"] == 3.2
    assert route["estimated_fare"] > 0
    assert any(opt["mode"] == "AUTO" for opt in route["options"])
    assert any(opt["mode"] == "TRANSIT" for opt in route["options"])
