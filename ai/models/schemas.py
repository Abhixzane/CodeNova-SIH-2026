"""
Pydantic schemas for AI Agent request and response payloads.
"""
from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class AgentMessage(BaseModel):
    role: str
    content: str


class TourismQuery(BaseModel):
    query: str
    city: Optional[str] = None
    state: Optional[str] = None
    conversation_id: Optional[str] = None
    user_preferences: Optional[Dict[str, Any]] = None


class AgentResponse(BaseModel):
    answer: str
    suggested_places: List[Dict[str, Any]] = []
    actions: List[str] = []
    citations: List[str] = []
