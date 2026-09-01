"""Unified Tourism and Geospatial Repository.

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
