"""Day-Trip Itinerary Planning Service."""

import math
from typing import List, Optional
from app.models.itinerary import ItineraryRequest, ItineraryResponse, ItineraryStop
from app.models.place import PlaceDetail
from app.services.nearby_service import haversine_distance_km
from app.services.place_service import place_service
from app.services.recommendation_service import recommendation_service


class ItineraryService:
    """Generates feasible, time-budgeted sequential day-trip itineraries."""

    def __init__(
        self,
        p_service=place_service,
        rec_service=recommendation_service,
    ) -> None:
        self.place_service = p_service
        self.recommendation_service = rec_service

    def generate_itinerary(self, request: ItineraryRequest) -> ItineraryResponse:
        """Generate a sequential itinerary matching available hours and interests."""
        total_available_minutes = int(request.duration_hours * 60)
        city = request.city or "Mumbai"

        # 1. Resolve starting place if provided, otherwise default to top heritage landmark (e.g. Gateway of India)
        start_place: Optional[PlaceDetail] = None
        if request.origin:
            loc = self.place_service.resolve_location(request.origin)
            if loc and loc.place_id:
                start_place = self.place_service.get_place(loc.place_id)

        if not start_place:
            # Pick primary hub in city (e.g. gateway-of-india or csmt in Mumbai)
            city_places = [p for p in self.place_service.get_all_places() if p.city.lower() == city.lower()]
            start_place = city_places[0] if city_places else None

        if not start_place:
            return ItineraryResponse(
                city=city,
                duration_hours=request.duration_hours,
                total_places=0,
                estimated_total_visiting_minutes=0,
                estimated_total_travel_minutes=0,
                stops=[],
                summary=f"No curated destinations found for city: {city}",
            )

        # 2. Get top matching candidate places in the city
        candidates = self.recommendation_service.recommend(
            city=city,
            interests=request.interests,
            exclude_place_id=start_place.id,
            limit=10,
        )

        candidate_details: List[PlaceDetail] = []
        for cand in candidates:
            p = self.place_service.get_place(cand.id)
            if p:
                candidate_details.append(p)

        # 3. Build sequence starting from origin
        selected_sequence: List[PlaceDetail] = [start_place]
        remaining = list(candidate_details)

        current_place = start_place
        accumulated_minutes = self._parse_visiting_duration_minutes(start_place)

        while remaining and accumulated_minutes < total_available_minutes:
            # Pick closest remaining candidate to minimize back-and-forth travel
            best_cand = None
            best_dist = float("inf")

            for cand in remaining:
                dist = haversine_distance_km(
                    current_place.coordinates.lat,
                    current_place.coordinates.lng,
                    cand.coordinates.lat,
                    cand.coordinates.lng,
                )
                if dist < best_dist:
                    best_dist = dist
                    best_cand = cand

            if not best_cand:
                break

            # Estimate travel time (~25 km/h urban speed + 5 min buffer)
            travel_minutes = max(10, int((best_dist * 1.3 / 25.0) * 60 + 5))
            visit_minutes = self._parse_visiting_duration_minutes(best_cand)

            if accumulated_minutes + travel_minutes + visit_minutes > total_available_minutes:
                # If adding this stop exceeds budget, stop
                break

            selected_sequence.append(best_cand)
            accumulated_minutes += travel_minutes + visit_minutes
            current_place = best_cand
            remaining.remove(best_cand)

        # 4. Construct response stops
        stops: List[ItineraryStop] = []
        total_visit_min = 0
        total_travel_min = 0

        for i, place in enumerate(selected_sequence):
            visit_min = self._parse_visiting_duration_minutes(place)
            total_visit_min += visit_min

            travel_min = None
            travel_mode = None

            if i > 0:
                prev = selected_sequence[i - 1]
                dist = haversine_distance_km(
                    prev.coordinates.lat, prev.coordinates.lng,
                    place.coordinates.lat, place.coordinates.lng,
                )
                travel_min = max(10, int((dist * 1.3 / 25.0) * 60 + 5))
                total_travel_min += travel_min
                travel_mode = "WALK" if dist < 1.2 else "DRIVE / CAB"

            highlights = place.tags[:3] if place.tags else [place.category]

            stops.append(
                ItineraryStop(
                    order=i + 1,
                    place_id=place.id,
                    name=place.name,
                    category=place.category,
                    city=place.city,
                    recommended_duration_minutes=visit_min,
                    travel_time_from_previous_minutes=travel_min,
                    travel_mode_from_previous=travel_mode,
                    highlights=highlights,
                )
            )

        summary = (
            f"Curated {request.duration_hours:.0f}-hour {city} day-tour featuring {len(stops)} destinations: "
            f"{', '.join([s.name for s in stops])}. Estimated visiting time is {total_visit_min // 60}h {total_visit_min % 60}m "
            f"with {total_travel_min}m total transit."
        )

        return ItineraryResponse(
            city=city,
            duration_hours=request.duration_hours,
            total_places=len(stops),
            estimated_total_visiting_minutes=total_visit_min,
            estimated_total_travel_minutes=total_travel_min,
            stops=stops,
            summary=summary,
        )

    def _parse_visiting_duration_minutes(self, place: PlaceDetail) -> int:
        """Helper to get realistic visiting minutes for a place."""
        if place.visiting_info and place.visiting_info.recommended_duration:
            rec = place.visiting_info.recommended_duration.lower()
            if "1 - 2" in rec or "1-2" in rec:
                return 90
            elif "2 - 3" in rec or "2-3" in rec:
                return 120
            elif "3" in rec:
                return 180
            elif "4" in rec:
                return 240
            elif "1" in rec:
                return 60
        return 60


# Global singleton instance
itinerary_service = ItineraryService()
