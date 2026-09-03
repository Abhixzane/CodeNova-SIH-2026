from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class AIChatMessage(BaseModel):
    role: str
    content: str


class AISuggestedPlace(BaseModel):
    id: str
    name: str
    city: Optional[str] = None
    reason: Optional[str] = None


class AIChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    city: Optional[str] = None
    place_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    history: Optional[List[AIChatMessage]] = []


class AIChatResponse(BaseModel):
    reply: str
    conversation_id: Optional[str] = None
    suggested_places: Optional[List[AISuggestedPlace]] = []
    suggested_actions: Optional[List[str]] = []
    sources: Optional[List[str]] = []
