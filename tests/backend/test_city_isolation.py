import pytest
from backend.app.services.tourism_service import tourism_service
from backend.app.services.routing_service import routing_service, haversine_distance

def test_haversine_distance():
    # Gateway of India to Chhatrapati Shivaji Maharaj Terminus (CSMT) ~2.5 km
    dist = haversine_distance(18.9220, 72.8347, 18.9400, 72.8354)
    assert 1.5 < dist < 3.5

def test_city_isolation_delhi():
    delhi_places = tourism_service.get_places(city="Delhi")
    place_titles = [p.get("title", "") for p in delhi_places]
    for title in place_titles:
        assert "Gateway of India" not in title
        assert "Marine Drive" not in title

def test_city_isolation_varanasi():
    varanasi_places = tourism_service.get_places(city="Varanasi")
    place_titles = [p.get("title", "") for p in varanasi_places]
    for title in place_titles:
        assert "Gateway of India" not in title

def test_multimodal_routing_independent_of_google_maps():
    route = routing_service.calculate_multimodal_route(18.9220, 72.8347, 19.0760, 72.8777)
    assert route["provenance"]["independent_of_google_maps"] is True
    assert len(route["steps"]) > 0
    assert route["estimated_fare_inr"] > 0
