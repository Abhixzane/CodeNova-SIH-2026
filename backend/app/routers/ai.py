"""AI Tourism Assistant Router.

Provides conversational intelligence grounded in structured destination knowledge,
historical significance, visiting hours, and proximity facts.
"""

from fastapi import APIRouter, HTTPException, status
from app.models.ai import AIChatRequest, AIChatResponse
from app.services.ai_service import ai_service

router = APIRouter(
    prefix="/ai",
    tags=["AI Tourism Assistant"],
)


@router.post(
    "/chat",
    response_model=AIChatResponse,
    summary="Interact with the AI Tourism Assistant",
    description="Ask tourism questions, seek trip recommendations, or request historical/cultural background.",
)
async def chat_with_ai_assistant(request: AIChatRequest) -> AIChatResponse:
    """Process a conversational tourism inquiry."""
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message field cannot be empty",
        )

    return await ai_service.generate_response(request)
