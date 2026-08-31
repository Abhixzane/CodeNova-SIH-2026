"""States & Union Territories Router.

Provides endpoints for exploring Indian states, their capitals, regions, and basic metadata.
"""

from typing import List
from fastapi import APIRouter
from app.models.state import State
from app.services.place_service import place_service

router = APIRouter(
    prefix="/states",
    tags=["States"],
)


@router.get(
    "",
    response_model=List[State],
    summary="Get all states and union territories",
    description="Retrieve a list of all supported Indian states with high-level metadata.",
)
async def get_states() -> List[State]:
    """Return list of all registered states."""
    return place_service.get_states()
