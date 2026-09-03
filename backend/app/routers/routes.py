from fastapi import APIRouter, Query
from typing import Optional
from ..schemas.route import RouteRequest, RouteResponse
from ..services.routing_service import routing_service

router = APIRouter(tags=["Routing"])


@router.post("/routes/calculate", response_model=RouteResponse)
async def calculate_route(request: RouteRequest):
    """Calculate multimodal travel routes and fare estimates between two points."""
    return routing_service.calculate_multimodal_route(
        origin=request.origin,
        destination=request.destination,
        mode=request.mode or "DRIVE",
    )


@router.get("/railway/stations")
async def get_railway_stations(city: Optional[str] = Query("Mumbai")):
    """Retrieve railway stations and connectivity hubs."""
    # Stations catalogue
    stations = [
        {"id": "CSMT", "name": "Chhatrapati Shivaji Maharaj Terminus", "code": "CSMT", "lines": ["Central", "Harbour"], "lat": 18.9402, "lng": 72.8356},
        {"id": "CCG", "name": "Churchgate", "code": "CCG", "lines": ["Western"], "lat": 18.9322, "lng": 72.8264},
        {"id": "BCT", "name": "Mumbai Central", "code": "MMCT", "lines": ["Western"], "lat": 18.9696, "lng": 72.8193},
        {"id": "DR", "name": "Dadar", "code": "DR", "lines": ["Central", "Western"], "lat": 19.0178, "lng": 72.8478},
        {"id": "BDTS", "name": "Bandra Terminus", "code": "BDTS", "lines": ["Western"], "lat": 19.0607, "lng": 72.8407},
        {"id": "NDLS", "name": "New Delhi Railway Station", "code": "NDLS", "lines": ["Northern"], "lat": 28.6430, "lng": 77.2197},
        {"id": "JP", "name": "Jaipur Junction", "code": "JP", "lines": ["North Western"], "lat": 26.9196, "lng": 75.7878},
    ]
    return stations
