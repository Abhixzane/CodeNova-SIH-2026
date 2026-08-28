"""Pydantic Models for Tourist Places and Destinations."""

from typing import List, Optional
from pydantic import BaseModel, Field


class Coordinates(BaseModel):
    """Geographical coordinate schema."""

    lat: float = Field(..., description="Latitude in decimal degrees")
    lng: float = Field(..., description="Longitude in decimal degrees")


class EntryFee(BaseModel):
    """Entry fee structure schema."""

    domestic: Optional[float] = Field(None, description="Fee for domestic visitors")
    international: Optional[float] = Field(None, description="Fee for international visitors")
    currency: str = Field(default="INR", description="Currency ISO code")


class Model3DInfo(BaseModel):
    """3D Model metadata schema for virtual navigation."""

    has_model: bool = Field(default=False, description="Flag indicating if a 3D asset is available")
    model_url: Optional[str] = Field(None, description="URL or relative path to the 3D model asset (.glb/.gltf)")


class PlaceSummary(BaseModel):
    """Summary schema for list representations of tourist destinations."""

    id: str = Field(..., description="Unique slug or identifier (e.g., 'hawa-mahal')")
    name: str = Field(..., description="Name of the place or landmark")
    state: str = Field(..., description="State where the place is located")
    city: str = Field(..., description="City or district")
    category: str = Field(..., description="Category (e.g., 'heritage', 'nature', 'spiritual', 'adventure')")
    summary: Optional[str] = Field(None, description="Short summary or teaser")
    coordinates: Coordinates = Field(..., description="Geographical coordinates")
    rating: Optional[float] = Field(None, ge=0.0, le=5.0, description="Average visitor rating (0.0 to 5.0)")
    thumbnail_url: Optional[str] = Field(None, description="URL of the thumbnail image")


class PlaceDetail(PlaceSummary):
    """Full detail schema for a single tourist destination."""

    description: Optional[str] = Field(None, description="Full detailed description and history")
    best_time_to_visit: Optional[str] = Field(None, description="Ideal season or months to visit")
    visiting_hours: Optional[str] = Field(None, description="Operating hours")
    entry_fee: Optional[EntryFee] = Field(None, description="Entry fee details")
    images: List[str] = Field(default_factory=list, description="List of image URLs")
    model_3d: Optional[Model3DInfo] = Field(None, description="3D model asset references")
    tags: List[str] = Field(default_factory=list, description="Search and classification tags")


class PlaceListResponse(BaseModel):
    """Paginated list response wrapper for places."""

    total: int = Field(..., description="Total number of matching places")
    limit: int = Field(..., description="Pagination limit")
    offset: int = Field(..., description="Pagination offset")
    data: List[PlaceSummary] = Field(..., description="List of place summaries")
