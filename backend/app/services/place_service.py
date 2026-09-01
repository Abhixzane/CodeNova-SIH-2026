"""Tourism Data Repository and Place Service.

Loads, caches, and provides structured access to Indian states and curated destinations.
"""

import json
import logging
import os
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from app.config import settings
from app.models.place import Coordinates, PlaceDetail, PlaceSummary
from app.models.route import LocationInfo
from app.models.state import State

logger = logging.getLogger(__name__)


class PlaceService:
    """Service for managing, querying, and filtering tourism places and states."""

    def __init__(self, data_dir: Optional[str] = None) -> None:
        self.data_dir = Path(data_dir or settings.DATA_DIR)
        self._places_cache: Dict[str, PlaceDetail] = {}
        self._states_cache: List[State] = []
        self._load_datasets()

    def _load_datasets(self) -> None:
        """Scan and load states and regional place datasets into memory."""
        self._places_cache.clear()
        self._states_cache.clear()

        # 1. Load states dataset
        states_path = self.data_dir / "states.json"
        if states_path.exists():
            try:
                with open(states_path, "r", encoding="utf-8") as f:
                    states_data = json.load(f)
                    self._states_cache = [State(**item) for item in states_data]
            except Exception as e:
                logger.error(f"Failed to load states from {states_path}: {e}")
        else:
            logger.warning(f"States file not found at {states_path}")

        # 2. Discover and load all places.json files in subdirectories
        if self.data_dir.exists():
            for places_file in self.data_dir.glob("**/places.json"):
                try:
                    with open(places_file, "r", encoding="utf-8") as f:
                        places_data = json.load(f)
                        for item in places_data:
                            place = PlaceDetail(**item)
                            self._places_cache[place.id.strip().lower()] = place
                except Exception as e:
                    logger.error(f"Failed to load places from {places_file}: {e}")

        logger.info(f"PlaceService loaded {len(self._places_cache)} places and {len(self._states_cache)} states.")

    def get_states(self) -> List[State]:
        """Return all available states."""
        return list(self._states_cache)

    def get_all_places(self) -> List[PlaceDetail]:
        """Return list of all places in memory."""
        return list(self._places_cache.values())

    def get_place(self, place_id: str) -> Optional[PlaceDetail]:
        """Retrieve place detail by canonical ID."""
        if not place_id:
            return None
        return self._places_cache.get(place_id.strip().lower())

    def list_places(
        self,
        state: Optional[str] = None,
        city: Optional[str] = None,
        category: Optional[str] = None,
        tags: Optional[List[str]] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> Tuple[int, List[PlaceSummary]]:
        """Filter and paginate place summaries."""
        filtered = list(self._places_cache.values())

        if state:
            state_clean = state.strip().lower()
            filtered = [
                p for p in filtered
                if state_clean in p.state.lower() or state_clean in p.id.lower()
            ]

        if city:
            city_clean = city.strip().lower()
            filtered = [
                p for p in filtered
                if city_clean in p.city.lower()
            ]

        if category:
            category_clean = category.strip().lower()
            filtered = [
                p for p in filtered
                if p.category.lower() == category_clean
            ]

        if tags:
            tags_clean = [t.strip().lower() for t in tags if t.strip()]
            filtered = [
                p for p in filtered
                if any(tc in [pt.lower() for pt in p.tags] for tc in tags_clean)
            ]

        total = len(filtered)
        paginated = filtered[offset : offset + limit]

        summaries = [
            PlaceSummary(
                id=p.id,
                name=p.name,
                state=p.state,
                city=p.city,
                country=p.country,
                category=p.category,
                summary=p.summary,
                coordinates=p.coordinates,
                rating=p.rating,
                thumbnail_url=p.thumbnail_url,
                tags=p.tags,
                features=p.features,
            )
            for p in paginated
        ]

        return total, summaries

    def resolve_location(
        self,
        location_identifier: Optional[str] = None,
        lat: Optional[float] = None,
        lng: Optional[float] = None,
    ) -> Optional[LocationInfo]:
        """Resolve a location input (place ID, place name, or lat/lng coordinates) to LocationInfo."""
        # 1. If explicit coordinates provided
        if lat is not None and lng is not None:
            # Check if coordinates closely match a known place
            matched_place = None
            for p in self._places_cache.values():
                if abs(p.coordinates.lat - lat) < 0.001 and abs(p.coordinates.lng - lng) < 0.001:
                    matched_place = p
                    break

            name = matched_place.name if matched_place else (location_identifier or f"Coordinates ({lat:.4f}, {lng:.4f})")
            place_id = matched_place.id if matched_place else None

            return LocationInfo(
                name=name,
                place_id=place_id,
                latitude=lat,
                longitude=lng,
            )

        # 2. If place ID / name identifier provided
        if location_identifier:
            ident_clean = location_identifier.strip().lower()
            # Direct ID match
            if ident_clean in self._places_cache:
                p = self._places_cache[ident_clean]
                return LocationInfo(
                    name=p.name,
                    place_id=p.id,
                    latitude=p.coordinates.lat,
                    longitude=p.coordinates.lng,
                )

            # Name fuzzy/substring match
            for p in self._places_cache.values():
                if ident_clean in p.name.lower() or ident_clean in p.id.lower():
                    return LocationInfo(
                        name=p.name,
                        place_id=p.id,
                        latitude=p.coordinates.lat,
                        longitude=p.coordinates.lng,
                    )

        return None


# Global singleton instance
place_service = PlaceService()
