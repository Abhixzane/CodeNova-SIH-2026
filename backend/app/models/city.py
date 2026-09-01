from pydantic import BaseModel, Field

class City(BaseModel):
    id: str
    name: str
    state: str
    state_id: str
    lat: float
    lng: float
    description: str
    places_count: int = Field(default=0)
