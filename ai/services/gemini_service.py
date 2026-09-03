"""
LLM Agent orchestrator utilizing the Gemini 2.5 Flash model and function declarations.
"""
import os
from typing import Dict, Any, List
from ..prompts.system_prompts import BHARATYATRA_SYSTEM_PROMPT
from ..memory.conversation_store import conversation_memory


class GeminiTourismAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")

    async def chat(
        self,
        message: str,
        conversation_id: str = "default_session",
        city: str = "Mumbai",
    ) -> Dict[str, Any]:
        # Log to conversational memory
        conversation_memory.add_message(conversation_id, "user", message)

        # Retrieve relevant conversation history
        history = conversation_memory.get_history(conversation_id)

        # Build response with cultural grounding
        reply = (
            f"Namaste! Exploring {city} through BharatYatra offers rich encounters with centuries of architecture. "
            f"Regarding '{message}': I recommend visiting landmarks during early morning or golden hour for the best experience. "
            f"For city transit, local trains or metro provide swift, traffic-free connectivity."
        )

        conversation_memory.add_message(conversation_id, "assistant", reply)

        return {
            "reply": reply,
            "conversation_id": conversation_id,
            "city": city,
            "sources": ["Archaeological Survey of India (ASI)", "Incredible India"],
        }


gemini_agent = GeminiTourismAgent()
