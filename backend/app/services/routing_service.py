from typing import Dict, Any, List
import math


class RoutingService:
    def calculate_multimodal_route(
        self,
        origin: str,
        destination: str,
        mode: str = "DRIVE",
        distance_km: float = 6.2,
    ) -> Dict[str, Any]:
        # Approximate durations based on Indian urban traffic
        drive_mins = max(10, int(distance_km * 3.5))
        transit_mins = max(15, int(distance_km * 2.8 + 10))
        walk_mins = int(distance_km * 14)
        auto_mins = max(10, int(distance_km * 3.8))

        # Fare calculation formulas (Standard Mumbai / Delhi benchmarks)
        taxi_fare = round(max(50.0, 28.0 + (distance_km - 1.5) * 18.5))
        auto_fare = round(max(30.0, 23.0 + (distance_km - 1.5) * 15.33))
        transit_fare = 15.0 if distance_km < 10 else 25.0

        options = [
            {
                "mode": "DRIVE",
                "duration_mins": drive_mins,
                "distance_km": round(distance_km, 1),
                "estimated_fare": taxi_fare,
                "fare_status": "metered",
                "fare_note": "Kaali-Peeli / App Cab non-peak estimate",
                "steps": [
                    f"Board cab from {origin}",
                    "Follow main arterial heritage corridor",
                    f"Arrive safely at {destination}",
                ],
            },
            {
                "mode": "TRANSIT",
                "duration_mins": transit_mins,
                "distance_km": round(distance_km * 1.1, 1),
                "estimated_fare": transit_fare,
                "fare_status": "fixed",
                "fare_note": "Suburban Railway / Metro token fare",
                "steps": [
                    f"Walk to nearest suburban station from {origin}",
                    "Take suburban local or metro towards destination hub",
                    f"Disembark and walk 300m to {destination}",
                ],
            },
            {
                "mode": "AUTO",
                "duration_mins": auto_mins,
                "distance_km": round(distance_km, 1),
                "estimated_fare": auto_fare,
                "fare_status": "metered",
                "fare_note": "CNG Auto-rickshaw regulated meter fare",
                "steps": [
                    f"Flag registered auto-rickshaw at {origin}",
                    "Ride through local lanes bypassing central highway choke points",
                    f"Drop off at entrance of {destination}",
                ],
            },
        ]

        if distance_km <= 3.0:
            options.append({
                "mode": "WALK",
                "duration_mins": walk_mins,
                "distance_km": round(distance_km, 1),
                "estimated_fare": 0.0,
                "fare_status": "free",
                "fare_note": "Eco-friendly heritage walking promenade",
                "steps": [
                    f"Head along scenic pedestrian promenade from {origin}",
                    f"Arrive at {destination}",
                ],
            })

        selected = next((o for o in options if o["mode"] == mode), options[0])

        return {
            "origin": origin,
            "destination": destination,
            "distance_km": selected["distance_km"],
            "duration_mins": selected["duration_mins"],
            "transport_mode": selected["mode"],
            "estimated_fare": selected["estimated_fare"] or 0.0,
            "fare_currency": "INR",
            "route_summary": f"Direct route via {selected['mode'].lower()} connecting {origin} and {destination}",
            "steps": [{"instruction": s, "mode": selected["mode"]} for s in selected.get("steps", [])],
            "options": options,
            "google_maps_url": f"https://www.google.com/maps/dir/?api=1&origin={origin}&destination={destination}&travelmode={mode.lower()}",
        }


routing_service = RoutingService()
