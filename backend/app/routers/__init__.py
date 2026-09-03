from .health import router as health_router
from .states import router as states_router
from .places import router as places_router
from .routes import router as routes_router
from .itinerary import router as itinerary_router
from .ai import router as ai_router

__all__ = [
    "health_router",
    "states_router",
    "places_router",
    "routes_router",
    "itinerary_router",
    "ai_router",
]
