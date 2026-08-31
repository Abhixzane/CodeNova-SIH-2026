"""Pydantic Models for Nearby Proximity Queries."""

from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.place import Coordinates


class NearbyPlaceItem(BaseModel):
    """Destination item with computed straight-line proximity distance."""

    id: str = Field(..., description="Unique canonical place identifier")
    name: str = Field(..., description="Name of the place or landmark")
    category: str = Field(..., description="Tourism category (e.g. 'heritage', 'nature')")
    city: str = Field(..., description="City or district")
    state: str = Field(..., description="State name")
    coordinates: Coordinates = Field(..., description="Geographical coordinates")
    distance_km: float = Field(..., description="Haversine distance in kilometers")
    rating: Optional[float] = Field(None, description="Average visitor rating")
    thumbnail_url: Optional[str] = Field(None, description="Featured thumbnail image URL")


class NearbyPlacesResponse(BaseModel):
    """Response schema for nearby destinations query."""

    origin: Coordinates = Field(..., description="Origin search coordinates")
    radius_km: float = Field(..., description="Search radius applied in kilometers")
    count: int = Field(..., description="Number of nearby destinations found")
    results: List[NearbyPlaceItem] = Field(default_factory=list, description="List of nearby destinations sorted by proximity")
