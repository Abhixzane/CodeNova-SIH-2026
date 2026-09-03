from fastapi import APIRouter
from typing import Dict, Any, List
from ..schemas.itinerary import ItineraryRequest, ItineraryResponse
from ..services.itinerary_service import itinerary_service

router = APIRouter(prefix="/itinerary", tags=["Itinerary"])


@router.post("/plan", response_model=ItineraryResponse)
async def generate_itinerary(request: ItineraryRequest):
    """Generate time-optimized, topological day travel circuit."""
    return itinerary_service.generate_day_circuit(
        city=request.city,
        duration_hours=request.duration_hours,
        interests=request.interests,
        budget_level=request.budget_level or "moderate",
    )
