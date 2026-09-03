from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class RouteStep(BaseModel):
    instruction: str
    distance_km: Optional[float] = 0.0
    duration_mins: Optional[int] = 0
    mode: Optional[str] = "DRIVE"


class RouteOption(BaseModel):
    mode: str
    duration_mins: int
    distance_km: float
    estimated_fare: Optional[float] = None
    fare_status: str = "estimated"
    fare_note: Optional[str] = None
    steps: Optional[List[str]] = []


class RouteRequest(BaseModel):
    origin: str
    destination: str
    mode: Optional[str] = "DRIVE"


class RouteResponse(BaseModel):
    origin: str
    destination: str
    distance_km: float
    duration_mins: int
    transport_mode: str
    estimated_fare: float
    fare_currency: str = "INR"
    route_summary: str
    steps: List[RouteStep] = []
    options: Optional[List[RouteOption]] = []
    google_maps_url: Optional[str] = None
