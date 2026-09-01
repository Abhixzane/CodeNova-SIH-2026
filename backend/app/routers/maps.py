"""Google Maps Navigation Handoff Router.

Generates official cross-platform Google Maps Direction URLs to hand off
turn-by-turn navigation directly to the Google Maps application without
exposing backend secrets or building a bespoke turn-by-turn engine.
"""

from typing import Dict, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from app.services.maps_service import maps_service
from app.services.place_service import place_service

router = APIRouter(
    prefix="/maps",
    tags=["Maps & Navigation Handoff"],
)


class MapsDirectionsResponse(BaseModel):
    """Google Maps navigation handoff response schema."""

    origin: str = Field(..., description="Resolved origin name or coordinate string")
    destination: str = Field(..., description="Resolved destination name or coordinate string")
    travel_mode: str = Field(default="driving", description="Selected travel mode")
    url: str = Field(..., description="Safe, cross-platform Google Maps direction URL")


@router.get(
    "/directions",
    response_model=MapsDirectionsResponse,
    summary="Generate Google Maps Navigation Handoff URL",
    description="Generate a secure, official Google Maps navigation URL for the client to open in browser/app.",
)
async def get_maps_directions_url(
    origin: Optional[str] = Query(None, description="Origin place ID, landmark name, or 'lat,lng'"),
    destination: Optional[str] = Query(None, description="Destination place ID, landmark name, or 'lat,lng'"),
    origin_lat: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Explicit origin latitude"),
    origin_lng: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Explicit origin longitude"),
    dest_lat: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Explicit destination latitude"),
    dest_lng: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Explicit destination longitude"),
    travel_mode: str = Query("driving", description="Mode of travel ('driving', 'walking', 'transit', 'bicycling')"),
) -> MapsDirectionsResponse:
    """Generate universal Google Maps navigation URL."""
    # Parse string 'lat,lng' format if passed in origin / destination
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

    origin_loc = place_service.resolve_location(origin, lat=origin_lat, lng=origin_lng)
    if not origin_loc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to resolve origin. Provide a valid place ID or coordinates.",
        )

    dest_loc = place_service.resolve_location(destination, lat=dest_lat, lng=dest_lng)
    if not dest_loc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to resolve destination. Provide a valid place ID or coordinates.",
        )

    nav_url = maps_service.generate_directions_url(origin_loc, dest_loc, travel_mode=travel_mode)

    return MapsDirectionsResponse(
        origin=origin_loc.name,
        destination=dest_loc.name,
        travel_mode=travel_mode,
        url=nav_url,
    )
