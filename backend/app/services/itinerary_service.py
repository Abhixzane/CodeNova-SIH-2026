from typing import Dict, Any, List
from .tourism_service import tourism_service


class ItineraryService:
    def generate_day_circuit(
        self,
        city: str = "Mumbai",
        duration_hours: float = 8.0,
        interests: List[str] = None,
        budget_level: str = "moderate",
    ) -> Dict[str, Any]:
        places_res = tourism_service.get_places(city=city, limit=10)
        places = places_res.get("data", [])
        if not places:
            places_res = tourism_service.get_places(limit=6)
            places = places_res.get("data", [])

        num_stops = min(len(places), max(2, int(duration_hours // 2.0)))
        selected_places = places[:num_stops]

        stops = []
        current_hour = 9.0  # Starts at 09:00 AM

        for idx, p in enumerate(selected_places):
            visit_mins = 60 if idx > 0 else 90
            travel_mins = 0 if idx == 0 else 20
            dist_km = 0.0 if idx == 0 else 3.2

            start_str = f"{int(current_hour):02d}:{int((current_hour % 1) * 60):02d} AM"
            current_hour += (visit_mins + travel_mins) / 60.0
            end_period = "AM" if current_hour < 12 else "PM"
            display_hour = int(current_hour) if current_hour <= 12 else int(current_hour) - 12
            end_str = f"{display_hour:02d}:{int((current_hour % 1) * 60):02d} {end_period}"

            stops.append({
                "order": idx + 1,
                "place_id": p.get("id"),
                "name": p.get("name"),
                "place_name": p.get("name"),
                "category": p.get("category", "heritage"),
                "start_time": start_str,
                "end_time": end_str,
                "recommended_duration_minutes": visit_mins,
                "visit_minutes": visit_mins,
                "travel_time_from_previous_minutes": travel_mins,
                "travel_mode_from_previous": "Walking" if dist_km < 1.5 else "Taxi / Metro",
                "distance_from_previous_km": dist_km,
                "tips": f"Ideal lighting and less crowded around {start_str}",
                "visit_tips": f"Wear comfortable shoes and respect photography guidelines.",
                "activity": f"Guided tour of {p.get('name')}",
            })

        total_cost = 450.0 if budget_level == "budget" else (950.0 if budget_level == "moderate" else 2400.0)

        return {
            "title": f"Signature {city} {int(duration_hours)}-Hour Heritage Tour",
            "city": city,
            "duration_hours": duration_hours,
            "total_places": len(stops),
            "total_travel_time_minutes": 20 * (len(stops) - 1),
            "estimated_total_cost": total_cost,
            "total_cost_estimate": {
                "budget": 450.0,
                "moderate": 950.0,
                "luxury": 2400.0,
            },
            "summary": f"Curated high-efficiency route across {len(stops)} iconic destinations in {city}.",
            "stops": stops,
            "timeline": stops,
        }


itinerary_service = ItineraryService()
