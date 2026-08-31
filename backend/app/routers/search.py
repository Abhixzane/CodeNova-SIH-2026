"""Search Router.

Provides search endpoints for discovering destinations across names, states, cities,
tags, categories, and descriptions with multi-field weighted relevance scoring.
"""

from typing import Optional
from fastapi import APIRouter, Query
from app.models.search import SearchResponse
from app.services.search_service import search_service

router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.get(
    "",
    response_model=SearchResponse,
    summary="Search places and destinations",
    description="Search destinations by keyword across name, state, city, category, tags, and descriptions.",
)
async def search_places(
    q: str = Query(..., min_length=1, description="Search keyword or phrase"),
    city: Optional[str] = Query(None, description="Optional city priority filter (e.g. 'Mumbai')"),
    limit: int = Query(20, ge=1, le=100, description="Maximum number of search results to return"),
) -> SearchResponse:
    """Search destinations using multi-field weighted scoring."""
    return search_service.search(query=q, limit=limit, city=city)
