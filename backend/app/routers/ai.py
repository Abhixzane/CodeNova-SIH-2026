from fastapi import APIRouter, HTTPException
from ..schemas.ai import AIChatRequest, AIChatResponse
from ..services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI Travel Assistant"])


@router.post("/chat", response_model=AIChatResponse)
async def chat_with_assistant(request: AIChatRequest):
    """Interact with BharatYatra AI tourism guide powered by Gemini models."""
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message field cannot be empty")

    history_dict = [m.dict() for m in request.history] if request.history else []
    res = await ai_service.generate_chat_response(
        message=request.message,
        city=request.city or "Mumbai",
        history=history_dict,
        context=request.context or {},
    )
    return {
        "reply": res["reply"],
        "conversation_id": request.conversation_id or "conv-default",
        "suggested_places": res.get("suggested_places", []),
        "suggested_actions": res.get("suggested_actions", []),
        "sources": res.get("sources", []),
    }
