from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from .state import Coordinates


class EntryFee(BaseModel):
    domestic: float = 0.0
    international: float = 0.0
    currency: str = "INR"


class Model3DInfo(BaseModel):
    available: bool = False
    has_model: Optional[bool] = False
    type: Optional[str] = "custom-threejs"
    model_url: Optional[str] = None
    poly_count: Optional[str] = None


class VisitingInfo(BaseModel):
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    weekly_closed_day: Optional[str] = None
    ideal_duration_hours: Optional[float] = None
    photography_allowed: Optional[bool] = True
    guided_tours_available: Optional[bool] = False
    metro_station: Optional[str] = None
    railway_station: Optional[str] = None


class PlaceFeatures(BaseModel):
    map: bool = True
    navigation: bool = True
    ai: bool = True
    three_d: bool = False


class PlaceSummary(BaseModel):
    id: str
    name: str
    state: str
    city: str
    category: str
    summary: str
    coordinates: Coordinates
    rating: Optional[float] = 4.5
    reviews_count: Optional[str] = "1,200"
    thumbnail_url: Optional[str] = None
    tags: Optional[List[str]] = []
    features: Optional[Dict[str, bool]] = None
    visiting_hours: Optional[str] = None
    area_neighborhood: Optional[str] = None


class PlaceDetail(PlaceSummary):
    country: Optional[str] = "India"
    description: Optional[str] = None
    history: Optional[str] = None
    culture: Optional[str] = None
    architecture: Optional[str] = None
    images: Optional[List[str]] = []
    best_time_to_visit: Optional[str] = None
    visiting_info: Optional[VisitingInfo] = None
    model_3d: Optional[Model3DInfo] = None
    entry_fee: Optional[EntryFee] = None


class PlaceListResponse(BaseModel):
    total: int
    limit: int
    offset: int
    data: List[PlaceSummary]
