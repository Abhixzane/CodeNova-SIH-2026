from pathlib import Path

def write_file(path_str, content):
    p = Path(path_str)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"Wrote {path_str}")

# 1. backend/app/routers/v1.py
v1_code = """from typing import Any, Dict, List, Optional
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
"""

# 2. backend/app/services/ai_service.py
ai_code = """import logging
import uuid
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from app.models.ai import AIChatRequest, AIChatResponse, AISuggestedPlace
from app.db.repository import tourism_repo
from app.services.geo_service import find_nearest_transit_hubs, format_inr
from app.services.routing_fare_service import build_multimodal_route_options, calculate_mode_fare

logger = logging.getLogger(__name__)


class UIAction(BaseModel):
    action_type: str
    payload: Dict[str, Any] = Field(default_factory=dict)


class V1AIChatResponse(BaseModel):
    session_token: str
    conversation_id: str
    reply: str
    markdown_text: str
    ui_actions: List[UIAction] = Field(default_factory=list)
    suggested_places: List[AISuggestedPlace] = Field(default_factory=list)
    sources: List[str] = Field(default_factory=list)


CONVERSATIONS: Dict[str, List[Dict[str, str]]] = {}
SESSION_CONTEXT: Dict[str, Dict[str, Any]] = {}


class StatefulAIService:
    async def chat(
        self,
        message: str,
        session_token: Optional[str] = None,
        conversation_id: Optional[str] = None,
        client_context: Optional[Dict[str, Any]] = None,
        place_id: Optional[str] = None,
        city: Optional[str] = None,
    ) -> V1AIChatResponse:
        conv_id = conversation_id or session_token or str(uuid.uuid4())
        token = session_token or conv_id

        if conv_id not in CONVERSATIONS:
            CONVERSATIONS[conv_id] = []
        if token not in SESSION_CONTEXT:
            SESSION_CONTEXT[token] = {}

        ctx = SESSION_CONTEXT[token]
        if client_context:
            ctx.update(client_context)
        if place_id:
            ctx["last_place_id"] = place_id
        if city:
            ctx["last_city"] = city

        history = CONVERSATIONS[conv_id]
        user_msg = message.strip()
        history.append({"role": "user", "content": user_msg})

        if len(history) > 12:
            CONVERSATIONS[conv_id] = history[-12:]
            history = CONVERSATIONS[conv_id]

        response = await self._process_turn(user_msg, token, conv_id, ctx, history)
        history.append({"role": "assistant", "content": response.markdown_text})

        return response

    async def generate_response(self, request: AIChatRequest) -> AIChatResponse:
        v1_res = await self.chat(
            message=request.message,
            conversation_id=request.conversation_id,
            place_id=request.place_id,
        )
        return AIChatResponse(
            conversation_id=v1_res.conversation_id,
            reply=v1_res.reply,
            suggested_places=v1_res.suggested_places,
            sources=v1_res.sources,
        )

    async def _process_turn(
        self,
        user_msg: str,
        token: str,
        conv_id: str,
        ctx: Dict[str, Any],
        history: List[Dict[str, str]],
    ) -> V1AIChatResponse:
        low = user_msg.lower()
        all_places = await tourism_repo.get_all_places()
        ui_actions: List[UIAction] = []
        suggested: List[AISuggestedPlace] = []
        sources = ["CodeNova Verified Tourism Database", "BharatYatra Verified Dataset", "Ministry of Tourism (Incredible India)", "Archaeological Survey of India (ASI)"]

        active_place = None
        if ctx.get("last_place_id"):
            active_place = await tourism_repo.get_place(ctx["last_place_id"])

        for p in all_places:
            if p["name"].lower() in low or p["id"] in low:
                active_place = p
                ctx["last_place_id"] = p["id"]
                ctx["last_city"] = p.get("city_id")
                break

        cities = await tourism_repo.get_cities()
        for c in cities:
            if c["name"].lower() in low or c["id"] in low:
                ctx["last_city"] = c["id"]
                break

        current_city_id = ctx.get("last_city", "mumbai")

        is_greeting = any(w in low for w in ["hi", "hello", "hey", "namaste", "pranam"]) and len(low.split()) <= 4
        is_3d = any(w in low for w in ["3d", "virtual tour", "model", "inspect 3d", "interactive"])
        is_route = any(w in low for w in ["how to reach", "route", "how far", "directions", "fare", "cost", "distance", "reach there"])
        is_station = any(w in low for w in ["station", "railway", "train", "metro", "transit", "nearest hub"])
        is_itinerary = any(w in low for w in ["itinerary", "plan my day", "trip plan", "schedule", "day trip", "tour"])

        if is_greeting:
            text = (
                "Namaste! 🙏 Welcome to **BharatYatra** — your intelligent companion for exploring India's heritage. "
                "I can calculate multimodal routes with live metered fares, guide you to nearby railway stations, "
                "generate custom day itineraries, or launch immersive 3D monument experiences. "
                "Where across India would you like to travel today?"
            )
            return V1AIChatResponse(
                session_token=token,
                conversation_id=conv_id,
                reply=text,
                markdown_text=text,
                ui_actions=[],
                suggested_places=[],
                sources=sources,
            )

        if is_3d and active_place:
            text = (
                f"### 🏛️ Interactive 3D Exploration: **{active_place['name']}**\\n\\n"
                f"Launching the 3D WebGL Heritage Explorer for **{active_place['name']}** in {active_place.get('address', '')}. "
                f"You can orbit around the architectural model, adjust lighting angles, and inspect heritage blueprints in real time."
            )
            ui_actions.append(UIAction(
                action_type="TRIGGER_3D_EXPLORER",
                payload={"place_id": active_place["id"], "name": active_place["name"], "model_url": active_place.get("three_d_model_url")}
            ))
            return V1AIChatResponse(
                session_token=token,
                conversation_id=conv_id,
                reply=text,
                markdown_text=text,
                ui_actions=ui_actions,
                suggested_places=[AISuggestedPlace(id=active_place["id"], name=active_place["name"], category=active_place.get("category", "heritage"), city=active_place.get("city_id", "mumbai"), reason="3D Model Enabled")],
                sources=sources,
            )

        if is_station and active_place:
            hubs = await tourism_repo.get_transit_hubs()
            nearest = find_nearest_transit_hubs(active_place["latitude"], active_place["longitude"], hubs, limit=3)
            hub_lines = []
            for h in nearest:
                lines = ", ".join(h.get("line_info", {}).get("lines", ["Rail Connection"]))
                hub_lines.append(f"- **{h['name']}** (`{h.get('code', 'STN')}`): **{h['distance_km']} km** away (~{h['estimated_drive_time_min']} mins drive). Lines: *{lines}*")

            text = (
                f"### 🚆 Nearest Transit Hubs to **{active_place['name']}**\\n\\n"
                + "\\n".join(hub_lines) +
                f"\\n\\n💡 **Transit Tip**: Suburban rail and metro lines connect directly to this hub for under ₹15. Metered auto-rickshaws and black-and-yellow taxis are available at designated prepaid stands."
            )
            ui_actions.append(UIAction(
                action_type="OPEN_DESTINATION_CARD",
                payload={"place_id": active_place["id"], "tab": "transit"}
            ))
            return V1AIChatResponse(
                session_token=token,
                conversation_id=conv_id,
                reply=text,
                markdown_text=text,
                ui_actions=ui_actions,
                suggested_places=[AISuggestedPlace(id=active_place["id"], name=active_place["name"], category=active_place.get("category", "heritage"), city=active_place.get("city_id", "mumbai"), reason="Nearest transit analyzed")],
                sources=sources,
            )

        if is_route:
            origin_name = "City Centre"
            dest_name = active_place["name"] if active_place else "Gateway of India"
            target_lat = active_place["latitude"] if active_place else 18.9220
            target_lng = active_place["longitude"] if active_place else 72.8347

            hubs = await tourism_repo.get_transit_hubs()
            origin_hub = hubs[0] if hubs else {"latitude": 18.9400, "longitude": 72.8353, "name": "CSMT Terminus"}

            routes = build_multimodal_route_options(
                origin_hub["latitude"], origin_hub["longitude"],
                target_lat, target_lng,
                origin_name=origin_hub["name"],
                dest_name=dest_name,
            )

            route_summary = []
            for r in routes[:4]:
                route_summary.append(
                    f"- **{r['title']}** (`{r['mode']}`): {r['distance_km']} km | ⏱️ {r['duration_min']} mins | 💰 **{r['fare_display']}** ({r['fare_note']})"
                )

            text = (
                f"### 🗺️ Multimodal Routes to **{dest_name}**\\n\\n"
                f"Calculated from **{origin_hub['name']}**:\\n\\n"
                + "\\n".join(route_summary) +
                f"\\n\\n🧭 *Click below to hand off directly to Google Maps navigation with active GPS guidance.*"
            )
            ui_actions.append(UIAction(
                action_type="SHOW_MAP_ROUTE",
                payload={"origin": origin_hub["name"], "destination": dest_name, "routes": routes}
            ))
            return V1AIChatResponse(
                session_token=token,
                conversation_id=conv_id,
                reply=text,
                markdown_text=text,
                ui_actions=ui_actions,
                suggested_places=[AISuggestedPlace(id=active_place["id"], name=active_place["name"], category=active_place.get("category", "heritage"), city=active_place.get("city_id", "mumbai"), reason="Multimodal route mapped")] if active_place else [],
                sources=sources,
            )

        if is_itinerary:
            city_places = [p for p in all_places if p.get("city_id", "").lower() == current_city_id.lower()]
            if not city_places:
                city_places = all_places[:4]

            selected_stops = city_places[:4]
            stops_md = []
            total_fee = 0
            for idx, st in enumerate(selected_stops, 1):
                fee = st.get("entry_fee_inr", {}).get("indian", 0)
                total_fee += fee
                fee_str = format_inr(fee) if fee > 0 else "Free"
                stops_md.append(f"{idx}. **{st['name']}** ({st.get('category', 'Heritage').title()}) — ⏱️ {st.get('estimated_visit_duration_min', 60)} mins | Entry: {fee_str}")

            text = (
                f"### 🗓️ Optimized Day Itinerary for **{current_city_id.title()}**\\n\\n"
                f"Here is a sequential, time-budgeted itinerary designed for minimal transit overhead:\\n\\n"
                + "\\n".join(stops_md) +
                f"\\n\\n**Total Estimated Visiting Time**: ~5.5 Hours\\n"
                f"**Total Entry Fees (Indian National)**: **{format_inr(total_fee)}**\\n\\n"
                f"💡 *Would you like me to make this cheaper, reduce walking distance, or focus purely on UNESCO heritage sites?*"
            )
            ui_actions.append(UIAction(
                action_type="RENDER_ITINERARY",
                payload={"city": current_city_id, "stops": [s["id"] for s in selected_stops]}
            ))
            suggested = [AISuggestedPlace(id=s["id"], name=s["name"], category=s.get("category", "heritage"), city=s.get("city_id", current_city_id), reason="Itinerary Stop") for s in selected_stops]
            return V1AIChatResponse(
                session_token=token,
                conversation_id=conv_id,
                reply=text,
                markdown_text=text,
                ui_actions=ui_actions,
                suggested_places=suggested,
                sources=sources,
            )

        target = active_place or all_places[0]
        ctx["last_place_id"] = target["id"]
        fee = target.get("entry_fee_inr", {}).get("indian", 0)
        fee_text = format_inr(fee) if fee > 0 else "Free entry"
        foreign_fee = target.get("entry_fee_inr", {}).get("foreigner", 0)
        foreign_fee_str = format_inr(foreign_fee) if foreign_fee > 0 else "Free entry"

        text = (
            f"### 🏛️ **{target['name']}**\\n\\n"
            f"📍 **Location**: {target.get('address', '')}\\n"
            f"🎖️ **Heritage Status**: {target.get('heritage_status', 'ASI Protected Landmark')}\\n"
            f"⏳ **Historical Period**: {target.get('historical_period', 'Historical Era')}\\n"
            f"🎟️ **Entry Fees**: Indian: **{fee_text}** | Foreign Visitors: **{foreign_fee_str}**\\n"
            f"⏱️ **Estimated Duration**: {target.get('estimated_visit_duration_min', 60)} minutes\\n"
            f"🌟 **Best Time to Visit**: {target.get('best_time_to_visit', 'Morning or late afternoon')}\\n\\n"
            f"{target.get('description', target.get('short_description', ''))}\\n\\n"
            f"Would you like me to calculate routes to {target['name']}, check nearby railway stations, or launch the 3D model?"
        )
        ui_actions.append(UIAction(
            action_type="OPEN_DESTINATION_CARD",
            payload={"place_id": target["id"]}
        ))
        suggested = [
            AISuggestedPlace(id=target["id"], name=target["name"], category=target.get("category", "heritage"), city=target.get("city_id", "mumbai"), reason="Active Destination")
        ] + [
            AISuggestedPlace(id=p["id"], name=p["name"], category=p.get("category", "heritage"), city=p.get("city_id", "mumbai"), reason="Related destination")
            for p in all_places if p["id"] != target["id"]
        ][:3]

        return V1AIChatResponse(
            session_token=token,
            conversation_id=conv_id,
            reply=text,
            markdown_text=text,
            ui_actions=ui_actions,
            suggested_places=suggested,
            sources=sources,
        )


AIService = StatefulAIService
ai_service = StatefulAIService()
ai_service_v1 = ai_service
"""

write_file("backend/app/routers/v1.py", v1_code)
write_file("backend/app/services/ai_service.py", ai_code)

# 3. tests/test_v1_endpoints.py
v1_test_code = """from pathlib import Path
import sys
import pytest
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app

client = TestClient(app)


def test_v1_routing_calculate():
    payload = {
        "origin": "Chhatrapati Shivaji Maharaj Terminus",
        "destination": "Gateway of India",
        "origin_lat": 18.9400,
        "origin_lng": 72.8353,
        "dest_lat": 18.9220,
        "dest_lng": 72.8347,
        "preferred_modes": ["WALK", "AUTO_RICKSHAW", "TAXI_CAB", "SUBURBAN_RAIL"]
    }
    response = client.post("/api/v1/routing/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["origin"] == "Chhatrapati Shivaji Maharaj Terminus"
    assert data["destination"] == "Gateway of India"
    assert data["crow_distance_km"] > 0
    assert data["route_count"] >= 1

    modes = [r["mode"] for r in data["routes"]]
    assert "WALK" in modes or "AUTO_RICKSHAW" in modes
    for r in data["routes"]:
        assert "google_maps_url" in r
        assert "min_fare_inr" in r
        assert "duration_min" in r


def test_v1_fare_estimate():
    payload_day = {
        "distance_km": 10.0,
        "mode": "AUTO_RICKSHAW",
        "is_night_time": False
    }
    res_day = client.post("/api/v1/routing/fare-estimate", json=payload_day)
    assert res_day.status_code == 200
    data_day = res_day.json()

    assert data_day["transport_mode"] == "AUTO_RICKSHAW"
    assert data_day["min_fare_inr"] > 0
    assert "₹" in data_day["formatted_fare"]

    payload_night = {
        "distance_km": 10.0,
        "mode": "AUTO_RICKSHAW",
        "is_night_time": True
    }
    res_night = client.post("/api/v1/routing/fare-estimate", json=payload_night)
    assert res_night.status_code == 200
    data_night = res_night.json()

    assert data_night["min_fare_inr"] > data_day["min_fare_inr"]
    assert data_night["surge_multiplier"] == 1.25


def test_v1_itinerary_adjust():
    payload = {
        "city": "Mumbai",
        "duration_hours": 6.0,
        "adjustment_action": "make_cheaper"
    }
    response = client.post("/api/v1/itinerary/adjust", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["city"] == "Mumbai"
    assert data["adjustment_action"] == "make_cheaper"
    assert data["total_stops"] >= 1
    assert "total_entry_fees_formatted" in data
    assert "₹" in data["total_entry_fees_formatted"]


def test_v1_ai_chat_stateful_flow():
    session_id = "test-session-12345"

    turn1_res = client.post("/api/v1/ai/chat", json={
        "message": "Tell me about Gateway of India",
        "session_token": session_id
    })
    assert turn1_res.status_code == 200
    d1 = turn1_res.json()
    assert "Gateway of India" in d1["reply"]
    assert d1["session_token"] == session_id

    turn2_res = client.post("/api/v1/ai/chat", json={
        "message": "How do I reach there and what is the fare?",
        "session_token": session_id
    })
    assert turn2_res.status_code == 200
    d2 = turn2_res.json()
    assert any(act["action_type"] == "SHOW_MAP_ROUTE" for act in d2["ui_actions"])

    turn3_res = client.post("/api/v1/ai/chat", json={
        "message": "Can I see the 3D model of this monument?",
        "session_token": session_id
    })
    assert turn3_res.status_code == 200
    d3 = turn3_res.json()
    assert any(act["action_type"] == "TRIGGER_3D_EXPLORER" for act in d3["ui_actions"])


def test_v1_destinations_listing_and_detail():
    res_list = client.get("/api/v1/destinations?limit=20")
    assert res_list.status_code == 200
    d_list = res_list.json()
    assert d_list["total"] >= 10
    assert len(d_list["destinations"]) <= 20

    res_cat = client.get("/api/v1/destinations?category=heritage")
    assert res_cat.status_code == 200
    d_cat = res_cat.json()
    assert all(p["category"] == "heritage" for p in d_cat["destinations"])

    res_detail = client.get("/api/v1/destinations/gateway-of-india")
    assert res_detail.status_code == 200
    d_detail = res_detail.json()
    assert d_detail["name"] == "Gateway of India"
    assert "heritage_status" in d_detail

    res_404 = client.get("/api/v1/destinations/non-existent-monument-xyz")
    assert res_404.status_code == 404


def test_v1_destination_transit_proximity():
    response = client.get("/api/v1/destinations/gateway-of-india/transit?radius_km=30")
    assert response.status_code == 200
    data = response.json()

    assert data["destination_id"] == "gateway-of-india"
    assert data["transit_hubs_count"] >= 1
    for hub in data["transit_hubs"]:
        assert "distance_km" in hub
        assert "estimated_drive_time_min" in hub


def test_v1_user_preferences_lifecycle():
    res_get = client.get("/api/v1/user/preferences?email=traveler@bharatyatra.in")
    assert res_get.status_code == 200
    d_get = res_get.json()
    assert "interests" in d_get

    update_payload = {
        "interests": ["heritage", "coastal", "cuisine"],
        "budget": "luxury",
        "home_city": "Jaipur"
    }
    res_put = client.put("/api/v1/user/preferences?email=traveler@bharatyatra.in", json=update_payload)
    assert res_put.status_code == 200
    d_put = res_put.json()
    assert d_put["status"] == "success"
    assert d_put["preferences"]["budget"] == "luxury"
    assert d_put["preferences"]["home_city"] == "Jaipur"
"""

# 4. frontend/public/manifest.json
manifest_json = """{
  "short_name": "BharatYatra",
  "name": "BharatYatra - Explore India. Experience Heritage.",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": "/",
  "background_color": "#090d16",
  "theme_color": "#ff7722",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/"
}"""

# 5. frontend/public/sw.js
sw_js = """// BharatYatra PWA Service Worker
const CACHE_NAME = 'bharatyatra-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});
"""

write_file("tests/test_v1_endpoints.py", v1_test_code)
write_file("frontend/public/manifest.json", manifest_json)
write_file("frontend/public/sw.js", sw_js)


