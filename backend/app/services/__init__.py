"""Business Logic & Service Layer Package.

Exports service instances for place data, search, nearby proximity,
routing intelligence, Google Maps handoff, AI assistant, recommendations, and itineraries.
"""

from app.services.place_service import PlaceService, place_service
from app.services.search_service import SearchService, search_service
from app.services.nearby_service import NearbyService, nearby_service, haversine_distance_km
from app.services.maps_service import MapsService, maps_service
from app.services.routing_service import RoutingService, routing_service
from app.services.ai_service import AIService, ai_service
from app.services.recommendation_service import RecommendationService, recommendation_service
from app.services.itinerary_service import ItineraryService, itinerary_service

__all__ = [
    "PlaceService",
    "place_service",
    "SearchService",
    "search_service",
    "NearbyService",
    "nearby_service",
    "haversine_distance_km",
    "MapsService",
    "maps_service",
    "RoutingService",
    "routing_service",
    "AIService",
    "ai_service",
    "RecommendationService",
    "recommendation_service",
    "ItineraryService",
    "itinerary_service",
]
