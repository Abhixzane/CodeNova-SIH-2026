from pydantic import BaseModel

class CityWeather(BaseModel):
    city: str
    temperature_c: int
    condition: str
    humidity: int
    wind_kmh: int
    status: str = "Estimated"
