"""Travel Intelligence and Routing Router.

Provides travel options (Walking, Driving, Transit, Bicycling) between
any two points (canonical place IDs, names, or explicit coordinates),
with distance, duration, transit steps, and reliable fare indications.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.models.route import RouteResponse
from app.services.place_service import place_service
from app.services.routing_service import routing_service

router = APIRouter(
    prefix="/routes",
    tags=["Routes & Travel Intelligence"],
)


@router.get(
    "",
    response_model=RouteResponse,
    summary="Get multi-modal travel routes, durations, and estimated fares",
    description="Calculate travel options between an origin and destination (place IDs, landmark names, or coordinates).",
)
async def get_travel_routes(
    origin: Optional[str] = Query(None, description="Origin place ID, landmark name, or 'lat,lng'"),
    destination: Optional[str] = Query(None, description="Destination place ID, landmark name, or 'lat,lng'"),
    origin_lat: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Explicit origin latitude"),
    origin_lng: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Explicit origin longitude"),
    dest_lat: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Explicit destination latitude"),
    dest_lng: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Explicit destination longitude"),
    mode: Optional[str] = Query(None, description="Optional specific transport mode ('DRIVE', 'TRANSIT', 'WALK', 'BICYCLE')"),
) -> RouteResponse:
    """Resolve origin and destination points and compute multi-modal routes."""
    # 1. Parse string 'lat,lng' format if passed in origin / destination
    if origin and "," in origin and origin_lat is None:
        parts = origin.split(",")
        try:
            origin_lat, origin_lng = float(parts[0].strip()), float(parts[1].strip())
            origin = None
        except ValueError:
            pass

    if destination and "," in destination and dest_lat is None:
        parts = destination.split(",")
        try:
            dest_lat, dest_lng = float(parts[0].strip()), float(parts[1].strip())
            destination = None
        except ValueError:
            pass

    # 2. Resolve origin
    origin_loc = place_service.resolve_location(origin, lat=origin_lat, lng=origin_lng)
    if not origin_loc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to resolve origin. Provide a valid place ID (e.g. 'csmt'), landmark name, or coordinates.",
        )

    # 3. Resolve destination
    dest_loc = place_service.resolve_location(destination, lat=dest_lat, lng=dest_lng)
    if not dest_loc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to resolve destination. Provide a valid place ID (e.g. 'marine-drive'), landmark name, or coordinates.",
        )

    # 4. Fetch normalized multi-modal route options
    return await routing_service.get_routes(origin_loc, dest_loc, requested_mode=mode)
