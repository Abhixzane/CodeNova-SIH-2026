import time
from typing import List, Dict
from app.models.trip import TripItem, TripCreateRequest, TripStopItem

class TripsService:
    def __init__(self):
        self._trips: Dict[str, TripItem] = {}
        # Starter demo trip
        self._trips["trip-mumbai-classic"] = TripItem(
            id="trip-mumbai-classic",
            title="Mumbai Heritage Walk",
            city="Mumbai",
            duration_hours=6.0,
            total_places=3,
            estimated_cost=80.0,
            stops=[
                TripStopItem(order=1, place_id="gateway-of-india", place_name="Gateway of India", visit_minutes=90),
                TripStopItem(order=2, place_id="csmvs-museum", place_name="CSMVS Museum", visit_minutes=120, travel_minutes=10),
                TripStopItem(order=3, place_id="marine-drive", place_name="Marine Drive", visit_minutes=120, travel_minutes=12),
            ],
            created_at="2026-09-01",
        )

    def get_trips(self) -> List[TripItem]:
        return list(self._trips.values())

    def create_trip(self, req: TripCreateRequest) -> TripItem:
        trip_id = f"trip-{int(time.time())}"
        trip = TripItem(
            id=trip_id,
            title=req.title,
            city=req.city,
            duration_hours=req.duration_hours,
            total_places=len(req.stops),
            estimated_cost=req.estimated_cost,
            stops=req.stops,
            created_at="2026-09-01",
        )
        self._trips[trip_id] = trip
        return trip

    def delete_trip(self, trip_id: str) -> bool:
        if trip_id in self._trips:
            del self._trips[trip_id]
            return True
        return False

trips_service = TripsService()
