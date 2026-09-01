from fastapi import APIRouter, Query
from app.models.weather import CityWeather
from app.services.weather_service import weather_service

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("", response_model=CityWeather, summary="Get weather for city")
async def get_weather(city: str = Query("mumbai", description="Target city name")):
    return weather_service.get_weather(city=city)
