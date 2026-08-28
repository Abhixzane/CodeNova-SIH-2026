"""Pydantic Models for State Resources."""

from typing import Optional
from pydantic import BaseModel, Field


class State(BaseModel):
    """State or Union Territory schema."""

    id: str = Field(..., description="Unique slug or identifier (e.g., 'rajasthan', 'kerala')")
    name: str = Field(..., description="Full display name of the state or union territory")
    capital: Optional[str] = Field(None, description="Capital city of the state")
    region: Optional[str] = Field(None, description="Geographic region (e.g., 'North India', 'South India')")
    total_places: int = Field(default=0, description="Count of registered tourist destinations")
    thumbnail_url: Optional[str] = Field(None, description="URL to featured image or banner")
