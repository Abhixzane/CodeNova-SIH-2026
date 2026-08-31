"""AI Tourism Assistant Service.

Grounds conversational queries in verified destination data, history, culture,
nearby attractions, and travel facts with graceful offline fallback.
"""

import logging
import uuid
from typing import Any, Dict, List, Optional
import httpx

from app.config import settings
from app.models.ai import AIChatRequest, AIChatResponse, AISuggestedPlace
from app.services.nearby_service import nearby_service
from app.services.place_service import place_service

logger = logging.getLogger(__name__)


class AIService:
    """Intelligent conversational tourism guidance service."""

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or settings.AI_API_KEY

    async def generate_response(self, request: AIChatRequest) -> AIChatResponse:
        """Process user inquiry with structured destination grounding."""
        conv_id = request.conversation_id or f"conv-{uuid.uuid4().hex[:8]}"

        # 1. Assemble structured grounding context
        target_place = None
        nearby_places = []
        if request.place_id:
            target_place = place_service.get_place(request.place_id)
            if target_place:
                nearby_resp = nearby_service.find_nearby(
                    target_place.coordinates.lat,
                    target_place.coordinates.lng,
                    radius_km=15.0,
                    limit=3,
                )
                nearby_places = [
                    p for p in nearby_resp.results if p.id != target_place.id
                ]

        suggested_places: List[AISuggestedPlace] = []
        if target_place:
            suggested_places.append(
                AISuggestedPlace(
                    id=target_place.id,
                    name=target_place.name,
                    category=target_place.category,
                    city=target_place.city,
                )
            )
        for np in nearby_places[:2]:
            suggested_places.append(
                AISuggestedPlace(
                    id=np.id,
                    name=np.name,
                    category=np.category,
                    city=np.city,
                )
            )

        # 2. If API Key is present, attempt live LLM call (e.g. Gemini)
        if self.api_key:
            try:
                llm_reply = await self._call_llm_api(request, target_place, nearby_places)
                if llm_reply:
                    return AIChatResponse(
                        conversation_id=conv_id,
                        reply=llm_reply,
                        suggested_places=suggested_places,
                        sources=["CodeNova Verified Tourism Database", "Google Gemini Live AI"],
                    )
            except Exception as e:
                logger.warning(f"Live LLM call failed, falling back to grounded response generator: {e}")

        # 3. Deterministic Grounded Tourism Response Fallback
        fallback_reply = self._build_grounded_fallback_reply(request, target_place, nearby_places)

        return AIChatResponse(
            conversation_id=conv_id,
            reply=fallback_reply,
            suggested_places=suggested_places,
            sources=["CodeNova Verified Tourism Database"],
        )

    def _build_grounded_fallback_reply(
        self,
        request: AIChatRequest,
        target_place: Optional[Any],
        nearby_places: List[Any],
    ) -> str:
        """Construct a high-quality, verified tourism response from curated knowledge."""
        msg_lower = request.message.lower()

        if target_place:
            reply_parts = [
                f"**{target_place.name}** ({target_place.category.capitalize()}) is located in {target_place.city}, {target_place.state}."
            ]

            if any(k in msg_lower for k in ["history", "built", "who", "past", "ancient"]):
                if target_place.history:
                    reply_parts.append(f"\n\n**Historical Background:** {target_place.history}")
                else:
                    reply_parts.append(f"\n\n**Overview:** {target_place.description}")
            elif any(k in msg_lower for k in ["visit", "time", "hours", "when", "fee", "entry", "cost"]):
                vis_info = target_place.visiting_info
                best_time = vis_info.best_time_to_visit if vis_info else target_place.best_time_to_visit
                hours = vis_info.visiting_hours if vis_info else target_place.visiting_hours
                fee = target_place.entry_fee

                reply_parts.append(f"\n\n**Visiting Guidance:**")
                if best_time:
                    reply_parts.append(f"- **Best Time to Visit:** {best_time}")
                if hours:
                    reply_parts.append(f"- **Visiting Hours:** {hours}")
                if fee:
                    fee_str = f"Domestic: ₹{fee.domestic or 0:.0f}, International: ₹{fee.international or 0:.0f}"
                    reply_parts.append(f"- **Entry Fee:** {fee_str}")
            else:
                reply_parts.append(f"\n\n{target_place.description}")

            if nearby_places:
                nearby_names = ", ".join([f"{p.name} ({p.distance_km} km away)" for p in nearby_places])
                reply_parts.append(f"\n\n**Nearby Attractions:** You can easily combine your visit with {nearby_names}.")

            if target_place.features and target_place.features.threed:
                reply_parts.append("\n\n*Tip: An interactive 3D virtual tour is available for this monument on CodeNova!*")

            return "".join(reply_parts)

        # General city or planning question
        city = request.city or "Mumbai"
        places_in_city = [p for p in place_service.get_all_places() if p.city.lower() == city.lower()]

        if not places_in_city:
            return f"Welcome to CodeNova! I can help you discover iconic tourism destinations, heritage monuments, coastal promenades, and local culture across {city}."

        top_names = [p.name for p in places_in_city[:4]]
        return (
            f"Here are top recommended places to explore in **{city}**: {', '.join(top_names)}.\n\n"
            f"You can ask me for historical background, optimal visiting hours, nearby attractions, or travel routes between any of these destinations!"
        )

    async def _call_llm_api(
        self,
        request: AIChatRequest,
        target_place: Optional[Any],
        nearby_places: List[Any],
    ) -> Optional[str]:
        """Placeholder for direct LLM API invocation."""
        # When Gemini endpoint is configured:
        # Prompt incorporates system instructions + target_place facts + user message
        return None


# Global singleton instance
ai_service = AIService()
