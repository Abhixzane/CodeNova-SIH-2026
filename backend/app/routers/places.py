from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any, List
from ..schemas.place import PlaceListResponse, PlaceDetail
from ..services.tourism_service import tourism_service

router = APIRouter(tags=["Places"])


@router.get("/places", response_model=PlaceListResponse)
async def get_places(
    state: Optional[str] = Query(None, description="Filter by Indian State"),
    city: Optional[str] = Query(None, description="Filter by City"),
    category: Optional[str] = Query(None, description="Filter by Category"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Retrieve filtered or paginated list of tourist destinations."""
    return tourism_service.get_places(
        state=state, city=city, category=category, limit=limit, offset=offset
    )


@router.get("/places/{id}", response_model=PlaceDetail)
async def get_place_by_id(id: str):
    """Retrieve rich destination details, visiting hours, and 3D specifications."""
    place = tourism_service.get_place_by_id(id)
    if not place:
        raise HTTPException(status_code=404, detail=f"Place with id '{id}' not found")
    return place


@router.get("/search")
async def search_places(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(20, ge=1, le=50),
):
    """Search places across names, cities, categories, and tags."""
    results = tourism_service.search_places(query=q, limit=limit)
    return {"query": q, "count": len(results), "results": results}
