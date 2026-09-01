import json
import logging
from pathlib import Path
from typing import List, Optional
from app.config import settings
from app.models.railway_station import RailwayStation
from app.services.nearby_service import haversine_distance_km

logger = logging.getLogger(__name__)

class StationService:
    def __init__(self, data_dir: Optional[str] = None):
        self.data_dir = Path(data_dir or settings.DATA_DIR)
        self._stations: List[RailwayStation] = []
        self._load()

    def _load(self):
        stations_path = self.data_dir / "railway_stations.json"
        if stations_path.exists():
            try:
                with open(stations_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._stations = [RailwayStation(**item) for item in data]
                logger.info(f"StationService loaded {len(self._stations)} railway stations.")
            except Exception as e:
                logger.error(f"Failed to load railway stations: {e}")

    def get_all_stations(self, city: Optional[str] = None) -> List[RailwayStation]:
        if city:
            c = city.strip().lower()
            return [s for s in self._stations if s.city.lower() == c]
        return list(self._stations)

    def get_nearby_stations(self, lat: float, lng: float, radius_km: float = 25.0, limit: int = 4) -> List[RailwayStation]:
        results = []
        for st in self._stations:
            dist = haversine_distance_km(lat, lng, st.lat, st.lng)
            if dist <= radius_km:
                walk_mins = max(1, int((dist * 1.3 / 4.5) * 60))
                road_mins = max(1, int((dist * 1.3 / 22.0) * 60))
                st_copy = st.model_copy(update={
                    "distance_km": round(dist, 1),
                    "walking_time_mins": walk_mins,
                    "road_time_mins": road_mins
                })
                results.append((dist, st_copy))

        results.sort(key=lambda x: x[0])
        return [item[1] for item in results[:limit]]

station_service = StationService()
