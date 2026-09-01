from typing import List, Optional
from pydantic import BaseModel, Field

class RailwayStation(BaseModel):
    id: str
    name: str
    code: str
    city: str
    state: str
    lat: float
    lng: float
    lines: List[str] = Field(default_factory=list)
    is_junction: bool = False
    distance_km: Optional[float] = None
    walking_time_mins: Optional[int] = None
    road_time_mins: Optional[int] = None
    transfer_modes: List[str] = Field(default_factory=lambda: ["Taxi", "Local Bus", "Walk"])
