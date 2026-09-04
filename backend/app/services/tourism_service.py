import json
from pathlib import Path
from backend.app.config import DATA_DIR

class TourismDataService:
    def __init__(self):
        self.data_dir = DATA_DIR
        self._load_data()

    def _load_json(self, path: Path):
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def _load_data(self):
        self.states = self._load_json(self.data_dir / "states.json")
        self.cities = self._load_json(self.data_dir / "cities.json")
        self.tourism = self._load_json(self.data_dir / "india_tourism.json")
        self.heritage = self._load_json(self.data_dir / "heritage" / "monuments.json")
        self.railway_stations = self._load_json(self.data_dir / "railway_stations.json")
        self.mumbai_local = self._load_json(self.data_dir / "mumbai_local_network.json")
        self.fares = self._load_json(self.data_dir / "fares.json")
        self.accessibility = self._load_json(self.data_dir / "accessibility.json")
        self.facilities = self._load_json(self.data_dir / "facilities.json")
        self.artisans = self._load_json(self.data_dir / "artisans.json")
        self.culture = self._load_json(self.data_dir / "culture.json")
        self.destination_health = self._load_json(self.data_dir / "destination_health.json")
        self.reports = self._load_json(self.data_dir / "reports.json")
        self.providers = self._load_json(self.data_dir / "providers.json")

    def get_states(self):
        return self.states

    def get_state(self, state_id: str):
        for s in self.states:
            if s.get("id", "").lower() == state_id.lower():
                return s
        return None

    def get_cities(self, state: str = None):
        if not state:
            return self.cities
        return [c for c in self.cities if c.get("state", "").lower() == state.lower()]

    def get_places(self, city: str = None, category: str = None, limit: int = 50):
        # Extract places from india_tourism datasets
        places = []
        if isinstance(self.tourism, list):
            places.extend(self.tourism)
        elif isinstance(self.tourism, dict) and "destinations" in self.tourism:
            places.extend(self.tourism["destinations"])

        filtered = places
        if city and city.lower() != "all india":
            filtered = [p for p in filtered if p.get("city", "").lower() == city.lower() or p.get("state", "").lower() == city.lower()]
        if category:
            filtered = [p for p in filtered if p.get("category", "").lower() == category.lower()]
        return filtered[:limit]

    def get_heritage_monuments(self, unesco_only: bool = False, state: str = None):
        monuments = self.heritage if isinstance(self.heritage, list) else self.heritage.get("monuments", [])
        if unesco_only:
            monuments = [m for m in monuments if m.get("unesco_status") or m.get("is_unesco")]
        if state:
            monuments = [m for m in monuments if m.get("state", "").lower() == state.lower()]
        return monuments

tourism_service = TourismDataService()
