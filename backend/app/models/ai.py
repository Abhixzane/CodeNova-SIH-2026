"""Pydantic Models for AI Tourism Assistant Chat."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AISuggestedPlace(BaseModel):
    """Place reference recommended within AI response."""

    id: str = Field(..., description="Canonical place identifier")
    name: str = Field(..., description="Destination display name")
    category: Optional[str] = Field(None, description="Category of the place")
    city: Optional[str] = Field(None, description="City of the place")


class AIChatRequest(BaseModel):
    """User prompt and context for conversational AI assistance."""

    message: str = Field(..., min_length=1, description="User question or guidance request")
    conversation_id: Optional[str] = Field(None, description="Client conversation session identifier")
    place_id: Optional[str] = Field(None, description="Selected destination context if any")
    city: Optional[str] = Field(None, description="City scope (e.g. 'Mumbai')")
    context: Optional[Dict[str, Any]] = Field(None, description="Optional extra client context (budget, interests, origin)")


class AIChatResponse(BaseModel):
    """Structured response from the AI Tourism Assistant."""

    conversation_id: str = Field(..., description="Active conversation session identifier")
    reply: str = Field(..., description="Conversational guidance, itinerary, or tourism answer")
    suggested_places: List[AISuggestedPlace] = Field(
        default_factory=list,
        description="Structured list of places referenced in the recommendation",
    )
    sources: List[str] = Field(
        default_factory=list,
        description="Data sources or verified knowledge repositories used for grounding",
    )
