from typing import Optional
from pydantic import BaseModel

class FavoriteItem(BaseModel):
    id: str
    place_id: str
    place_name: str
    city: str
    category: str
    thumbnail_url: Optional[str] = None
    added_at: Optional[str] = None

class FavoriteRequest(BaseModel):
    place_id: str
