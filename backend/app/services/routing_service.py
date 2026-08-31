"""Travel Intelligence and Routing Service.

Integrates with Google Maps Directions API to fetch, parse, and normalize
multi-modal routes (Walking, Driving, Transit, Bicycling), durations, distances,
transit steps, and reliable fare classifications.
"""

import logging
from typing import Any, Dict, List, Optional
import httpx

from app.config import settings
from app.models.route import (
    FareStatusEnum,
    LocationInfo,
    RouteOption,
    RouteResponse,
    TransitStepDetails,
    TransportModeEnum,
)
from app.services.nearby_service import haversine_distance_km
from app.services.place_service import place_service

logger = logging.getLogger(__name__)


class RoutingService:
    """Service for computing travel intelligence across multiple transportation modes."""

    DIRECTIONS_API_URL = "https://maps.googleapis.com/maps/api/directions/json"

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or settings.GOOGLE_MAPS_API_KEY

    async def get_routes(
        self,
        origin: LocationInfo,
        destination: LocationInfo,
        requested_mode: Optional[str] = None,
    ) -> RouteResponse:
        """Fetch and normalize routes for all supported transport modes between origin and destination."""
        options: List[RouteOption] = []

        modes_to_fetch = [requested_mode] if requested_mode else ["DRIVE", "TRANSIT", "WALK", "BICYCLE"]

        if self.api_key:
            # Query Google Maps Directions API for each requested mode
            async with httpx.AsyncClient(timeout=10.0) as client:
                for mode in modes_to_fetch:
                    try:
                        option = await self._fetch_google_route(client, origin, destination, mode)
                        if option:
                            options.append(option)
                    except Exception as e:
                        logger.warning(f"Failed to fetch Google route for mode {mode}: {e}")

        # If no external provider options succeeded (e.g. no API key or network failure), use fallback
        if not options:
            for mode in modes_to_fetch:
                options.append(self._generate_fallback_route(origin, destination, mode))

        return RouteResponse(
            origin=origin,
            destination=destination,
            options=options,
        )

    async def _fetch_google_route(
        self,
        client: httpx.AsyncClient,
        origin: LocationInfo,
        destination: LocationInfo,
        mode: str,
    ) -> Optional[RouteOption]:
        """Query Google Maps Directions API for a single travel mode and normalize the response."""
        google_mode_map = {
            "DRIVE": "driving",
            "TRANSIT": "transit",
            "WALK": "walking",
            "BICYCLE": "bicycling",
        }
        g_mode = google_mode_map.get(mode.upper(), "driving")

        params = {
            "origin": f"{origin.latitude},{origin.longitude}",
            "destination": f"{destination.latitude},{destination.longitude}",
            "mode": g_mode,
            "key": self.api_key,
        }

        resp = await client.get(self.DIRECTIONS_API_URL, params=params)
        if resp.status_code != 200:
            logger.warning(f"Google Maps API HTTP error {resp.status_code}: {resp.text}")
            return None

        data = resp.json()
        status = data.get("status")
        if status != "OK":
            logger.info(f"Google Maps returned status '{status}' for mode {mode}")
            return None

        routes = data.get("routes", [])
        if not routes:
            return None

        primary_route = routes[0]
        legs = primary_route.get("legs", [])
        if not legs:
            return None

        leg = legs[0]
        duration_sec = leg.get("duration", {}).get("value", 0)
        distance_m = leg.get("distance", {}).get("value", 0)

        duration_min = round(duration_sec / 60.0, 1)
        distance_km = round(distance_m / 1000.0, 2)
        summary = primary_route.get("summary") or leg.get("summary")

        # Parse Transit Details if available
        transit_details_list: Optional[List[TransitStepDetails]] = None
        if g_mode == "transit":
            steps = leg.get("steps", [])
            transit_steps = []
            for step in steps:
                if step.get("travel_mode") == "TRANSIT":
                    td = step.get("transit_details", {})
                    line_info = td.get("line", {})
                    transit_steps.append(
                        TransitStepDetails(
                            line=line_info.get("short_name") or line_info.get("name"),
                            vehicle_type=line_info.get("vehicle", {}).get("type"),
                            departure_stop=td.get("departure_stop", {}).get("name"),
                            arrival_stop=td.get("arrival_stop", {}).get("name"),
                            num_stops=td.get("num_stops"),
                            headsign=td.get("headsign"),
                        )
                    )
            if transit_steps:
                transit_details_list = transit_steps

        # Determine fare info
        fare_val: Optional[float] = None
        fare_currency = "INR"
        fare_status = FareStatusEnum.UNAVAILABLE.value
        fare_note: Optional[str] = None

        if "fare" in primary_route:
            fare_obj = primary_route["fare"]
            fare_val = float(fare_obj.get("value", 0))
            fare_currency = fare_obj.get("currency", "INR")
            fare_status = FareStatusEnum.PROVIDER_CONFIRMED.value
            fare_note = "Official transit fare confirmed by provider"
        elif g_mode == "walking" or g_mode == "bicycling":
            fare_val = 0.0
            fare_status = FareStatusEnum.PROVIDER_CONFIRMED.value
            fare_note = "Zero fare for pedestrian/cycling travel"
        elif g_mode == "driving":
            # Distance-based taxi fare estimate for Mumbai pilot
            base_fare = 28.0  # Mumbai non-AC minimum fare (first 1.5 km)
            per_km_rate = 18.66
            if distance_km <= 1.5:
                fare_val = round(base_fare, 0)
            else:
                fare_val = round(base_fare + (distance_km - 1.5) * per_km_rate, 0)
            fare_status = FareStatusEnum.ESTIMATED.value
            fare_note = "Estimated local metered taxi fare based on road distance"

        return RouteOption(
            mode=mode.upper(),
            duration_minutes=duration_min,
            distance_km=distance_km,
            estimated_fare=fare_val,
            fare_currency=fare_currency,
            fare_status=fare_status,
            fare_note=fare_note,
            provider="google",
            transit_details=transit_details_list,
            summary=summary,
        )

    def _generate_fallback_route(
        self,
        origin: LocationInfo,
        destination: LocationInfo,
        mode: str,
    ) -> RouteOption:
        """Generate safe, deterministic geodesic distance-based route estimates when provider is offline."""
        dist_straight = haversine_distance_km(
            origin.latitude, origin.longitude, destination.latitude, destination.longitude
        )

        mode_upper = mode.upper()
        # Urban road winding factor (~1.3x straight-line distance)
        road_distance_km = round(dist_straight * 1.3, 2)

        if mode_upper == "WALK":
            # Speed ~4.5 km/h
            duration_min = round((road_distance_km / 4.5) * 60, 1)
            return RouteOption(
                mode="WALK",
                duration_minutes=duration_min,
                distance_km=road_distance_km,
                estimated_fare=0.0,
                fare_currency="INR",
                fare_status=FareStatusEnum.PROVIDER_CONFIRMED.value,
                fare_note="Zero fare for walking",
                provider="geodesic_fallback",
                summary="Pedestrian route",
            )
        elif mode_upper == "BICYCLE":
            # Speed ~12 km/h
            duration_min = round((road_distance_km / 12.0) * 60, 1)
            return RouteOption(
                mode="BICYCLE",
                duration_minutes=duration_min,
                distance_km=road_distance_km,
                estimated_fare=0.0,
                fare_currency="INR",
                fare_status=FareStatusEnum.PROVIDER_CONFIRMED.value,
                fare_note="Zero fare for bicycling",
                provider="geodesic_fallback",
                summary="Cycling route",
            )
        elif mode_upper == "TRANSIT":
            # Speed ~18 km/h + 8 min wait/transfer
            duration_min = round((road_distance_km / 18.0) * 60 + 8.0, 1)
            return RouteOption(
                mode="TRANSIT",
                duration_minutes=duration_min,
                distance_km=road_distance_km,
                estimated_fare=None,
                fare_currency="INR",
                fare_status=FareStatusEnum.UNAVAILABLE.value,
                fare_note="Live transit schedule and fare unavailable in offline mode",
                provider="geodesic_fallback",
                summary="Public transit route",
            )
        else:  # DRIVE
            # Speed ~22 km/h in urban Mumbai traffic
            duration_min = round((road_distance_km / 22.0) * 60, 1)
            base_fare = 28.0
            per_km_rate = 18.66
            if road_distance_km <= 1.5:
                est_fare = round(base_fare, 0)
            else:
                est_fare = round(base_fare + (road_distance_km - 1.5) * per_km_rate, 0)

            return RouteOption(
                mode="DRIVE",
                duration_minutes=duration_min,
                distance_km=road_distance_km,
                estimated_fare=est_fare,
                fare_currency="INR",
                fare_status=FareStatusEnum.ESTIMATED.value,
                fare_note="Estimated metered cab fare based on calculated road distance",
                provider="geodesic_fallback",
                summary="Road route",
            )


# Global singleton instance
routing_service = RoutingService()
