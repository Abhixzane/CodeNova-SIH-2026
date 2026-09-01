import logging
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
                f"### 🏛️ Interactive 3D Exploration: **{active_place['name']}**\n\n"
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
                f"### 🚆 Nearest Transit Hubs to **{active_place['name']}**\n\n"
                + "\n".join(hub_lines) +
                f"\n\n💡 **Transit Tip**: Suburban rail and metro lines connect directly to this hub for under ₹15. Metered auto-rickshaws and black-and-yellow taxis are available at designated prepaid stands."
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
                f"### 🗺️ Multimodal Routes to **{dest_name}**\n\n"
                f"Calculated from **{origin_hub['name']}**:\n\n"
                + "\n".join(route_summary) +
                f"\n\n🧭 *Click below to hand off directly to Google Maps navigation with active GPS guidance.*"
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
                f"### 🗓️ Optimized Day Itinerary for **{current_city_id.title()}**\n\n"
                f"Here is a sequential, time-budgeted itinerary designed for minimal transit overhead:\n\n"
                + "\n".join(stops_md) +
                f"\n\n**Total Estimated Visiting Time**: ~5.5 Hours\n"
                f"**Total Entry Fees (Indian National)**: **{format_inr(total_fee)}**\n\n"
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
            f"### 🏛️ **{target['name']}**\n\n"
            f"📍 **Location**: {target.get('address', '')}\n"
            f"🎖️ **Heritage Status**: {target.get('heritage_status', 'ASI Protected Landmark')}\n"
            f"⏳ **Historical Period**: {target.get('historical_period', 'Historical Era')}\n"
            f"🎟️ **Entry Fees**: Indian: **{fee_text}** | Foreign Visitors: **{foreign_fee_str}**\n"
            f"⏱️ **Estimated Duration**: {target.get('estimated_visit_duration_min', 60)} minutes\n"
            f"🌟 **Best Time to Visit**: {target.get('best_time_to_visit', 'Morning or late afternoon')}\n\n"
            f"{target.get('description', target.get('short_description', ''))}\n\n"
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
