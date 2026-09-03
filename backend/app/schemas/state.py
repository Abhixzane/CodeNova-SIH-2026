from pydantic import BaseModel
from typing import Optional, Dict


class Coordinates(BaseModel):
    lat: float
    lng: float


class StateBase(BaseModel):
    id: str
    name: str
    capital: str
    region: str
    total_places: int = 0
    thumbnail_url: Optional[str] = None
    coordinates: Optional[Coordinates] = None


class StateResponse(StateBase):
    pass
