from typing import List
from fastapi import APIRouter
from app.models.favorite import FavoriteItem, FavoriteRequest
from app.services.favorites_service import favorites_service

router = APIRouter(prefix="/favorites", tags=["Favorites"])

@router.get("", response_model=List[FavoriteItem], summary="Get saved favorite places")
async def list_favorites():
    return favorites_service.get_favorites()

@router.post("", response_model=FavoriteItem, summary="Add place to favorites")
async def add_favorite(req: FavoriteRequest):
    return favorites_service.add_favorite(req.place_id)

@router.delete("/{place_id}", summary="Remove place from favorites")
async def remove_favorite(place_id: str):
    removed = favorites_service.remove_favorite(place_id)
    return {"status": "ok", "removed": removed}
