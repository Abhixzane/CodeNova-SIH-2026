"""Pydantic Models for Tourist Places and Destinations.

Canonical Place Schema supporting rich tourism metadata, coordinates,
feature flags, 3D metadata, visiting guidance, history, and cultural significance.
"""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator


class Coordinates(BaseModel):
    """Geographical coordinate schema with latitude and longitude."""

    model_config = ConfigDict(populate_by_name=True)

    lat: float = Field(..., alias="latitude", description="Latitude in decimal degrees")
    lng: float = Field(..., alias="longitude", description="Longitude in decimal degrees")

    @property
    def latitude(self) -> float:
        """Helper property for latitude."""
        return self.lat

    @property
    def longitude(self) -> float:
        """Helper property for longitude."""
        return self.lng


class EntryFee(BaseModel):
    """Entry fee structure schema."""

    domestic: Optional[float] = Field(None, description="Fee for domestic visitors in INR")
    international: Optional[float] = Field(None, description="Fee for international visitors in INR")
    currency: str = Field(default="INR", description="Currency ISO code")


class Model3DInfo(BaseModel):
    """3D Model metadata schema for immersive virtual navigation."""

    model_config = ConfigDict(populate_by_name=True)

    has_model: bool = Field(default=False, description="Flag indicating if a 3D asset is available")
    model_url: Optional[str] = Field(None, description="URL or relative path to 3D model (.glb/.gltf)")
    available: bool = Field(default=False, description="Alias indicating 3D model availability")
    type: Optional[str] = Field(None, description="Model type e.g., 'photogrammetry', 'approximate', 'detailed'")
    asset: Optional[str] = Field(None, description="Direct asset reference / path to 3D file")

    @model_validator(mode="after")
    def sync_availability(self) -> "Model3DInfo":
        """Synchronize has_model/model_url with available/asset for seamless compatibility."""
        if self.has_model or self.available:
            self.has_model = True
            self.available = True
        if self.model_url and not self.asset:
            self.asset = self.model_url
        elif self.asset and not self.model_url:
            self.model_url = self.asset
        return self


class Features(BaseModel):
    """Destination feature capabilities matrix."""

    model_config = ConfigDict(populate_by_name=True)

    map: bool = Field(default=True, description="Geospatial map exploration enabled")
    navigation: bool = Field(default=True, description="Google Maps navigation handoff enabled")
    ai: bool = Field(default=True, description="AI Tourism Assistant context enabled")
    threed: bool = Field(default=False, alias="3d", description="3D monument visual exploration enabled")


class VisitingInfo(BaseModel):
    """Curated visiting and travel guidelines."""

    best_time_to_visit: Optional[str] = Field(None, description="Ideal season or months to visit")
    visiting_hours: Optional[str] = Field(None, description="Operating/visiting hours")
    recommended_duration: Optional[str] = Field(None, description="Recommended time to spend (e.g. '2 hours')")
    tips: List[str] = Field(default_factory=list, description="Curated travel and visiting tips")


class PlaceSummary(BaseModel):
    """Summary schema for list representations of tourist destinations."""

    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(..., description="Unique canonical identifier (e.g., 'marine-drive', 'gateway-of-india')")
    name: str = Field(..., description="Full display name of the place or landmark")
    state: str = Field(..., description="State where the place is located (e.g., 'Maharashtra')")
    city: str = Field(..., description="City or district (e.g., 'Mumbai')")
    country: str = Field(default="India", description="Country name")
    category: str = Field(..., description="Category (e.g., 'heritage', 'nature', 'coastal', 'cultural')")
    summary: Optional[str] = Field(None, description="Short summary or teaser")
    coordinates: Coordinates = Field(..., description="Geographical coordinates")
    rating: Optional[float] = Field(None, ge=0.0, le=5.0, description="Average visitor rating (0.0 to 5.0)")
    thumbnail_url: Optional[str] = Field(None, description="URL of the thumbnail image")
    tags: List[str] = Field(default_factory=list, description="Search and classification tags")
    features: Optional[Features] = Field(default_factory=Features, description="Feature availability flags")


class PlaceDetail(PlaceSummary):
    """Full detail schema for a single tourist destination."""

    description: Optional[str] = Field(None, description="Full detailed description and tourism overview")
    history: Optional[str] = Field(None, description="Historical significance and background")
    culture: Optional[str] = Field(None, description="Cultural traditions and local heritage")
    best_time_to_visit: Optional[str] = Field(None, description="Ideal season or months to visit")
    visiting_hours: Optional[str] = Field(None, description="Operating hours")
    entry_fee: Optional[EntryFee] = Field(None, description="Entry fee details")
    visiting_info: Optional[VisitingInfo] = Field(None, description="Detailed visiting guidelines")
    images: List[str] = Field(default_factory=list, description="List of verified image URLs")
    model_3d: Optional[Model3DInfo] = Field(default_factory=Model3DInfo, description="3D model asset references")

    @model_validator(mode="after")
    def sync_visiting_fields(self) -> "PlaceDetail":
        """Synchronize top-level visiting fields with visiting_info for backward compatibility."""
        if self.visiting_info:
            if not self.best_time_to_visit and self.visiting_info.best_time_to_visit:
                self.best_time_to_visit = self.visiting_info.best_time_to_visit
            if not self.visiting_hours and self.visiting_info.visiting_hours:
                self.visiting_hours = self.visiting_info.visiting_hours
        elif self.best_time_to_visit or self.visiting_hours:
            self.visiting_info = VisitingInfo(
                best_time_to_visit=self.best_time_to_visit,
                visiting_hours=self.visiting_hours,
            )
        # Synchronize features 3D flag with model_3d
        if self.model_3d and (self.model_3d.has_model or self.model_3d.available):
            if not self.features:
                self.features = Features()
            self.features.threed = True
        return self


class PlaceListResponse(BaseModel):
    """Paginated list response wrapper for places."""

    total: int = Field(..., description="Total number of matching places")
    limit: int = Field(..., description="Pagination limit")
    offset: int = Field(..., description="Pagination offset")
    data: List[PlaceSummary] = Field(..., description="List of place summaries")
