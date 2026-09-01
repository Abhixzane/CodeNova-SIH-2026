from typing import List, Optional
from fastapi import APIRouter, Query
from app.models.railway_station import RailwayStation
from app.services.station_service import station_service

router = APIRouter(prefix="/railway-stations", tags=["Railway Stations"])

@router.get("", response_model=List[RailwayStation], summary="List railway stations")
async def list_stations(city: Optional[str] = Query(None, description="City filter")):
    return station_service.get_all_stations(city=city)

@router.get("/nearby", response_model=List[RailwayStation], summary="Get nearby railway stations by coordinates")
async def get_nearby_stations(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius_km: float = Query(25.0, description="Radius in km"),
    limit: int = Query(4, description="Max stations to return")
):
    return station_service.get_nearby_stations(lat=lat, lng=lng, radius_km=radius_km, limit=limit)
