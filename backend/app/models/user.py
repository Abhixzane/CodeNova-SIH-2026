from typing import List, Optional
from pydantic import BaseModel, Field

class OnboardingSurvey(BaseModel):
    traveler_type: Optional[str] = "Heritage explorer"
    trip_duration: Optional[str] = "2-3 days"
    budget_range: Optional[str] = "budget"
    preferred_transport: Optional[str] = "mixed"
    interests: List[str] = Field(default_factory=lambda: ["heritage", "coastal", "culture"])
    accessibility_needs: Optional[str] = None

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    home_city: Optional[str] = "Mumbai"
    preferred_language: str = "English"
    survey: Optional[OnboardingSurvey] = None
    is_survey_completed: bool = False
    created_at: Optional[str] = None

class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    home_city: Optional[str] = "Mumbai"

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserAuthResponse(BaseModel):
    token: str
    profile: UserProfile
