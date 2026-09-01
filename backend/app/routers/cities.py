import json
from pathlib import Path
from typing import List
from fastapi import APIRouter
from app.config import settings
from app.models.city import City

router = APIRouter(prefix="/cities", tags=["Cities"])

@router.get("", response_model=List[City], summary="List all supported tourist cities")
async def list_cities():
    cities_file = Path(settings.DATA_DIR) / "cities.json"
    if cities_file.exists():
        with open(cities_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [City(**item) for item in data]
    return []
