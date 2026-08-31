"""API Routers Package.

Exports routers for states, places, search, routes, maps, AI, and itineraries.
"""

from app.routers.states import router as states_router
from app.routers.places import router as places_router
from app.routers.search import router as search_router
from app.routers.routes import router as routes_router
from app.routers.maps import router as maps_router
from app.routers.ai import router as ai_router
from app.routers.itinerary import router as itinerary_router

__all__ = [
    "states_router",
    "places_router",
    "search_router",
    "routes_router",
    "maps_router",
    "ai_router",
    "itinerary_router",
]
