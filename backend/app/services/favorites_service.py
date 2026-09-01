import time
from typing import List, Dict
from app.models.favorite import FavoriteItem
from app.services.place_service import place_service

class FavoritesService:
    def __init__(self):
        self._favorites: Dict[str, FavoriteItem] = {}
        # Prepopulate with a starter favorite
        self.add_favorite("gateway-of-india")

    def get_favorites(self) -> List[FavoriteItem]:
        return list(self._favorites.values())

    def add_favorite(self, place_id: str) -> FavoriteItem:
        clean_id = place_id.strip().lower()
        if clean_id in self._favorites:
            return self._favorites[clean_id]
        place = place_service.get_place(clean_id)
        fav = FavoriteItem(
            id=f"fav-{clean_id}",
            place_id=clean_id,
            place_name=place.name if place else clean_id.replace("-", " ").title(),
            city=place.city if place else "Mumbai",
            category=place.category if place else "heritage",
            thumbnail_url=place.thumbnail_url if place else None,
            added_at="2026-09-01",
        )
        self._favorites[clean_id] = fav
        return fav

    def remove_favorite(self, place_id: str) -> bool:
        clean_id = place_id.strip().lower()
        if clean_id in self._favorites:
            del self._favorites[clean_id]
            return True
        return False

favorites_service = FavoritesService()
