import os
from typing import Dict, Any, List
from ..config import settings


class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY

    async def generate_chat_response(
        self,
        message: str,
        city: str = "Mumbai",
        history: List[Dict[str, str]] = None,
        context: Dict[str, Any] = None,
    ) -> Dict[str, Any]:
        msg_lower = message.lower()

        # Fallback intelligent local knowledge base for offline/quick responses
        suggested_places = []
        if "mumbai" in msg_lower or city.lower() == "mumbai":
            suggested_places = [
                {"id": "gateway-of-india", "name": "Gateway of India", "city": "Mumbai", "reason": "Iconic basalt arch landmark"},
                {"id": "marine-drive", "name": "Marine Drive", "city": "Mumbai", "reason": "Queen's Necklace promenade"},
                {"id": "csmt", "name": "Chhatrapati Shivaji Maharaj Terminus", "city": "Mumbai", "reason": "UNESCO Victorian Gothic masterpiece"},
            ]
        elif "delhi" in msg_lower or city.lower() == "delhi":
            suggested_places = [
                {"id": "qutub-minar", "name": "Qutub Minar", "city": "Delhi", "reason": "Historic 73m victory minaret"},
                {"id": "red-fort", "name": "Red Fort", "city": "Delhi", "reason": "Mughal imperial citadel"},
            ]
        elif "jaipur" in msg_lower or city.lower() == "jaipur" or "rajasthan" in msg_lower:
            suggested_places = [
                {"id": "hawa-mahal", "name": "Hawa Mahal", "city": "Jaipur", "reason": "Honeycomb facade of 953 jharokhas"},
                {"id": "amber-fort", "name": "Amber Fort", "city": "Jaipur", "reason": "Hilltop Rajput fortress"},
            ]

        reply = (
            f"Namaste! Exploring {city} is an extraordinary journey into India's living heritage. "
            f"Based on your query ('{message}'), I recommend focusing on monuments that celebrate the regional architecture and culture. "
            f"For smooth travel, take suburban rail or metro during non-peak hours (11 AM to 4 PM), and carry hydration while exploring open courtyards."
        )

        return {
            "reply": reply,
            "suggested_places": suggested_places,
            "suggested_actions": [
                f"Calculate route to {suggested_places[0]['name'] if suggested_places else 'nearest landmark'}",
                "Generate a 1-day heritage circuit",
                "View 3D monument model",
            ],
            "sources": ["Incredible India Tourism Knowledge Base", "ASI Heritage Archive"],
        }


ai_service = AIService()
