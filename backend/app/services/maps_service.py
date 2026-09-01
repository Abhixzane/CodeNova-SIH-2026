"""Google Maps Navigation Handoff and URL Generator Service."""

import urllib.parse
from typing import Dict, Optional
from app.models.route import LocationInfo


class MapsService:
    """Generates official Google Maps Universal URLs for seamless client navigation handoff."""

    MODE_MAPPING: Dict[str, str] = {
        "WALK": "walking",
        "DRIVE": "driving",
        "TRANSIT": "transit",
        "BICYCLE": "bicycling",
        "walking": "walking",
        "driving": "driving",
        "transit": "transit",
        "bicycling": "bicycling",
    }

    def generate_directions_url(
        self,
        origin: LocationInfo,
        destination: LocationInfo,
        travel_mode: str = "driving",
    ) -> str:
        """Generate official cross-platform Google Maps directions URL without exposing API keys."""
        origin_str = f"{origin.latitude:.6f},{origin.longitude:.6f}"
        dest_str = f"{destination.latitude:.6f},{destination.longitude:.6f}"

        mode = self.MODE_MAPPING.get(travel_mode, "driving")

        params = {
            "api": "1",
            "origin": origin_str,
            "destination": dest_str,
            "travelmode": mode,
        }

        # If canonical names exist, append for clearer destination pin on Google Maps
        if destination.name and destination.name != dest_str:
            params["destination"] = f"{destination.name}, {destination.latitude:.6f},{destination.longitude:.6f}"
        if origin.name and origin.name != origin_str:
            params["origin"] = f"{origin.name}, {origin.latitude:.6f},{origin.longitude:.6f}"

        query_string = urllib.parse.urlencode(params)
        return f"https://www.google.com/maps/dir/?{query_string}"


# Global singleton instance
maps_service = MapsService()
