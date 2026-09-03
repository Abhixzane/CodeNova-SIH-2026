import json
import os
from typing import List, Optional, Dict, Any

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))


class TourismService:
    def __init__(self):
        self._states = []
        self._places = []
        self._load_data()

    def _load_data(self):
        # Load states
        states_path = os.path.join(DATA_DIR, "states.json")
        if os.path.exists(states_path):
            with open(states_path, "r", encoding="utf-8") as f:
                self._states = json.load(f)

        # Load all places from data/india_tourism.json and regional files
        places_path = os.path.join(DATA_DIR, "india_tourism.json")
        if os.path.exists(places_path):
            with open(places_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    self._places = data.get("places", [])
                elif isinstance(data, list):
                    self._places = data
        else:
            # Fallback to mumbai places
            mumbai_path = os.path.join(DATA_DIR, "mumbai", "places.json")
            if os.path.exists(mumbai_path):
                with open(mumbai_path, "r", encoding="utf-8") as f:
                    self._places = json.load(f)

    def get_states(self) -> List[Dict[str, Any]]:
        return self._states

    def get_places(
        self,
        state: Optional[str] = None,
        city: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> Dict[str, Any]:
        results = self._places
        if state:
            results = [p for p in results if p.get("state", "").lower() == state.lower()]
        if city:
            results = [p for p in results if p.get("city", "").lower() == city.lower()]
        if category:
            results = [p for p in results if p.get("category", "").lower() == category.lower()]

        total = len(results)
        paged = results[offset : offset + limit]
        return {"total": total, "limit": limit, "offset": offset, "data": paged}

    def get_place_by_id(self, place_id: str) -> Optional[Dict[str, Any]]:
        for place in self._places:
            if place.get("id") == place_id:
                return place
        return None

    def search_places(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        q = query.lower().strip()
        matched = []
        for p in self._places:
            score = 0
            if q in p.get("name", "").lower():
                score += 3
            if q in p.get("city", "").lower():
                score += 2
            if q in p.get("category", "").lower():
                score += 1
            if q in p.get("summary", "").lower():
                score += 1
            if score > 0:
                matched.append({**p, "match_score": score})
        matched.sort(key=lambda x: x.get("match_score", 0), reverse=True)
        return matched[:limit]


tourism_service = TourismService()
