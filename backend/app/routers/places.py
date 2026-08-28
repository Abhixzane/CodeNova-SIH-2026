"""Tourist Places & Destinations Router.

Provides endpoints for querying, filtering, and retrieving detailed information
about tourist destinations across India.
"""

from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.models.place import (
    Coordinates,
    EntryFee,
    Model3DInfo,
    PlaceDetail,
    PlaceListResponse,
    PlaceSummary,
)

router = APIRouter(
    prefix="/places",
    tags=["Places"],
)

# Minimal sample dataset placeholder (domain team will connect database / datasets later)
SAMPLE_PLACES_DB: Dict[str, PlaceDetail] = {
    "hawa-mahal": PlaceDetail(
        id="hawa-mahal",
        name="Hawa Mahal",
        state="Rajasthan",
        city="Jaipur",
        category="heritage",
        summary="Palace of Winds constructed in 1799 with red and pink sandstone facade.",
        coordinates=Coordinates(lat=26.9239, lng=75.8267),
        rating=4.6,
        thumbnail_url="https://images.unsplash.com/photo-1609946850720-6d4323229b46",
        description=(
            "Hawa Mahal is an iconic palace in Jaipur, India. Built from red and pink sandstone, "
            "it sits on the edge of the City Palace and extends to the Zenana women's quarters."
        ),
        best_time_to_visit="October to March",
        visiting_hours="09:00 AM - 05:00 PM",
        entry_fee=EntryFee(domestic=50.0, international=200.0, currency="INR"),
        images=[
            "https://images.unsplash.com/photo-1609946850720-6d4323229b46",
        ],
        model_3d=Model3DInfo(has_model=True, model_url="/models/hawa-mahal.glb"),
        tags=["palace", "architecture", "pink-city", "heritage", "rajasthan"],
    ),
    "alleppey-backwaters": PlaceDetail(
        id="alleppey-backwaters",
        name="Alleppey Backwaters",
        state="Kerala",
        city="Alappuzha",
        category="nature",
        summary="Serene network of brackish lagoons, lakes, and canals known for houseboat cruises.",
        coordinates=Coordinates(lat=9.4981, lng=76.3388),
        rating=4.8,
        thumbnail_url="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
        description=(
            "Alleppey (Alappuzha) is famous for its serene backwaters, palm-fringed canals, "
            "and traditional houseboat stays in southern India."
        ),
        best_time_to_visit="November to February",
        visiting_hours="24 Hours (Houseboats 12:00 PM - 09:00 AM)",
        entry_fee=EntryFee(domestic=0.0, international=0.0, currency="INR"),
        images=[
            "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
        ],
        model_3d=Model3DInfo(has_model=False, model_url=None),
        tags=["backwaters", "nature", "houseboat", "kerala", "relaxation"],
    ),
}


@router.get(
    "",
    response_model=PlaceListResponse,
    summary="Get places (with optional state and category filters)",
    description="Retrieve a paginated list of tourist destinations, optionally filtered by state or category.",
)
async def get_places(
    state: Optional[str] = Query(
        None,
        description="Filter places by state name or identifier (case-insensitive, e.g. 'rajasthan')",
    ),
    category: Optional[str] = Query(
        None,
        description="Filter places by category (e.g. 'heritage', 'nature', 'spiritual', 'adventure')",
    ),
    limit: int = Query(20, ge=1, le=100, description="Maximum number of places to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
) -> PlaceListResponse:
    """Retrieve and filter places."""
    places: List[PlaceDetail] = list(SAMPLE_PLACES_DB.values())

    if state:
        state_clean = state.strip().lower()
        places = [
            p for p in places if state_clean in p.state.lower() or state_clean in p.id.lower()
        ]

    if category:
        category_clean = category.strip().lower()
        places = [p for p in places if p.category.lower() == category_clean]

    total = len(places)
    paginated_places = places[offset : offset + limit]

    # Convert PlaceDetail to PlaceSummary for list view
    summaries = [
        PlaceSummary(
            id=p.id,
            name=p.name,
            state=p.state,
            city=p.city,
            category=p.category,
            summary=p.summary,
            coordinates=p.coordinates,
            rating=p.rating,
            thumbnail_url=p.thumbnail_url,
        )
        for p in paginated_places
    ]

    return PlaceListResponse(
        total=total,
        limit=limit,
        offset=offset,
        data=summaries,
    )


@router.get(
    "/{place_id}",
    response_model=PlaceDetail,
    summary="Get place details by ID",
    description="Retrieve full details, 3D model info, and metadata for a specific tourist place.",
)
async def get_place_by_id(place_id: str) -> PlaceDetail:
    """Retrieve details for a single place."""
    place = SAMPLE_PLACES_DB.get(place_id.strip().lower())
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Place with id '{place_id}' not found",
        )
    return place
