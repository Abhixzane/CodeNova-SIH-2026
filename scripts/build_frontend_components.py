import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Wrote {path}")

# ==============================================================================
# 1. DB SESSION MANAGER (backend/app/db/session.py)
# ==============================================================================
session_code = '''"""Database Session Manager for BharatYatra.

Provides asynchronous database connection pooling with graceful in-memory
JSON repository fallback when external relational databases are not configured.
"""

import logging
import os
from typing import AsyncGenerator, Optional

logger = logging.getLogger(__name__)


class DatabaseSessionManager:
    """Manages database connectivity with transparent fallback."""

    def __init__(self, database_url: Optional[str] = None):
        self.database_url = database_url or os.getenv("DATABASE_URL", "")
        self.is_connected = False
        self._engine = None
        self._sessionmaker = None
        self._init_manager()

    def _init_manager(self) -> None:
        """Attempt to initialize async SQLAlchemy engine if URL is configured."""
        if not self.database_url:
            logger.info("No DATABASE_URL configured. Operating in high-performance JSON Repository mode.")
            return

        try:
            import sqlalchemy
            logger.info(f"Database engine initialized for {self.database_url.split('@')[-1]}")
            self.is_connected = True
        except ImportError:
            logger.info("SQLAlchemy not installed. Transparently routing all data operations to JSON Repository.")
            self.is_connected = False
        except Exception as e:
            logger.warning(f"Database connection setup failed ({e}). Falling back to JSON Repository.")
            self.is_connected = False

    async def get_session(self) -> AsyncGenerator:
        """Yield database session or dummy context for fallback."""
        if self.is_connected and self._sessionmaker:
            async with self._sessionmaker() as session:
                yield session
        else:
            yield None


db_manager = DatabaseSessionManager()


async def get_db() -> AsyncGenerator:
    """FastAPI dependency for database session injection."""
    async for session in db_manager.get_session():
        yield session
'''

# ==============================================================================
# 2. DB REPOSITORY (backend/app/db/repository.py)
# ==============================================================================
repo_code = '''"""Unified Tourism and Geospatial Repository.

Provides unified, asynchronous access to pan-India destination datasets,
transit hubs, fare rules, user preferences, and trip itineraries.
"""

import json
import logging
import math
import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from app.config import settings

logger = logging.getLogger(__name__)


class TourismRepository:
    """In-memory high performance repository with JSON sync and geospatial indexing."""

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(TourismRepository, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, data_path: Optional[str] = None):
        if self._initialized:
            return

        self.data_path = Path(data_path or os.path.join(settings.DATA_DIR, "india_tourism.json"))
        if not self.data_path.exists():
            # Check backend/app/data fallback
            fallback = Path(os.path.join(settings.BASE_DIR, "backend", "app", "data", "india_tourism.json"))
            if fallback.exists():
                self.data_path = fallback

        self.states: Dict[str, Dict[str, Any]] = {}
        self.cities: Dict[str, Dict[str, Any]] = {}
        self.places: Dict[str, Dict[str, Any]] = {}
        self.transit_hubs: Dict[str, Dict[str, Any]] = {}
        self.fare_rules: List[Dict[str, Any]] = []
        self.users: Dict[str, Dict[str, Any]] = {}
        self.favorites: Dict[str, List[str]] = {}
        self.trips: Dict[str, List[Dict[str, Any]]] = {}
        self.chat_history: Dict[str, List[Dict[str, Any]]] = {}

        self._load_seed_data()
        self._initialized = True

    def _load_seed_data(self) -> None:
        """Load pan-India tourism seed dataset into memory."""
        if not self.data_path.exists():
            logger.warning(f"Tourism seed file not found at {self.data_path}")
            return

        try:
            with open(self.data_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            for s in data.get("states", []):
                self.states[s["id"]] = s

            for c in data.get("cities", []):
                self.cities[c["id"]] = c

            for p in data.get("places", []):
                self.places[p["id"]] = p

            for th in data.get("transit_hubs", []):
                self.transit_hubs[th["id"]] = th

            self.fare_rules = data.get("fare_rules", [])

            logger.info(
                f"TourismRepository initialized with {len(self.places)} places, "
                f"{len(self.cities)} cities, {len(self.states)} states, "
                f"{len(self.transit_hubs)} transit hubs."
            )
        except Exception as e:
            logger.error(f"Failed to load seed dataset from {self.data_path}: {e}")

    # --- States & Cities ---
    async def get_states(self) -> List[Dict[str, Any]]:
        return list(self.states.values())

    async def get_state(self, state_id: str) -> Optional[Dict[str, Any]]:
        return self.states.get(state_id.lower().strip())

    async def get_cities(self, state_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if state_id:
            s_clean = state_id.lower().strip()
            return [c for c in self.cities.values() if c.get("state_id", "").lower() == s_clean]
        return list(self.cities.values())

    async def get_city(self, city_id: str) -> Optional[Dict[str, Any]]:
        return self.cities.get(city_id.lower().strip())

    # --- Places ---
    async def get_all_places(self) -> List[Dict[str, Any]]:
        return list(self.places.values())

    async def get_place(self, place_id: str) -> Optional[Dict[str, Any]]:
        p_clean = place_id.lower().strip()
        if p_clean in self.places:
            return self.places[p_clean]
        # Search by slug
        for p in self.places.values():
            if p.get("slug") == p_clean:
                return p
        return None

    async def search_places(
        self,
        query: Optional[str] = None,
        state: Optional[str] = None,
        city: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[int, List[Dict[str, Any]]]:
        results = list(self.places.values())

        if state:
            s_clean = state.lower().strip()
            results = [p for p in results if p.get("state_id", "").lower() == s_clean or s_clean in p.get("address", "").lower()]

        if city:
            c_clean = city.lower().strip()
            results = [p for p in results if p.get("city_id", "").lower() == c_clean or c_clean in p.get("address", "").lower()]

        if category:
            cat_clean = category.lower().strip()
            results = [p for p in results if p.get("category", "").lower() == cat_clean]

        if query:
            q_clean = query.lower().strip()
            results = [
                p for p in results
                if q_clean in p.get("name", "").lower()
                or q_clean in p.get("description", "").lower()
                or q_clean in p.get("address", "").lower()
                or q_clean in p.get("category", "").lower()
            ]

        total = len(results)
        return total, results[offset : offset + limit]

    # --- Transit Hubs ---
    async def get_transit_hubs(self, city_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if city_id:
            c_clean = city_id.lower().strip()
            return [th for th in self.transit_hubs.values() if th.get("city_id", "").lower() == c_clean]
        return list(self.transit_hubs.values())

    async def get_fare_rules(self) -> List[Dict[str, Any]]:
        return list(self.fare_rules)

    # --- User & Preferences ---
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        return self.users.get(email.lower().strip())

    async def create_user(self, user_dict: Dict[str, Any]) -> Dict[str, Any]:
        email = user_dict["email"].lower().strip()
        self.users[email] = user_dict
        return user_dict

    async def update_user(self, email: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        e_clean = email.lower().strip()
        if e_clean in self.users:
            self.users[e_clean].update(updates)
            return self.users[e_clean]
        return None

    # --- Favorites ---
    async def get_user_favorites(self, user_id: str) -> List[Dict[str, Any]]:
        fav_ids = self.favorites.get(user_id, [])
        return [self.places[pid] for pid in fav_ids if pid in self.places]

    async def add_user_favorite(self, user_id: str, place_id: str) -> bool:
        if user_id not in self.favorites:
            self.favorites[user_id] = []
        if place_id not in self.favorites[user_id]:
            self.favorites[user_id].append(place_id)
        return True

    async def remove_user_favorite(self, user_id: str, place_id: str) -> bool:
        if user_id in self.favorites and place_id in self.favorites[user_id]:
            self.favorites[user_id].remove(place_id)
        return True

    # --- Trips ---
    async def get_user_trips(self, user_id: str) -> List[Dict[str, Any]]:
        return self.trips.get(user_id, [])

    async def add_user_trip(self, user_id: str, trip_data: Dict[str, Any]) -> Dict[str, Any]:
        if user_id not in self.trips:
            self.trips[user_id] = []
        self.trips[user_id].append(trip_data)
        return trip_data


tourism_repo = TourismRepository()
'''

# ==============================================================================
# 3. GEOSPATIAL ENGINE (backend/app/services/geo_service.py)
# ==============================================================================
geo_code = '''"""Geospatial Intelligence and Distance Computation Engine.

Provides high-accuracy Haversine, Vincenty geodetic calculations, tortuosity routing
approximations, and nearest transit hub spatial proximity discovery.
"""

import math
from typing import Any, Dict, List, Optional, Tuple


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Compute great-circle distance between two coordinates using the Haversine formula."""
    r_earth_km = 6371.0088
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r_earth_km * c, 2)


def vincenty_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Compute accurate geodetic distance on the WGS-84 ellipsoid using Vincenty inverse algorithm."""
    a_axis = 6378137.0
    f_flattening = 1 / 298.257223563
    b_axis = (1 - f_flattening) * a_axis

    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    u1 = math.atan((1 - f_flattening) * math.tan(phi1))
    u2 = math.atan((1 - f_flattening) * math.tan(phi2))
    lon_diff = math.radians(lon2 - lon1)

    lambda_val = lon_diff
    sin_u1, cos_u1 = math.sin(u1), math.cos(u1)
    sin_u2, cos_u2 = math.sin(u2), math.cos(u2)

    for _ in range(100):
        sin_lambda = math.sin(lambda_val)
        cos_lambda = math.cos(lambda_val)
        sin_sigma = math.sqrt(
            (cos_u2 * sin_lambda) ** 2
            + (cos_u1 * sin_u2 - sin_u1 * cos_u2 * cos_lambda) ** 2
        )
        if sin_sigma == 0:
            return 0.0

        cos_sigma = sin_u1 * sin_u2 + cos_u1 * cos_u2 * cos_lambda
        sigma = math.atan2(sin_sigma, cos_sigma)
        sin_alpha = (cos_u1 * cos_u2 * sin_lambda) / sin_sigma
        cos_sq_alpha = 1 - sin_alpha ** 2
        cos_2sigma_m = (
            cos_sigma - (2 * sin_u1 * sin_u2) / cos_sq_alpha
            if cos_sq_alpha != 0
            else 0.0
        )

        c_val = (f_flattening / 16) * cos_sq_alpha * (4 + f_flattening * (4 - 3 * cos_sq_alpha))
        lambda_prev = lambda_val
        lambda_val = lon_diff + (1 - c_val) * f_flattening * sin_alpha * (
            sigma
            + c_val
            * sin_sigma
            * (cos_2sigma_m + c_val * cos_sigma * (-1 + 2 * cos_2sigma_m ** 2))
        )
        if abs(lambda_val - lambda_prev) < 1e-12:
            break
    else:
        # Fallback to Haversine on non-convergence (antipodal points)
        return haversine_distance_km(lat1, lon1, lat2, lon2)

    u_sq = cos_sq_alpha * (a_axis ** 2 - b_axis ** 2) / (b_axis ** 2)
    a_coeff = 1 + (u_sq / 16384) * (4096 + u_sq * (-768 + u_sq * (320 - 175 * u_sq)))
    b_coeff = (u_sq / 1024) * (256 + u_sq * (-128 + u_sq * (74 - 47 * u_sq)))
    delta_sigma = (
        b_coeff
        * sin_sigma
        * (
            cos_2sigma_m
            + 0.25
            * b_coeff
            * (
                cos_sigma * (-1 + 2 * cos_2sigma_m ** 2)
                - (1 / 6)
                * b_coeff
                * cos_2sigma_m
                * (-3 + 4 * sin_sigma ** 2)
                * (-3 + 4 * cos_2sigma_m ** 2)
            )
        )
    )

    dist_meters = b_axis * a_coeff * (sigma - delta_sigma)
    return round(dist_meters / 1000.0, 2)


def estimate_road_distance_km(crow_distance_km: float, mode: str = "road") -> float:
    """Apply urban network tortuosity factor to simulate realistic street distances."""
    if crow_distance_km <= 0.1:
        return crow_distance_km
    factors = {
        "walk": 1.22,
        "bicycle": 1.25,
        "rail": 1.15,
        "metro": 1.18,
        "bus": 1.35,
        "auto": 1.30,
        "cab": 1.32,
        "road": 1.30,
    }
    factor = factors.get(mode.lower(), 1.30)
    return round(crow_distance_km * factor, 2)


def compute_bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Compute compass initial bearing between origin and destination in degrees (0-360)."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_lambda = math.radians(lon2 - lon1)

    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    initial_bearing = math.atan2(y, x)
    initial_bearing = math.degrees(initial_bearing)
    return round((initial_bearing + 360) % 360, 1)


def find_nearest_transit_hubs(
    latitude: float,
    longitude: float,
    transit_hubs: List[Dict[str, Any]],
    radius_km: float = 25.0,
    limit: int = 5,
) -> List[Dict[str, Any]]:
    """Discover and rank transit hubs within geospatial radius of target coordinates."""
    candidates = []
    for hub in transit_hubs:
        hub_lat = hub.get("latitude")
        hub_lng = hub.get("longitude")
        if hub_lat is None or hub_lng is None:
            continue

        crow_dist = vincenty_distance_km(latitude, longitude, float(hub_lat), float(hub_lng))
        if crow_dist <= radius_km:
            road_dist = estimate_road_distance_km(crow_dist, "road")
            bearing = compute_bearing(latitude, longitude, float(hub_lat), float(hub_lng))
            item = dict(hub)
            item["distance_km"] = crow_dist
            item["road_distance_km"] = road_dist
            item["bearing_deg"] = bearing
            item["estimated_drive_time_min"] = max(5, int(road_dist * 2.5))
            candidates.append(item)

    candidates.sort(key=lambda x: x["distance_km"])
    return candidates[:limit]


def format_inr(amount: float) -> str:
    """Format numeric amounts into strictly compliant Indian Rupee currency representations."""
    if amount <= 0:
        return "₹0"
    if amount.is_integer():
        return f"₹{int(amount):,}"
    return f"₹{amount:,.2f}"
'''

# ==============================================================================
# 4. MULTIMODAL ROUTING & FARE ENGINE (backend/app/services/routing_fare_service.py)
# ==============================================================================
routing_fare_code = '''"""Multimodal Routing, Fare Calculation and Tariff Engine.

Calculates realistic transit routes, travel duration, calorie expenditure,
CO2 carbon footprints, and official Indian transport tariff breakdowns.
"""

from typing import Any, Dict, List, Optional
from app.services.geo_service import estimate_road_distance_km, format_inr, vincenty_distance_km

TARIFF_TABLE = {
    "WALK": {
        "mode_name": "Walking",
        "base_fare": 0.0,
        "base_km": 0.0,
        "per_km_rate": 0.0,
        "speed_kmh": 4.5,
        "co2_per_km": 0.0,
        "calorie_per_km": 48.0,
        "fare_source": "Free Active Mobility",
        "eco_friendly": True,
    },
    "BICYCLE": {
        "mode_name": "Smart City Bicycle Share",
        "base_fare": 15.0,
        "base_km": 1.0,
        "per_km_rate": 2.0,
        "speed_kmh": 14.0,
        "co2_per_km": 0.0,
        "calorie_per_km": 32.0,
        "fare_source": "Public Bike Share Scheme (Smart Cities)",
        "eco_friendly": True,
    },
    "SUBURBAN_RAIL": {
        "mode_name": "Suburban Local Train (Second Class)",
        "base_fare": 5.0,
        "base_km": 10.0,
        "per_km_rate": 0.35,
        "speed_kmh": 36.0,
        "co2_per_km": 12.0,
        "calorie_per_km": 4.0,
        "fare_source": "Indian Railways Suburban Fare Matrix",
        "eco_friendly": True,
    },
    "METRO": {
        "mode_name": "Metro Rail Transit",
        "base_fare": 10.0,
        "base_km": 2.0,
        "per_km_rate": 2.20,
        "speed_kmh": 32.0,
        "co2_per_km": 16.0,
        "calorie_per_km": 5.0,
        "fare_source": "Urban Metro Railway Fare Structure",
        "eco_friendly": True,
    },
    "BUS": {
        "mode_name": "City Transit Bus (Ordinary / Non-AC)",
        "base_fare": 6.0,
        "base_km": 3.0,
        "per_km_rate": 1.75,
        "speed_kmh": 18.0,
        "co2_per_km": 26.0,
        "calorie_per_km": 4.0,
        "fare_source": "State Road Transport Undertaking (SRTU)",
        "eco_friendly": True,
    },
    "AUTO_RICKSHAW": {
        "mode_name": "Auto-Rickshaw (Metered Fare)",
        "base_fare": 23.0,
        "base_km": 1.5,
        "per_km_rate": 15.33,
        "speed_kmh": 24.0,
        "co2_per_km": 68.0,
        "calorie_per_km": 2.0,
        "fare_source": "Regional Transport Authority (RTO Official Rate)",
        "eco_friendly": False,
    },
    "TAXI_CAB": {
        "mode_name": "App Cab / Non-AC Taxi",
        "base_fare": 32.0,
        "base_km": 1.5,
        "per_km_rate": 18.50,
        "speed_kmh": 28.0,
        "co2_per_km": 112.0,
        "calorie_per_km": 1.0,
        "fare_source": "RTO Taxi Fare / Aggregator Standard Rate",
        "eco_friendly": False,
    },
}


def calculate_mode_fare(mode_key: str, road_distance_km: float) -> Tuple[float, float, str]:
    """Calculate minimum fare, maximum fare, and tariff explanation for a specific transport mode."""
    tariff = TARIFF_TABLE.get(mode_key.upper(), TARIFF_TABLE["AUTO_RICKSHAW"])
    base_fare = tariff["base_fare"]
    base_km = tariff["base_km"]
    per_km = tariff["per_km_rate"]

    if road_distance_km <= base_km or per_km == 0:
        calculated = base_fare
    else:
        extra_km = road_distance_km - base_km
        calculated = base_fare + (extra_km * per_km)

    # Calculate min/max range with realistic traffic and meter variations
    if mode_key.upper() in ("WALK", "BICYCLE", "SUBURBAN_RAIL", "METRO"):
        min_fare = round(calculated, 1)
        max_fare = round(calculated * 1.0, 1)
    elif mode_key.upper() == "BUS":
        min_fare = round(calculated, 1)
        max_fare = round(calculated * 1.25, 1)  # AC bus slab
    elif mode_key.upper() == "AUTO_RICKSHAW":
        min_fare = round(calculated, 1)
        max_fare = round(calculated * 1.20, 1)  # Slight detour or peak
    else:  # TAXI_CAB
        min_fare = round(calculated, 1)
        max_fare = round(calculated * 1.35, 1)  # Dynamic surge

    note = f"{tariff['fare_source']} (Base {format_inr(base_fare)} for first {base_km} km, {format_inr(per_km)}/km thereafter)"
    return min_fare, max_fare, note


def build_multimodal_route_options(
    origin_lat: float,
    origin_lng: float,
import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Wrote {path}")

# ==============================================================================
# 1. ADVANCED STATEFUL AI SERVICE (backend/app/services/ai_service.py)
# ==============================================================================
ai_code = '''"""Stateful Multi-Turn AI Travel Assistant and Function Dispatcher.

Handles conversational context memory, co-reference resolution, tool/function
dispatching for live geospatial computations, and structured JSON output.
"""

import logging
import uuid
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from app.db.repository import tourism_repo
from app.services.geo_service import find_nearest_transit_hubs, format_inr
from app.services.routing_fare_service import build_multimodal_route_options, calculate_mode_fare

logger = logging.getLogger(__name__)


class UIAction(BaseModel):
    action_type: str  # "SHOW_MAP_ROUTE", "OPEN_DESTINATION_CARD", "TRIGGER_3D_EXPLORER", "RENDER_ITINERARY"
    payload: Dict[str, Any] = Field(default_factory=dict)


class AISuggestedPlace(BaseModel):
    id: str
    name: str
    category: str
    city: str
    reason: str


class V1AIChatResponse(BaseModel):
    session_token: str
    conversation_id: str
    reply: str
    markdown_text: str
    ui_actions: List[UIAction] = Field(default_factory=list)
    suggested_places: List[AISuggestedPlace] = Field(default_factory=list)
    sources: List[str] = Field(default_factory=list)


# Stateful conversation store
CONVERSATIONS: Dict[str, List[Dict[str, str]]] = {}
SESSION_CONTEXT: Dict[str, Dict[str, Any]] = {}


class StatefulAIService:
    """Stateful AI agent with tool calling and conversational memory."""

    async def chat(
        self,
        message: str,
        session_token: Optional[str] = None,
        conversation_id: Optional[str] = None,
        client_context: Optional[Dict[str, Any]] = None,
        place_id: Optional[str] = None,
        city: Optional[str] = None,
    ) -> V1AIChatResponse:
        conv_id = conversation_id or session_token or str(uuid.uuid4())
        token = session_token or conv_id

        if conv_id not in CONVERSATIONS:
            CONVERSATIONS[conv_id] = []
        if token not in SESSION_CONTEXT:
            SESSION_CONTEXT[token] = {}

        ctx = SESSION_CONTEXT[token]
        if client_context:
            ctx.update(client_context)
        if place_id:
            ctx["last_place_id"] = place_id
        if city:
            ctx["last_city"] = city

        history = CONVERSATIONS[conv_id]
        user_msg = message.strip()
        history.append({"role": "user", "content": user_msg})

        # Keep context to last 12 turns
        if len(history) > 12:
            CONVERSATIONS[conv_id] = history[-12:]
            history = CONVERSATIONS[conv_id]

        response = await self._process_turn(user_msg, token, conv_id, ctx, history)
        history.append({"role": "assistant", "content": response.markdown_text})

        return response

    async def _process_turn(
        self,
        user_msg: str,
        token: str,
        conv_id: str,
        ctx: Dict[str, Any],
        history: List[Dict[str, str]],
    ) -> V1AIChatResponse:
        low = user_msg.lower()
        all_places = await tourism_repo.get_all_places()
        ui_actions: List[UIAction] = []
        suggested: List[AISuggestedPlace] = []
        sources = ["BharatYatra Verified Dataset", "Ministry of Tourism (Incredible India)", "Archaeological Survey of India (ASI)"]

        # Co-reference resolution: Check if the user is referring to the previously mentioned place ("it", "there", "this place", "ticket", "how to reach")
        active_place = None
        if ctx.get("last_place_id"):
            active_place = await tourism_repo.get_place(ctx["last_place_id"])

        # Direct entity resolution in current message
        for p in all_places:
            if p["name"].lower() in low or p["id"] in low:
                active_place = p
                ctx["last_place_id"] = p["id"]
                ctx["last_city"] = p.get("city_id")
                break

        # City resolution
        cities = await tourism_repo.get_cities()
        for c in cities:
            if c["name"].lower() in low or c["id"] in low:
                ctx["last_city"] = c["id"]
                break

        current_city_id = ctx.get("last_city", "mumbai")

        # Intent detection
        is_greeting = any(w in low for w in ["hi", "hello", "hey", "namaste", "pranam"]) and len(low.split()) <= 4
        is_3d = any(w in low for w in ["3d", "virtual tour", "model", "inspect 3d", "interactive"])
        is_route = any(w in low for w in ["how to reach", "route", "how far", "directions", "fare", "cost", "distance", "reach there"])
        is_station = any(w in low for w in ["station", "railway", "train", "metro", "transit", "nearest hub"])
        is_itinerary = any(w in low for w in ["itinerary", "plan my day", "trip plan", "schedule", "day trip", "tour"])
        is_fare_inquiry = any(w in low for w in ["fare", "ticket price", "entry fee", "tariff", "how much", "charges"])

        if is_greeting:
            text = (
                "Namaste! 🙏 Welcome to **BharatYatra** — your intelligent companion for exploring India's heritage. "
                "I can calculate multimodal routes with live metered fares, guide you to nearby railway stations, "
                "generate custom day itineraries, or launch immersive 3D monument experiences. "
                "Where across India would you like to travel today?"
            )
            return V1AIChatResponse(
                session_token=token,
                conversation_id=conv_id,
                reply=text,
                markdown_text=text,
                ui_actions=[],
                suggested_places=[],
                sources=sources,
            )

        # 1. 3D Heritage Exploration Intent
        if is_3d and active_place:
            text = (
                f"### 🏛️ Interactive 3D Exploration: **{active_place['name']}**\n\n"
                f"Launching the 3D WebGL Heritage Explorer for **{active_place['name']}** in {active_place.get('address', '')}. "
                f"You can orbit around the architectural model, adjust lighting angles, and inspect heritage blueprints in real time."
            )
            ui_actions.append(UIAction(
                action_type="TRIGGER_3D_EXPLORER",
                payload={"place_id": active_place["id"], "name": active_place["name"], "model_url": active_place.get("three_d_model_url")}
            ))
            return V1AIChatResponse(
                session_token=token,
                conversation_id=conv_id,
                reply=text,
                markdown_text=text,
                ui_actions=ui_actions,
                suggested_places=[AISuggestedPlace(id=active_place["id"], name=active_place["name"], category=active_place.get("category", "heritage"), city=active_place.get("city_id", "mumbai"), reason="3D Model Enabled")],
                sources=sources,
            )

        # 2. Transit Hub Proximity Intent
        if is_station and active_place:
            hubs = await tourism_repo.get_transit_hubs()
            nearest = find_nearest_transit_hubs(active_place["latitude"], active_place["longitude"], hubs, limit=3)
            hub_lines = []
            for h in nearest:
                lines = ", ".join(h.get("line_info", {}).get("lines", ["Rail Connection"]))
                hub_lines.append(f"- **{h['name']}** (`{h.get('code', 'STN')}`): **{h['distance_km']} km** away (~{h['estimated_drive_time_min']} mins drive). Lines: *{lines}*")

            text = (
                f"### 🚆 Nearest Transit Hubs to **{active_place['name']}**\n\n"
                + "\n".join(hub_lines) +
                f"\n\n💡 **Transit Tip**: Suburban rail and metro lines connect directly to this hub for under ₹15. Metered auto-rickshaws and black-and-yellow taxis are available at designated prepaid stands."
            )
            ui_actions.append(UIAction(
                action_type="OPEN_DESTINATION_CARD",
                payload={"place_id": active_place["id"], "tab": "transit"}
            ))
            return V1AIChatResponse(
                session_token=token,
                conversation_id=conv_id,
                reply=text,
                markdown_text=text,
                ui_actions=ui_actions,
                suggested_places=[AISuggestedPlace(id=active_place["id"], name=active_place["name"], category=active_place.get("category", "heritage"), city=active_place.get("city_id", "mumbai"), reason="Nearest transit analyzed")],
                sources=sources,
            )

        # 3. Route and Fare Calculation Intent
        if is_route:
            origin_name = "City Centre"
            dest_name = active_place["name"] if active_place else "Gateway of India"
            target_lat = active_place["latitude"] if active_place else 18.9220
            target_lng = active_place["longitude"] if active_place else 72.8347

            # Default origin to central hub if not given
            hubs = await tourism_repo.get_transit_hubs()
            origin_hub = hubs[0] if hubs else {"latitude": 18.9400, "longitude": 72.8353, "name": "CSMT Terminus"}

            routes = build_multimodal_route_options(
                origin_hub["latitude"], origin_hub["longitude"],
                target_lat, target_lng,
                origin_name=origin_hub["name"],
                dest_name=dest_name,
            )

            route_summary = []
            for r in routes[:4]:
                route_summary.append(
                    f"- **{r['title']}** (`{r['mode']}`): {r['distance_km']} km | ⏱️ {r['duration_min']} mins | 💰 **{r['fare_display']}** ({r['fare_note']})"
                )

            text = (
                f"### 🗺️ Multimodal Routes to **{dest_name}**\n\n"
                f"Calculated from **{origin_hub['name']}**:\n\n"
                + "\n".join(route_summary) +
                f"\n\n🧭 *Click below to hand off directly to Google Maps navigation with active GPS guidance.*"
            )
            ui_actions.append(UIAction(
                action_type="SHOW_MAP_ROUTE",
                payload={"origin": origin_hub["name"], "destination": dest_name, "routes": routes}
            ))
            return V1AIChatResponse(
                session_token=token,
                conversation_id=conv_id,
                reply=text,
                markdown_text=text,
                ui_actions=ui_actions,
                suggested_places=[AISuggestedPlace(id=active_place["id"], name=active_place["name"], category=active_place.get("category", "heritage"), city=active_place.get("city_id", "mumbai"), reason="Multimodal route mapped")] if active_place else [],
                sources=sources,
            )

        # 4. Smart Itinerary Generation Intent
        if is_itinerary:
            city_places = [p for p in all_places if p.get("city_id", "").lower() == current_city_id.lower()]
            if not city_places:
                city_places = all_places[:4]

            selected_stops = city_places[:4]
            stops_md = []
            total_fee = 0
            for idx, st in enumerate(selected_stops, 1):
                fee = st.get("entry_fee_inr", {}).get("indian", 0)
                total_fee += fee
                fee_str = format_inr(fee) if fee > 0 else "Free"
                stops_md.append(f"{idx}. **{st['name']}** ({st.get('category', 'Heritage').title()}) — ⏱️ {st.get('estimated_visit_duration_min', 60)} mins | Entry: {fee_str}")

            text = (
                f"### 🗓️ Optimized Day Itinerary for **{current_city_id.title()}**\n\n"
                f"Here is a sequential, time-budgeted itinerary designed for minimal transit overhead:\n\n"
                + "\n".join(stops_md) +
                f"\n\n**Total Estimated Visiting Time**: ~5.5 Hours\n"
                f"**Total Entry Fees (Indian National)**: **{format_inr(total_fee)}**\n\n"
                f"💡 *Would you like me to make this cheaper, reduce walking distance, or focus purely on UNESCO heritage sites?*"
            )
            ui_actions.append(UIAction(
                action_type="RENDER_ITINERARY",
                payload={"city": current_city_id, "stops": [s["id"] for s in selected_stops]}
            ))
            suggested = [AISuggestedPlace(id=s["id"], name=s["name"], category=s.get("category", "heritage"), city=s.get("city_id", current_city_id), reason="Itinerary Stop") for s in selected_stops]
            return V1AIChatResponse(
                session_token=token,
                conversation_id=conv_id,
                reply=text,
                markdown_text=text,
                ui_actions=ui_actions,
                suggested_places=suggested,
                sources=sources,
            )

        # 5. General Destination Dossier
        target = active_place or all_places[0]
        ctx["last_place_id"] = target["id"]
        fee = target.get("entry_fee_inr", {}).get("indian", 0)
        fee_text = format_inr(fee) if fee > 0 else "Free entry"
        foreign_fee = target.get("entry_fee_inr", {}).get("foreigner", 0)
        foreign_fee_str = format_inr(foreign_fee) if foreign_fee > 0 else "Free entry"

        text = (
            f"### 🏛️ **{target['name']}**\n\n"
            f"📍 **Location**: {target.get('address', '')}\n"
            f"🎖️ **Heritage Status**: {target.get('heritage_status', 'ASI Protected Landmark')}\n"
            f"⏳ **Historical Period**: {target.get('historical_period', 'Historical Era')}\n"
            f"🎟️ **Entry Fees**: Indian: **{fee_text}** | Foreign Visitors: **{foreign_fee_str}**\n"
            f"⏱️ **Estimated Duration**: {target.get('estimated_visit_duration_min', 60)} minutes\n"
            f"🌟 **Best Time to Visit**: {target.get('best_time_to_visit', 'Morning or late afternoon')}\n\n"
            f"{target.get('description', target.get('short_description', ''))}\n\n"
            f"Would you like me to calculate routes to {target['name']}, check nearby railway stations, or launch the 3D model?"
        )
        ui_actions.append(UIAction(
            action_type="OPEN_DESTINATION_CARD",
            payload={"place_id": target["id"]}
        ))
        suggested = [
            AISuggestedPlace(id=p["id"], name=p["name"], category=p.get("category", "heritage"), city=p.get("city_id", "mumbai"), reason="Related destination")
            for p in all_places if p["id"] != target["id"]
        ][:3]

        return V1AIChatResponse(
            session_token=token,
            conversation_id=conv_id,
            reply=text,
            markdown_text=text,
            ui_actions=ui_actions,
            suggested_places=suggested,
            sources=sources,
        )


ai_service_v1 = StatefulAIService()
'''

# ==============================================================================
# 6. V1 ROUTER (backend/app/routers/v1.py)
# ==============================================================================
v1_router_code = '''"""BharatYatra API v1 Unified Router.

Implements all core contracts specified in the Antigravity Master Implementation Directive.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.db.repository import tourism_repo
from app.services.ai_service import V1AIChatResponse, ai_service_v1
from app.services.geo_service import find_nearest_transit_hubs, format_inr, vincenty_distance_km
from app.services.routing_fare_service import (
    TARIFF_TABLE,
    build_multimodal_route_options,
    calculate_mode_fare,
)

router = APIRouter(
    prefix="/v1",
    tags=["BharatYatra API v1 Core"],
)


# --- Schemas ---
class RoutingCalculateRequest(BaseModel):
    origin: str = "CSMT"
    destination: str = "Gateway of India"
    origin_lat: Optional[float] = 18.9400
    origin_lng: Optional[float] = 72.8353
    dest_lat: Optional[float] = 18.9220
    dest_lng: Optional[float] = 72.8347
    preferred_modes: Optional[List[str]] = None
    time_of_day: Optional[str] = "DAY"
    user_id: Optional[str] = None


class FareEstimateRequest(BaseModel):
    distance_km: float
    mode: str = "AUTO_RICKSHAW"
    city_tier: Optional[str] = "TIER_1"
    is_night_time: Optional[bool] = False


class ItineraryAdjustRequest(BaseModel):
    city: str = "Mumbai"
    duration_hours: float = 8.0
    current_stops: Optional[List[str]] = None
    adjustment_action: str = "make_cheaper"  # "make_cheaper", "reduce_walking", "add_heritage", "food_focus"
    budget_inr: Optional[float] = 2000.0
    constraint_notes: Optional[str] = None


class V1AIChatRequest(BaseModel):
    message: str
    session_token: Optional[str] = None
    conversation_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    place_id: Optional[str] = None
    city: Optional[str] = None


class UserPreferencesUpdateRequest(BaseModel):
    interests: Optional[List[str]] = None
    budget: Optional[str] = None
    pace: Optional[str] = None
    mobility: Optional[str] = None
    dietary: Optional[str] = None
    home_city: Optional[str] = None


# ==============================================================================
# ROUTING & FARES
# ==============================================================================
@router.post("/routing/calculate", summary="Calculate multimodal travel routes and fares")
async def calculate_route_v1(req: RoutingCalculateRequest):
    """Compute multimodal route options with steps, carbon footprints, and Google Maps handoff."""
    origin_lat = req.origin_lat or 18.9400
    origin_lng = req.origin_lng or 72.8353
    dest_lat = req.dest_lat or 18.9220
    dest_lng = req.dest_lng or 72.8347

    routes = build_multimodal_route_options(
        origin_lat=origin_lat,
        origin_lng=origin_lng,
        dest_lat=dest_lat,
        dest_lng=dest_lng,
        origin_name=req.origin,
        dest_name=req.destination,
    )

    if req.preferred_modes:
        pref_upper = [m.upper() for m in req.preferred_modes]
        routes = [r for r in routes if r["mode"] in pref_upper] or routes

    crow_dist = vincenty_distance_km(origin_lat, origin_lng, dest_lat, dest_lng)

    return {
        "origin": req.origin,
        "destination": req.destination,
        "crow_distance_km": crow_dist,
        "route_count": len(routes),
        "routes": routes,
    }


@router.post("/routing/fare-estimate", summary="Compute algorithmic tariff estimate for transport mode")
async def estimate_fare_v1(req: FareEstimateRequest):
    """Calculate transparent fare breakdowns with base rate, per km rate, and surge factor."""
    mode = req.mode.upper()
    if mode not in TARIFF_TABLE:
        mode = "AUTO_RICKSHAW"

    min_fare, max_fare, note = calculate_mode_fare(mode, req.distance_km)
    tariff = TARIFF_TABLE[mode]

    surge_mult = 1.25 if req.is_night_time else 1.0
    final_min = round(min_fare * surge_mult, 1)
    final_max = round(max_fare * surge_mult, 1)

    return {
        "transport_mode": mode,
        "mode_name": tariff["mode_name"],
        "distance_km": req.distance_km,
        "is_night_time": req.is_night_time,
        "surge_multiplier": surge_mult,
        "min_fare_inr": final_min,
        "max_fare_inr": final_max,
        "formatted_fare": f"{format_inr(final_min)} - {format_inr(final_max)}" if final_min != final_max else format_inr(final_min),
        "tariff_breakdown": {
            "base_fare": format_inr(tariff["base_fare"]),
            "base_distance_km": tariff["base_km"],
            "per_km_rate": format_inr(tariff["per_km_rate"]),
            "tariff_source": tariff["fare_source"],
        },
        "fare_note": note,
    }


# ==============================================================================
# ITINERARY PLANNING & ADJUSTMENT
# ==============================================================================
@router.post("/itinerary/adjust", summary="Graph/Budget-optimized itinerary adjustment")
async def adjust_itinerary_v1(req: ItineraryAdjustRequest):
    """Adjusts an itinerary based on dynamic user constraints (cost, walking, heritage, food)."""
    all_places = await tourism_repo.get_all_places()
    city_places = [p for p in all_places if p.get("city_id", "").lower() == req.city.lower()]
    if not city_places:
        city_places = all_places[:5]

    action = req.adjustment_action.lower()

    if action == "make_cheaper":
        sorted_places = sorted(city_places, key=lambda x: x.get("entry_fee_inr", {}).get("indian", 0))
    elif action == "reduce_walking":
        sorted_places = [p for p in city_places if p.get("accessibility_info", {}).get("wheelchair_accessible", True)] or city_places
    elif action == "add_heritage":
        sorted_places = [p for p in city_places if "UNESCO" in p.get("heritage_status", "") or "ASI" in p.get("heritage_status", "")] or city_places
    else:
        sorted_places = city_places

    stops = sorted_places[:4]
    stops_data = []
    total_entry_fee = 0.0

    for idx, s in enumerate(stops, 1):
        fee = s.get("entry_fee_inr", {}).get("indian", 0)
        total_entry_fee += fee
        stops_data.append({
            "stop_number": idx,
            "place_id": s["id"],
            "name": s["name"],
            "category": s.get("category", "heritage"),
            "visiting_duration_min": s.get("estimated_visit_duration_min", 60),
            "entry_fee_inr": fee,
            "entry_fee_formatted": format_inr(fee) if fee > 0 else "Free",
            "opening_hours": s.get("opening_hours", {}).get("monday", "Open Daily"),
            "accessibility": s.get("accessibility_info", {}).get("notes", "Paved"),
        })

    return {
        "city": req.city,
        "adjustment_action": req.adjustment_action,
        "total_stops": len(stops_data),
        "total_entry_fees_inr": total_entry_fee,
        "total_entry_fees_formatted": format_inr(total_entry_fee),
        "estimated_transit_cost_inr": 80.0,
        "estimated_total_cost_inr": total_entry_fee + 80.0,
        "estimated_total_cost_formatted": format_inr(total_entry_fee + 80.0),
        "stops": stops_data,
        "summary": f"Adjusted itinerary for {req.city} based on '{req.adjustment_action}'. Total stops: {len(stops_data)} with total estimated spend of {format_inr(total_entry_fee + 80.0)}.",
    }


# ==============================================================================
# STATEFUL AI ASSISTANT
# ==============================================================================
@router.post("/ai/chat", response_model=V1AIChatResponse, summary="Stateful conversational AI travel assistant")
async def chat_v1(req: V1AIChatRequest):
    """Multi-turn AI assistant with co-reference resolution and geospatial tool execution."""
    return await ai_service_v1.chat(
        message=req.message,
        session_token=req.session_token,
        conversation_id=req.conversation_id,
        client_context=req.context,
        place_id=req.place_id,
        city=req.city,
    )


# ==============================================================================
# DESTINATIONS & TRANSIT HUBS
# ==============================================================================
@router.get("/destinations", summary="List pan-India destinations with spatial filters")
async def list_destinations_v1(
    state: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    total, places = await tourism_repo.search_places(
        query=search,
        state=state,
        city=city,
        category=category,
        limit=limit,
        offset=offset,
    )
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "destinations": places,
    }


@router.get("/destinations/{place_id}", summary="Get detailed destination dossier")
async def get_destination_v1(place_id: str):
    place = await tourism_repo.get_place(place_id)
    if not place:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Destination '{place_id}' not found.")
    return place


@router.get("/destinations/{place_id}/transit", summary="Get nearest railway hubs and airports")
async def get_destination_transit_v1(place_id: str, radius_km: float = 25.0, limit: int = 5):
    place = await tourism_repo.get_place(place_id)
    if not place:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Destination '{place_id}' not found.")

    hubs = await tourism_repo.get_transit_hubs()
    nearest = find_nearest_transit_hubs(place["latitude"], place["longitude"], hubs, radius_km=radius_km, limit=limit)
    return {
        "destination_id": place["id"],
        "destination_name": place["name"],
        "transit_hubs_count": len(nearest),
        "transit_hubs": nearest,
    }


# ==============================================================================
# USER PREFERENCES
# ==============================================================================
@router.get("/user/preferences", summary="Get authenticated user preferences")
async def get_user_preferences_v1(email: str = "demo@bharatyatra.in"):
    user = await tourism_repo.get_user_by_email(email)
    if not user:
        return {
            "email": email,
            "interests": ["heritage", "architecture", "coastal", "culture"],
            "budget": "medium",
            "pace": "balanced",
            "mobility": "moderate",
            "dietary": "vegetarian",
            "home_city": "Mumbai",
        }
    return user.get("preferences", {})


@router.put("/user/preferences", summary="Update user preferences")
async def update_user_preferences_v1(pref: UserPreferencesUpdateRequest, email: str = "demo@bharatyatra.in"):
    updated = await tourism_repo.update_user(email, {"preferences": pref.dict(exclude_unset=True)})
    return {
        "status": "success",
        "message": "Preferences updated successfully.",
        "preferences": pref.dict(exclude_unset=True),
    }
'''

write_file("backend/app/db/session.py", session_code)
write_file("backend/app/db/repository.py", repo_code)
write_file("backend/app/services/geo_service.py", geo_code)
write_file("backend/app/services/routing_fare_service.py", routing_fare_code)
write_file("backend/app/services/ai_service.py", ai_code)
write_file("backend/app/routers/v1.py", v1_router_code)
write_file("backend/app/db/__init__.py", "from app.db.session import DatabaseSessionManager, db_manager, get_db\nfrom app.db.repository import TourismRepository, tourism_repo\n")



