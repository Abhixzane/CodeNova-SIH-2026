from app.routers.states import router as states_router
from app.routers.places import router as places_router
from app.routers.search import router as search_router
from app.routers.routes import router as routes_router
from app.routers.maps import router as maps_router
from app.routers.ai import router as ai_router
from app.routers.itinerary import router as itinerary_router
from app.routers.cities import router as cities_router
from app.routers.railway_stations import router as railway_stations_router
from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router
from app.routers.favorites import router as favorites_router
from app.routers.trips import router as trips_router
from app.routers.weather import router as weather_router

from app.routers.v1 import router as v1_router

__all__ = [
    "states_router",
    "places_router",
    "search_router",
    "routes_router",
    "maps_router",
    "ai_router",
    "itinerary_router",
    "cities_router",
    "railway_stations_router",
    "auth_router",
    "profile_router",
    "favorites_router",
    "trips_router",
    "weather_router",
    "v1_router",
]

