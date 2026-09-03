from fastapi import APIRouter
from typing import List
from ..schemas.state import StateResponse
from ..services.tourism_service import tourism_service

router = APIRouter(prefix="/states", tags=["States"])


@router.get("", response_model=List[StateResponse])
async def get_states():
    """Retrieve all Indian states and Union Territories with metadata."""
    return tourism_service.get_states()
