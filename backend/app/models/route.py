"""Pydantic Models for Routing, Transport Intelligence, and Fares."""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.place import Coordinates


class TransportModeEnum(str, Enum):
    """Supported transportation modes."""

    WALK = "WALK"
    DRIVE = "DRIVE"
    TRANSIT = "TRANSIT"
    BICYCLE = "BICYCLE"


class FareStatusEnum(str, Enum):
    """Reliability classification for fare data."""

    PROVIDER_CONFIRMED = "provider_confirmed"
    ESTIMATED = "estimated"
    UNAVAILABLE = "unavailable"


class LocationInfo(BaseModel):
    """Resolved location point details."""

    name: str = Field(..., description="Location or destination name")
    place_id: Optional[str] = Field(None, description="Canonical place identifier if resolved")
    latitude: float = Field(..., description="Latitude in decimal degrees")
    longitude: float = Field(..., description="Longitude in decimal degrees")


class TransitStepDetails(BaseModel):
    """Detailed transit sub-step information."""

    line: Optional[str] = Field(None, description="Transit line or route name/number")
    vehicle_type: Optional[str] = Field(None, description="Vehicle category (e.g. 'SUBWAY', 'BUS', 'TRAIN')")
    departure_stop: Optional[str] = Field(None, description="Boarding station/stop name")
    arrival_stop: Optional[str] = Field(None, description="Alighting station/stop name")
    num_stops: Optional[int] = Field(None, description="Number of intermediate stops")
    headsign: Optional[str] = Field(None, description="Direction or terminus headsign")


class RouteOption(BaseModel):
    """Normalized route travel option for a specific transport mode."""

    mode: str = Field(..., description="Transport mode ('WALK', 'DRIVE', 'TRANSIT', 'BICYCLE')")
    duration_minutes: float = Field(..., description="Estimated travel duration in minutes")
    distance_km: float = Field(..., description="Route travel distance in kilometers")
    estimated_fare: Optional[float] = Field(None, description="Estimated fare in specified currency, or null if unavailable")
    fare_currency: str = Field(default="INR", description="Currency ISO code")
    fare_status: str = Field(
        default=FareStatusEnum.UNAVAILABLE.value,
        description="Fare status: 'provider_confirmed', 'estimated', or 'unavailable'",
    )
    fare_note: Optional[str] = Field(None, description="Explanatory note on how the fare was derived")
    provider: str = Field(default="google", description="Underlying route data provider (e.g., 'google', 'geodesic_fallback')")
    transit_details: Optional[List[TransitStepDetails]] = Field(None, description="Transit step breakdown if applicable")
    summary: Optional[str] = Field(None, description="Route summary/via road name")


class RouteResponse(BaseModel):
    """Overall response for travel options between origin and destination."""

    origin: LocationInfo = Field(..., description="Resolved origin point")
    destination: LocationInfo = Field(..., description="Resolved destination point")
    options: List[RouteOption] = Field(default_factory=list, description="Available transport mode options")
