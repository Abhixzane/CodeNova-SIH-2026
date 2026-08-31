"""Nearby Places Service for Proximity and Geographic Discovery."""

import math
from typing import List, Optional
from app.models.nearby import NearbyPlaceItem, NearbyPlacesResponse
from app.models.place import Coordinates
from app.services.place_service import place_service


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points on the Earth in kilometers."""
    # Earth radius in kilometers
    R = 6371.0

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


class NearbyService:
    """Calculates proximity to destinations and returns nearby tourist places."""

    def __init__(self, service=place_service) -> None:
        self.place_service = service

    def find_nearby(
        self,
        lat: float,
        lng: float,
        radius_km: float = 50.0,
        category: Optional[str] = None,
        limit: int = 10,
    ) -> NearbyPlacesResponse:
        """Find places near specified coordinates within radius, sorted by distance."""
        places = self.place_service.get_all_places()
        results: List[NearbyPlaceItem] = []

        category_clean = category.strip().lower() if category else None

        for place in places:
            if category_clean and place.category.lower() != category_clean:
                continue

            dist = haversine_distance_km(lat, lng, place.coordinates.lat, place.coordinates.lng)

            if dist <= radius_km:
                results.append(
                    NearbyPlaceItem(
                        id=place.id,
                        name=place.name,
                        category=place.category,
                        city=place.city,
                        state=place.state,
                        coordinates=place.coordinates,
                        distance_km=round(dist, 2),
                        rating=place.rating,
                        thumbnail_url=place.thumbnail_url,
                    )
                )

        # Sort ascending by distance
        results.sort(key=lambda item: item.distance_km)
        limited_results = results[:limit]

        return NearbyPlacesResponse(
            origin=Coordinates(lat=lat, lng=lng),
            radius_km=radius_km,
            count=len(limited_results),
            results=limited_results,
        )


# Global singleton instance
nearby_service = NearbyService()
