from typing import List, Optional
from pydantic import BaseModel

class TripStopItem(BaseModel):
    order: int
    place_id: str
    place_name: str
    visit_minutes: int
    travel_minutes: Optional[int] = None

class TripItem(BaseModel):
    id: str
    title: str
    city: str
    duration_hours: float
    total_places: int
    estimated_cost: float
    stops: List[TripStopItem]
    created_at: Optional[str] = None

class TripCreateRequest(BaseModel):
    title: str
    city: str
    duration_hours: float
    stops: List[TripStopItem]
    estimated_cost: float = 0.0
