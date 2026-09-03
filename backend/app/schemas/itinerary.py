from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class ItineraryRequest(BaseModel):
    city: str
    duration_hours: float = 8.0
    interests: Optional[List[str]] = ["heritage", "architecture"]
    pace: Optional[str] = "moderate"
    budget_level: Optional[str] = "moderate"


class ItineraryStop(BaseModel):
    order: int
    place_id: str
    name: Optional[str] = None
    place_name: Optional[str] = None
    category: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    recommended_duration_minutes: Optional[int] = 60
    visit_minutes: Optional[int] = 60
    travel_time_from_previous_minutes: Optional[int] = 15
    travel_mode_from_previous: Optional[str] = "Taxi / Metro"
    distance_from_previous_km: Optional[float] = 3.5
    tips: Optional[str] = None
    visit_tips: Optional[str] = None
    activity: Optional[str] = None


class TotalCostEstimate(BaseModel):
    budget: float
    moderate: float
    luxury: float


class ItineraryResponse(BaseModel):
    title: str
    city: str
    duration_hours: float
    total_places: int
    total_travel_time_minutes: int
    estimated_total_cost: float
    total_cost_estimate: Optional[TotalCostEstimate] = None
    summary: str
    stops: List[ItineraryStop] = []
    timeline: Optional[List[ItineraryStop]] = []
