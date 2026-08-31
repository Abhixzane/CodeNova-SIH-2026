"""Day-Trip Itinerary Planning Router.

Generates feasible, time-budgeted sequential tour itineraries
matching user interests and available hours.
"""

from fastapi import APIRouter
from app.models.itinerary import ItineraryRequest, ItineraryResponse
from app.services.itinerary_service import itinerary_service

router = APIRouter(
    prefix="/itinerary",
    tags=["Itinerary Planning"],
)


@router.post(
    "",
    response_model=ItineraryResponse,
    summary="Generate a day-trip tour itinerary",
    description="Build an ordered sequence of attractions with estimated visiting times and travel durations.",
)
async def generate_tour_itinerary(request: ItineraryRequest) -> ItineraryResponse:
    """Generate a time-budgeted day-trip tour plan."""
    return itinerary_service.generate_itinerary(request)
