"""Multimodal Routing, Fare Calculation and Tariff Engine.

Calculates realistic transit routes, travel duration, calorie expenditure,
CO2 carbon footprints, and official Indian transport tariff breakdowns.
"""

from typing import Any, Dict, List, Optional
from app.services.geo_service import estimate_road_distance_km, format_inr, vincenty_distance_km

TARIFF_TABLE = {
    "WALK": {
        "mode_name": "Walking",
        "base_fare": 0.0,
        "base_km": 0.0,
        "per_km_rate": 0.0,
        "speed_kmh": 4.5,
        "co2_per_km": 0.0,
        "calorie_per_km": 48.0,
        "fare_source": "Free Active Mobility",
        "eco_friendly": True,
    },
    "BICYCLE": {
        "mode_name": "Smart City Bicycle Share",
        "base_fare": 15.0,
        "base_km": 1.0,
        "per_km_rate": 2.0,
        "speed_kmh": 14.0,
        "co2_per_km": 0.0,
        "calorie_per_km": 32.0,
        "fare_source": "Public Bike Share Scheme (Smart Cities)",
        "eco_friendly": True,
    },
    "SUBURBAN_RAIL": {
        "mode_name": "Suburban Local Train (Second Class)",
        "base_fare": 5.0,
        "base_km": 10.0,
        "per_km_rate": 0.35,
        "speed_kmh": 36.0,
        "co2_per_km": 12.0,
        "calorie_per_km": 4.0,
        "fare_source": "Indian Railways Suburban Fare Matrix",
        "eco_friendly": True,
    },
    "METRO": {
        "mode_name": "Metro Rail Transit",
        "base_fare": 10.0,
        "base_km": 2.0,
        "per_km_rate": 2.20,
        "speed_kmh": 32.0,
        "co2_per_km": 16.0,
        "calorie_per_km": 5.0,
        "fare_source": "Urban Metro Railway Fare Structure",
        "eco_friendly": True,
    },
    "BUS": {
        "mode_name": "City Transit Bus (Ordinary / Non-AC)",
        "base_fare": 6.0,
        "base_km": 3.0,
        "per_km_rate": 1.75,
        "speed_kmh": 18.0,
        "co2_per_km": 26.0,
        "calorie_per_km": 4.0,
        "fare_source": "State Road Transport Undertaking (SRTU)",
        "eco_friendly": True,
    },
    "AUTO_RICKSHAW": {
        "mode_name": "Auto-Rickshaw (Metered Fare)",
        "base_fare": 23.0,
        "base_km": 1.5,
        "per_km_rate": 15.33,
        "speed_kmh": 24.0,
        "co2_per_km": 68.0,
        "calorie_per_km": 2.0,
        "fare_source": "Regional Transport Authority (RTO Official Rate)",
        "eco_friendly": False,
    },
    "TAXI_CAB": {
        "mode_name": "App Cab / Non-AC Taxi",
        "base_fare": 32.0,
        "base_km": 1.5,
        "per_km_rate": 18.50,
        "speed_kmh": 28.0,
        "co2_per_km": 112.0,
        "calorie_per_km": 1.0,
        "fare_source": "RTO Taxi Fare / Aggregator Standard Rate",
        "eco_friendly": False,
    },
}


def calculate_mode_fare(mode_key: str, road_distance_km: float) -> Tuple[float, float, str]:
    """Calculate minimum fare, maximum fare, and tariff explanation for a specific transport mode."""
    tariff = TARIFF_TABLE.get(mode_key.upper(), TARIFF_TABLE["AUTO_RICKSHAW"])
    base_fare = tariff["base_fare"]
    base_km = tariff["base_km"]
    per_km = tariff["per_km_rate"]

    if road_distance_km <= base_km or per_km == 0:
        calculated = base_fare
    else:
        extra_km = road_distance_km - base_km
        calculated = base_fare + (extra_km * per_km)

    # Calculate min/max range with realistic traffic and meter variations
    if mode_key.upper() in ("WALK", "BICYCLE", "SUBURBAN_RAIL", "METRO"):
        min_fare = round(calculated, 1)
        max_fare = round(calculated * 1.0, 1)
    elif mode_key.upper() == "BUS":
        min_fare = round(calculated, 1)
        max_fare = round(calculated * 1.25, 1)  # AC bus slab
    elif mode_key.upper() == "AUTO_RICKSHAW":
        min_fare = round(calculated, 1)
        max_fare = round(calculated * 1.20, 1)  # Slight detour or peak
    else:  # TAXI_CAB
        min_fare = round(calculated, 1)
        max_fare = round(calculated * 1.35, 1)  # Dynamic surge

    note = f"{tariff['fare_source']} (Base {format_inr(base_fare)} for first {base_km} km, {format_inr(per_km)}/km thereafter)"
    return min_fare, max_fare, note


def build_multimodal_route_options(
    origin_lat: float,
    origin_lng: float,
    dest_lat: float,
    dest_lng: float,
    origin_name: str = "Origin Location",
    dest_name: str = "Destination",
) -> List[Dict[str, Any]]:
    """Generate comprehensive multimodal route alternatives between two coordinates."""
    crow_dist = vincenty_distance_km(origin_lat, origin_lng, dest_lat, dest_lng)
    options = []

    # 1. Active Walking (if <= 5km)
    if crow_dist <= 5.0:
        walk_road_km = estimate_road_distance_km(crow_dist, "walk")
        duration_min = max(3, int((walk_road_km / TARIFF_TABLE["WALK"]["speed_kmh"]) * 60))
        calories = int(walk_road_km * TARIFF_TABLE["WALK"]["calorie_per_km"])
        options.append({
            "mode": "WALK",
            "title": "Pedestrian Heritage Walk",
            "distance_km": walk_road_km,
            "duration_min": duration_min,
            "min_fare_inr": 0.0,
            "max_fare_inr": 0.0,
            "fare_display": "Free",
            "co2_grams": 0,
            "calorie_burn": calories,
            "eco_friendly": True,
            "fare_note": "Zero emissions pedestrian pathway",
            "steps": [
                f"Walk from {origin_name}",
                f"Follow pedestrian promenade towards {dest_name} ({walk_road_km} km)",
                f"Arrive at {dest_name}",
            ],
            "google_maps_url": f"https://www.google.com/maps/dir/?api=1&origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}&travelmode=walking",
        })

    # 2. Public Bike Share (if <= 12km)
    if crow_dist <= 12.0:
        bike_road_km = estimate_road_distance_km(crow_dist, "bicycle")
        duration_min = max(4, int((bike_road_km / TARIFF_TABLE["BICYCLE"]["speed_kmh"]) * 60))
        min_fare, max_fare, fare_note = calculate_mode_fare("BICYCLE", bike_road_km)
        options.append({
            "mode": "BICYCLE",
            "title": "Smart City Bicycle",
            "distance_km": bike_road_km,
            "duration_min": duration_min,
            "min_fare_inr": min_fare,
            "max_fare_inr": max_fare,
            "fare_display": format_inr(min_fare),
            "co2_grams": 0,
            "calorie_burn": int(bike_road_km * TARIFF_TABLE["BICYCLE"]["calorie_per_km"]),
            "eco_friendly": True,
            "fare_note": fare_note,
            "steps": [
                f"Unlock bicycle at docking station near {origin_name}",
                f"Cycle along arterial boulevard towards {dest_name} ({bike_road_km} km)",
                f"Dock bicycle at station near {dest_name}",
            ],
            "google_maps_url": f"https://www.google.com/maps/dir/?api=1&origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}&travelmode=bicycling",
        })

    # 3. Suburban Rail / Metro (Fastest public transit)
    rail_road_km = estimate_road_distance_km(crow_dist, "rail")
    rail_duration = max(8, int((rail_road_km / TARIFF_TABLE["SUBURBAN_RAIL"]["speed_kmh"]) * 60) + 7)  # +7 min wait/platform
    rail_min_fare, rail_max_fare, rail_fare_note = calculate_mode_fare("SUBURBAN_RAIL", rail_road_km)
    options.append({
        "mode": "SUBURBAN_RAIL",
        "title": "Local Rail Transit / Suburban Line",
        "distance_km": rail_road_km,
        "duration_min": rail_duration,
        "min_fare_inr": rail_min_fare,
        "max_fare_inr": rail_max_fare,
        "fare_display": format_inr(rail_min_fare),
        "co2_grams": int(rail_road_km * TARIFF_TABLE["SUBURBAN_RAIL"]["co2_per_km"]),
        "calorie_burn": int(rail_road_km * TARIFF_TABLE["SUBURBAN_RAIL"]["calorie_per_km"]),
        "eco_friendly": True,
        "fare_note": rail_fare_note,
        "steps": [
            f"Board suburban local or metro train near {origin_name}",
            f"Transit via designated corridor ({rail_road_km} km)",
            f"Alight at closest station and walk to {dest_name}",
        ],
        "google_maps_url": f"https://www.google.com/maps/dir/?api=1&origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}&travelmode=transit",
    })

    # 4. City Transit Bus
    bus_road_km = estimate_road_distance_km(crow_dist, "bus")
    bus_duration = max(10, int((bus_road_km / TARIFF_TABLE["BUS"]["speed_kmh"]) * 60) + 6)
    bus_min_fare, bus_max_fare, bus_fare_note = calculate_mode_fare("BUS", bus_road_km)
    options.append({
        "mode": "BUS",
        "title": "State Road Transport Bus",
        "distance_km": bus_road_km,
        "duration_min": bus_duration,
        "min_fare_inr": bus_min_fare,
        "max_fare_inr": bus_max_fare,
        "fare_display": f"{format_inr(bus_min_fare)} - {format_inr(bus_max_fare)}",
        "co2_grams": int(bus_road_km * TARIFF_TABLE["BUS"]["co2_per_km"]),
        "calorie_burn": int(bus_road_km * TARIFF_TABLE["BUS"]["calorie_per_km"]),
        "eco_friendly": True,
        "fare_note": bus_fare_note,
        "steps": [
            f"Board city transit bus from stop near {origin_name}",
            f"Ride route along main city avenue ({bus_road_km} km)",
            f"Alight at bus stop and proceed to {dest_name}",
        ],
        "google_maps_url": f"https://www.google.com/maps/dir/?api=1&origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}&travelmode=transit",
    })

    # 5. Auto-Rickshaw (Metered)
    auto_road_km = estimate_road_distance_km(crow_dist, "auto")
    auto_duration = max(6, int((auto_road_km / TARIFF_TABLE["AUTO_RICKSHAW"]["speed_kmh"]) * 60))
    auto_min_fare, auto_max_fare, auto_fare_note = calculate_mode_fare("AUTO_RICKSHAW", auto_road_km)
    options.append({
        "mode": "AUTO_RICKSHAW",
        "title": "Metered Auto-Rickshaw",
        "distance_km": auto_road_km,
        "duration_min": auto_duration,
        "min_fare_inr": auto_min_fare,
        "max_fare_inr": auto_max_fare,
        "fare_display": f"{format_inr(auto_min_fare)} - {format_inr(auto_max_fare)}",
        "co2_grams": int(auto_road_km * TARIFF_TABLE["AUTO_RICKSHAW"]["co2_per_km"]),
        "calorie_burn": int(auto_road_km * TARIFF_TABLE["AUTO_RICKSHAW"]["calorie_per_km"]),
        "eco_friendly": False,
        "fare_note": auto_fare_note,
        "steps": [
            f"Hail metered auto-rickshaw at {origin_name}",
            f"Drive via arterial roads ({auto_road_km} km)",
            f"Direct drop-off at {dest_name}",
        ],
        "google_maps_url": f"https://www.google.com/maps/dir/?api=1&origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}&travelmode=driving",
    })

    # 6. Taxi / Cab
    cab_road_km = estimate_road_distance_km(crow_dist, "cab")
    cab_duration = max(5, int((cab_road_km / TARIFF_TABLE["TAXI_CAB"]["speed_kmh"]) * 60))
    cab_min_fare, cab_max_fare, cab_fare_note = calculate_mode_fare("TAXI_CAB", cab_road_km)
    options.append({
        "mode": "TAXI_CAB",
        "title": "Taxi / App-Cab Direct",
        "distance_km": cab_road_km,
        "duration_min": cab_duration,
        "min_fare_inr": cab_min_fare,
        "max_fare_inr": cab_max_fare,
        "fare_display": f"{format_inr(cab_min_fare)} - {format_inr(cab_max_fare)}",
        "co2_grams": int(cab_road_km * TARIFF_TABLE["TAXI_CAB"]["co2_per_km"]),
        "calorie_burn": int(cab_road_km * TARIFF_TABLE["TAXI_CAB"]["calorie_per_km"]),
        "eco_friendly": False,
        "fare_note": cab_fare_note,
        "steps": [
            f"Book ride from {origin_name}",
            f"Express drive via city thoroughfare ({cab_road_km} km)",
            f"Arrive at destination gate at {dest_name}",
        ],
        "google_maps_url": f"https://www.google.com/maps/dir/?api=1&origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}&travelmode=driving",
    })

    return options
