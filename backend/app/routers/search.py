"""Search Router.

Provides search endpoints for discovering destinations across names, states, cities,
tags, and categories.
"""

from fastapi import APIRouter, Query
from app.models.search import SearchResponse, SearchResultItem
from app.routers.places import SAMPLE_PLACES_DB

router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.get(
    "",
    response_model=SearchResponse,
    summary="Search places and destinations",
    description="Search destinations by keyword across name, state, city, category, and tags.",
)
async def search_places(
    q: str = Query(..., min_length=1, description="Search keyword or phrase"),
    limit: int = Query(20, ge=1, le=100, description="Maximum number of search results to return"),
) -> SearchResponse:
    """Search sample places by matching query string."""
    query_clean = q.strip().lower()
    matches = []

    for place in SAMPLE_PLACES_DB.values():
        score = 0.0
        # Exact name match
        if query_clean in place.name.lower():
            score = 1.0
        # City or state match
        elif query_clean in place.city.lower() or query_clean in place.state.lower():
            score = 0.8
        # Category or tag match
        elif query_clean == place.category.lower() or any(
            query_clean in tag.lower() for tag in place.tags
        ):
            score = 0.7
        # Summary or description match
        elif (place.summary and query_clean in place.summary.lower()) or (
            place.description and query_clean in place.description.lower()
        ):
            score = 0.5

        if score > 0:
            matches.append(
                SearchResultItem(
                    id=place.id,
                    name=place.name,
                    state=place.state,
                    city=place.city,
                    category=place.category,
                    match_score=score,
                )
            )

    # Sort results by match score descending
    matches.sort(key=lambda item: item.match_score or 0.0, reverse=True)
    results = matches[:limit]

    return SearchResponse(
        query=q,
        count=len(results),
        results=results,
    )
