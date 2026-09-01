from typing import List
from fastapi import APIRouter
from app.models.trip import TripItem, TripCreateRequest
from app.services.trips_service import trips_service

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("", response_model=List[TripItem], summary="Get saved itineraries/trips")
async def list_trips():
    return trips_service.get_trips()

@router.post("", response_model=TripItem, summary="Save new trip itinerary")
async def create_trip(req: TripCreateRequest):
    return trips_service.create_trip(req)

@router.delete("/{trip_id}", summary="Delete saved trip")
async def delete_trip(trip_id: str):
    deleted = trips_service.delete_trip(trip_id)
    return {"status": "ok", "deleted": deleted}
