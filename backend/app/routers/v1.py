from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.db.repository import tourism_repo
from app.services.ai_service import V1AIChatResponse, ai_service_v1
from app.services.geo_service import find_nearest_transit_hubs, format_inr, vincenty_distance_km
from app.services.routing_fare_service import (
    TARIFF_TABLE,
    build_multimodal_route_options,
    calculate_mode_fare,
)

router = APIRouter(
    prefix="/v1",
    tags=["BharatYatra API v1 Core"],
)


class RoutingCalculateRequest(BaseModel):
    origin: str = "CSMT"
    destination: str = "Gateway of India"
    origin_lat: Optional[float] = 18.9400
    origin_lng: Optional[float] = 72.8353
    dest_lat: Optional[float] = 18.9220
    dest_lng: Optional[float] = 72.8347
    preferred_modes: Optional[List[str]] = None
    time_of_day: Optional[str] = "DAY"
    user_id: Optional[str] = None


class FareEstimateRequest(BaseModel):
    distance_km: float
    mode: str = "AUTO_RICKSHAW"
    city_tier: Optional[str] = "TIER_1"
    is_night_time: Optional[bool] = False


class ItineraryAdjustRequest(BaseModel):
    city: str = "Mumbai"
    duration_hours: float = 8.0
    current_stops: Optional[List[str]] = None
    adjustment_action: str = "make_cheaper"
    budget_inr: Optional[float] = 2000.0
    constraint_notes: Optional[str] = None


class V1AIChatRequest(BaseModel):
    message: str
    session_token: Optional[str] = None
    conversation_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    place_id: Optional[str] = None
    city: Optional[str] = None


class UserPreferencesUpdateRequest(BaseModel):
    interests: Optional[List[str]] = None
    budget: Optional[str] = None
    pace: Optional[str] = None
    mobility: Optional[str] = None
    dietary: Optional[str] = None
    home_city: Optional[str] = None


@router.post("/routing/calculate", summary="Calculate multimodal travel routes and fares")
async def calculate_route_v1(req: RoutingCalculateRequest):
    origin_lat = req.origin_lat or 18.9400
    origin_lng = req.origin_lng or 72.8353
    dest_lat = req.dest_lat or 18.9220
    dest_lng = req.dest_lng or 72.8347

    routes = build_multimodal_route_options(
        origin_lat=origin_lat,
        origin_lng=origin_lng,
        dest_lat=dest_lat,
        dest_lng=dest_lng,
        origin_name=req.origin,
        dest_name=req.destination,
    )

    if req.preferred_modes:
        pref_upper = [m.upper() for m in req.preferred_modes]
        routes = [r for r in routes if r["mode"] in pref_upper] or routes

    crow_dist = vincenty_distance_km(origin_lat, origin_lng, dest_lat, dest_lng)

    return {
        "origin": req.origin,
        "destination": req.destination,
        "crow_distance_km": crow_dist,
        "route_count": len(routes),
        "routes": routes,
    }


@router.post("/routing/fare-estimate", summary="Compute algorithmic tariff estimate for transport mode")
async def estimate_fare_v1(req: FareEstimateRequest):
    mode = req.mode.upper()
    if mode not in TARIFF_TABLE:
        mode = "AUTO_RICKSHAW"

    min_fare, max_fare, note = calculate_mode_fare(mode, req.distance_km)
    tariff = TARIFF_TABLE[mode]

    surge_mult = 1.25 if req.is_night_time else 1.0
    final_min = round(min_fare * surge_mult, 1)
    final_max = round(max_fare * surge_mult, 1)

    return {
        "transport_mode": mode,
        "mode_name": tariff["mode_name"],
        "distance_km": req.distance_km,
        "is_night_time": req.is_night_time,
        "surge_multiplier": surge_mult,
        "min_fare_inr": final_min,
        "max_fare_inr": final_max,
        "formatted_fare": f"{format_inr(final_min)} - {format_inr(final_max)}" if final_min != final_max else format_inr(final_min),
        "tariff_breakdown": {
            "base_fare": format_inr(tariff["base_fare"]),
            "base_distance_km": tariff["base_km"],
            "per_km_rate": format_inr(tariff["per_km_rate"]),
            "tariff_source": tariff["fare_source"],
        },
        "fare_note": note,
    }


@router.post("/itinerary/adjust", summary="Graph/Budget-optimized itinerary adjustment")
async def adjust_itinerary_v1(req: ItineraryAdjustRequest):
    all_places = await tourism_repo.get_all_places()
    city_places = [p for p in all_places if p.get("city_id", "").lower() == req.city.lower()]
    if not city_places:
        city_places = all_places[:5]

    action = req.adjustment_action.lower()

    if action == "make_cheaper":
        sorted_places = sorted(city_places, key=lambda x: x.get("entry_fee_inr", {}).get("indian", 0))
    elif action == "reduce_walking":
        sorted_places = [p for p in city_places if p.get("accessibility_info", {}).get("wheelchair_accessible", True)] or city_places
    elif action == "add_heritage":
        sorted_places = [p for p in city_places if "UNESCO" in p.get("heritage_status", "") or "ASI" in p.get("heritage_status", "")] or city_places
    else:
        sorted_places = city_places

    stops = sorted_places[:4]
    stops_data = []
    total_entry_fee = 0.0

    for idx, s in enumerate(stops, 1):
        fee = s.get("entry_fee_inr", {}).get("indian", 0)
        total_entry_fee += fee
        stops_data.append({
            "stop_number": idx,
            "place_id": s["id"],
            "name": s["name"],
            "category": s.get("category", "heritage"),
            "visiting_duration_min": s.get("estimated_visit_duration_min", 60),
            "entry_fee_inr": fee,
            "entry_fee_formatted": format_inr(fee) if fee > 0 else "Free",
            "opening_hours": s.get("opening_hours", {}).get("monday", "Open Daily"),
            "accessibility": s.get("accessibility_info", {}).get("notes", "Paved"),
        })

    return {
        "city": req.city,
        "adjustment_action": req.adjustment_action,
        "total_stops": len(stops_data),
        "total_entry_fees_inr": total_entry_fee,
        "total_entry_fees_formatted": format_inr(total_entry_fee),
        "estimated_transit_cost_inr": 80.0,
        "estimated_total_cost_inr": total_entry_fee + 80.0,
        "estimated_total_cost_formatted": format_inr(total_entry_fee + 80.0),
        "stops": stops_data,
        "summary": f"Adjusted itinerary for {req.city} based on '{req.adjustment_action}'. Total stops: {len(stops_data)} with total estimated spend of {format_inr(total_entry_fee + 80.0)}.",
    }


@router.post("/ai/chat", response_model=V1AIChatResponse, summary="Stateful conversational AI travel assistant")
async def chat_v1(req: V1AIChatRequest):
    return await ai_service_v1.chat(
        message=req.message,
        session_token=req.session_token,
        conversation_id=req.conversation_id,
        client_context=req.context,
        place_id=req.place_id,
        city=req.city,
    )


@router.get("/destinations", summary="List pan-India destinations with spatial filters")
async def list_destinations_v1(
    state: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    total, places = await tourism_repo.search_places(
        query=search,
        state=state,
        city=city,
        category=category,
        limit=limit,
        offset=offset,
    )
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "destinations": places,
    }


@router.get("/destinations/{place_id}", summary="Get detailed destination dossier")
async def get_destination_v1(place_id: str):
    place = await tourism_repo.get_place(place_id)
    if not place:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Destination '{place_id}' not found.")
    return place


@router.get("/destinations/{place_id}/transit", summary="Get nearest railway hubs and airports")
async def get_destination_transit_v1(place_id: str, radius_km: float = 25.0, limit: int = 5):
    place = await tourism_repo.get_place(place_id)
    if not place:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Destination '{place_id}' not found.")

    hubs = await tourism_repo.get_transit_hubs()
    nearest = find_nearest_transit_hubs(place["latitude"], place["longitude"], hubs, radius_km=radius_km, limit=limit)
    return {
        "destination_id": place["id"],
        "destination_name": place["name"],
        "transit_hubs_count": len(nearest),
        "transit_hubs": nearest,
    }


@router.get("/user/preferences", summary="Get authenticated user preferences")
async def get_user_preferences_v1(email: str = "demo@bharatyatra.in"):
    user = await tourism_repo.get_user_by_email(email)
    if not user:
        return {
            "email": email,
            "interests": ["heritage", "architecture", "coastal", "culture"],
            "budget": "medium",
            "pace": "balanced",
            "mobility": "moderate",
            "dietary": "vegetarian",
            "home_city": "Mumbai",
        }
    return user.get("preferences", {})


@router.put("/user/preferences", summary="Update user preferences")
async def update_user_preferences_v1(pref: UserPreferencesUpdateRequest, email: str = "demo@bharatyatra.in"):
    updated = await tourism_repo.update_user(email, {"preferences": pref.dict(exclude_unset=True)})
    return {
        "status": "success",
        "message": "Preferences updated successfully.",
        "preferences": pref.dict(exclude_unset=True),
    }
