"""States & Union Territories Router.

Provides endpoints for exploring Indian states, their capitals, regions, and basic metadata.
"""

from typing import List
from fastapi import APIRouter
from app.models.state import State

router = APIRouter(
    prefix="/states",
    tags=["States"],
)

# Minimal sample dataset placeholder (domain team will connect database / datasets later)
SAMPLE_STATES: List[State] = [
    State(
        id="rajasthan",
        name="Rajasthan",
        capital="Jaipur",
        region="North India",
        total_places=1,
        thumbnail_url="https://images.unsplash.com/photo-1599661046289-e31897846e41",
    ),
    State(
        id="kerala",
        name="Kerala",
        capital="Thiruvananthapuram",
        region="South India",
        total_places=1,
        thumbnail_url="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
    ),
    State(
        id="himachal-pradesh",
        name="Himachal Pradesh",
        capital="Shimla",
        region="North India",
        total_places=1,
        thumbnail_url="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23",
    ),
]


@router.get(
    "",
    response_model=List[State],
    summary="Get all states and union territories",
    description="Retrieve a list of all supported Indian states with high-level metadata.",
)
async def get_states() -> List[State]:
    """Return list of all states."""
    return SAMPLE_STATES
