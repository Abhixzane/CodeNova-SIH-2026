"""Tourist Places & Destinations Router.

Provides endpoints for querying, filtering, discovering nearby locations,
and retrieving detailed information about tourist destinations across India.
"""

from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.models.nearby import NearbyPlacesResponse
from app.models.place import (
    Coordinates,
    PlaceDetail,
    PlaceListResponse,
    PlaceSummary,
)
from app.services.nearby_service import nearby_service
from app.services.place_service import place_service

router = APIRouter(
    prefix="/places",
    tags=["Places"],
)


# Backward-compatibility mapping proxy
class _PlacesDBProxy(dict):
    """Proxy dictionary allowing backward-compatible access to places."""

    def __getitem__(self, key: str) -> PlaceDetail:
        p = place_service.get_place(key)
        if not p:
            raise KeyError(key)
        return p

    def get(self, key: str, default=None):
        p = place_service.get_place(key)
        return p if p is not None else default

    def values(self):
        return place_service.get_all_places()

    def __contains__(self, key: object) -> bool:
        if isinstance(key, str):
            return place_service.get_place(key) is not None
        return False


SAMPLE_PLACES_DB: Dict[str, PlaceDetail] = _PlacesDBProxy()


@router.get(
    "",
    response_model=PlaceListResponse,
    summary="Get places (with optional state, city, and category filters)",
    description="Retrieve a paginated list of tourist destinations, optionally filtered by state, city, or category.",
)
async def get_places(
    state: Optional[str] = Query(
        None,
        description="Filter places by state name or identifier (case-insensitive, e.g. 'maharashtra', 'rajasthan')",
    ),
    city: Optional[str] = Query(
        None,
        description="Filter places by city name (case-insensitive, e.g. 'mumbai')",
    ),
    category: Optional[str] = Query(
        None,
        description="Filter places by category (e.g. 'heritage', 'coastal', 'nature', 'spiritual', 'cultural')",
    ),
    limit: int = Query(20, ge=1, le=100, description="Maximum number of places to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
) -> PlaceListResponse:
    """Retrieve and filter places."""
    total, data = place_service.list_places(
        state=state,
        city=city,
        category=category,
        limit=limit,
        offset=offset,
    )

    return PlaceListResponse(
        total=total,
        limit=limit,
        offset=offset,
        data=data,
    )


@router.get(
    "/nearby",
    response_model=NearbyPlacesResponse,
    summary="Find nearby tourist destinations",
    description="Find destinations near an origin coordinate within a specified radius (in km), sorted by distance.",
)
async def get_nearby_places(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees (-90 to +90)"),
    lng: float = Query(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees (-180 to +180)"),
    radius: float = Query(50.0, ge=0.5, le=500.0, description="Search radius in kilometers"),
    category: Optional[str] = Query(None, description="Optional category filter (e.g. 'heritage', 'coastal')"),
    limit: int = Query(10, ge=1, le=50, description="Maximum results to return"),
) -> NearbyPlacesResponse:
    """Calculate proximity to destinations and return nearest places."""
    return nearby_service.find_nearby(
        lat=lat,
        lng=lng,
        radius_km=radius,
        category=category,
        limit=limit,
    )


@router.get(
    "/{place_id}",
    response_model=PlaceDetail,
    summary="Get place details by ID",
    description="Retrieve full details, 3D model info, coordinates, and tourism metadata for a specific tourist place.",
)
async def get_place_by_id(place_id: str) -> PlaceDetail:
    """Retrieve details for a single place."""
    place = place_service.get_place(place_id.strip().lower())
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Place with id '{place_id}' not found",
        )
    return place
