"""Pydantic Models for Day-Trip Itinerary Planning."""

from typing import List, Optional
from pydantic import BaseModel, Field


class ItineraryRequest(BaseModel):
    """Itinerary generation criteria request payload."""

    city: str = Field(default="Mumbai", description="City for the tour")
    origin: Optional[str] = Field(None, description="Starting place ID or landmark name (e.g., 'csmt')")
    duration_hours: float = Field(default=8.0, ge=1.0, le=24.0, description="Available tour duration in hours")
    interests: List[str] = Field(default_factory=list, description="Traveler interests (e.g. ['heritage', 'culture', 'coastal'])")
    pace: str = Field(default="moderate", description="Tour pace ('relaxed', 'moderate', 'fast')")


class ItineraryStop(BaseModel):
    """Single stop along the planned itinerary."""

    order: int = Field(..., description="1-indexed sequence order")
    place_id: str = Field(..., description="Canonical place identifier")
    name: str = Field(..., description="Destination display name")
    category: str = Field(..., description="Destination category")
    city: str = Field(..., description="City name")
    recommended_duration_minutes: int = Field(..., description="Recommended visiting time in minutes")
    travel_time_from_previous_minutes: Optional[int] = Field(None, description="Estimated travel time from preceding stop in minutes")
    travel_mode_from_previous: Optional[str] = Field(None, description="Suggested transport mode from preceding stop")
    highlights: List[str] = Field(default_factory=list, description="Key features or highlights at this stop")


class ItineraryResponse(BaseModel):
    """Generated sequential day-trip tour plan."""

    city: str = Field(..., description="Target city")
    duration_hours: float = Field(..., description="Allocated duration in hours")
    total_places: int = Field(..., description="Count of stops included in the tour")
    estimated_total_visiting_minutes: int = Field(..., description="Sum of recommended visiting durations")
    estimated_total_travel_minutes: int = Field(..., description="Sum of estimated transit/travel times")
    stops: List[ItineraryStop] = Field(default_factory=list, description="Ordered sequence of itinerary stops")
    summary: str = Field(..., description="Narrative summary and guidance for the tour")
