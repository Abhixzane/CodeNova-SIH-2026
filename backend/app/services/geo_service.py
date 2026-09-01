"""Geospatial Intelligence and Distance Computation Engine.

Provides high-accuracy Haversine, Vincenty geodetic calculations, tortuosity routing
approximations, and nearest transit hub spatial proximity discovery.
"""

import math
from typing import Any, Dict, List, Optional, Tuple


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Compute great-circle distance between two coordinates using the Haversine formula."""
    r_earth_km = 6371.0088
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r_earth_km * c, 2)


def vincenty_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Compute accurate geodetic distance on the WGS-84 ellipsoid using Vincenty inverse algorithm."""
    a_axis = 6378137.0
    f_flattening = 1 / 298.257223563
    b_axis = (1 - f_flattening) * a_axis

    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    u1 = math.atan((1 - f_flattening) * math.tan(phi1))
    u2 = math.atan((1 - f_flattening) * math.tan(phi2))
    lon_diff = math.radians(lon2 - lon1)

    lambda_val = lon_diff
    sin_u1, cos_u1 = math.sin(u1), math.cos(u1)
    sin_u2, cos_u2 = math.sin(u2), math.cos(u2)

    for _ in range(100):
        sin_lambda = math.sin(lambda_val)
        cos_lambda = math.cos(lambda_val)
        sin_sigma = math.sqrt(
            (cos_u2 * sin_lambda) ** 2
            + (cos_u1 * sin_u2 - sin_u1 * cos_u2 * cos_lambda) ** 2
        )
        if sin_sigma == 0:
            return 0.0

        cos_sigma = sin_u1 * sin_u2 + cos_u1 * cos_u2 * cos_lambda
        sigma = math.atan2(sin_sigma, cos_sigma)
        sin_alpha = (cos_u1 * cos_u2 * sin_lambda) / sin_sigma
        cos_sq_alpha = 1 - sin_alpha ** 2
        cos_2sigma_m = (
            cos_sigma - (2 * sin_u1 * sin_u2) / cos_sq_alpha
            if cos_sq_alpha != 0
            else 0.0
        )

        c_val = (f_flattening / 16) * cos_sq_alpha * (4 + f_flattening * (4 - 3 * cos_sq_alpha))
        lambda_prev = lambda_val
        lambda_val = lon_diff + (1 - c_val) * f_flattening * sin_alpha * (
            sigma
            + c_val
            * sin_sigma
            * (cos_2sigma_m + c_val * cos_sigma * (-1 + 2 * cos_2sigma_m ** 2))
        )
        if abs(lambda_val - lambda_prev) < 1e-12:
            break
    else:
        # Fallback to Haversine on non-convergence (antipodal points)
        return haversine_distance_km(lat1, lon1, lat2, lon2)

    u_sq = cos_sq_alpha * (a_axis ** 2 - b_axis ** 2) / (b_axis ** 2)
    a_coeff = 1 + (u_sq / 16384) * (4096 + u_sq * (-768 + u_sq * (320 - 175 * u_sq)))
    b_coeff = (u_sq / 1024) * (256 + u_sq * (-128 + u_sq * (74 - 47 * u_sq)))
    delta_sigma = (
        b_coeff
        * sin_sigma
        * (
            cos_2sigma_m
            + 0.25
            * b_coeff
            * (
                cos_sigma * (-1 + 2 * cos_2sigma_m ** 2)
                - (1 / 6)
                * b_coeff
                * cos_2sigma_m
                * (-3 + 4 * sin_sigma ** 2)
                * (-3 + 4 * cos_2sigma_m ** 2)
            )
        )
    )

    dist_meters = b_axis * a_coeff * (sigma - delta_sigma)
    return round(dist_meters / 1000.0, 2)


def estimate_road_distance_km(crow_distance_km: float, mode: str = "road") -> float:
    """Apply urban network tortuosity factor to simulate realistic street distances."""
    if crow_distance_km <= 0.1:
        return crow_distance_km
    factors = {
        "walk": 1.22,
        "bicycle": 1.25,
        "rail": 1.15,
        "metro": 1.18,
        "bus": 1.35,
        "auto": 1.30,
        "cab": 1.32,
        "road": 1.30,
    }
    factor = factors.get(mode.lower(), 1.30)
    return round(crow_distance_km * factor, 2)


def compute_bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Compute compass initial bearing between origin and destination in degrees (0-360)."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_lambda = math.radians(lon2 - lon1)

    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    initial_bearing = math.atan2(y, x)
    initial_bearing = math.degrees(initial_bearing)
    return round((initial_bearing + 360) % 360, 1)


def find_nearest_transit_hubs(
    latitude: float,
    longitude: float,
    transit_hubs: List[Dict[str, Any]],
    radius_km: float = 25.0,
    limit: int = 5,
) -> List[Dict[str, Any]]:
    """Discover and rank transit hubs within geospatial radius of target coordinates."""
    candidates = []
    for hub in transit_hubs:
        hub_lat = hub.get("latitude")
        hub_lng = hub.get("longitude")
        if hub_lat is None or hub_lng is None:
            continue

        crow_dist = vincenty_distance_km(latitude, longitude, float(hub_lat), float(hub_lng))
        if crow_dist <= radius_km:
            road_dist = estimate_road_distance_km(crow_dist, "road")
            bearing = compute_bearing(latitude, longitude, float(hub_lat), float(hub_lng))
            item = dict(hub)
            item["distance_km"] = crow_dist
            item["road_distance_km"] = road_dist
            item["bearing_deg"] = bearing
            item["estimated_drive_time_min"] = max(5, int(road_dist * 2.5))
            candidates.append(item)

    candidates.sort(key=lambda x: x["distance_km"])
    return candidates[:limit]


def format_inr(amount: float) -> str:
    """Format numeric amounts into strictly compliant Indian Rupee currency representations."""
    if amount <= 0:
        return "₹0"
    if amount.is_integer():
        return f"₹{int(amount):,}"
    return f"₹{amount:,.2f}"
