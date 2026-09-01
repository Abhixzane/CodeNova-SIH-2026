import time
from typing import Dict, Optional
from app.models.user import UserProfile, UserRegisterRequest, UserLoginRequest, UserAuthResponse, OnboardingSurvey

class AuthService:
    def __init__(self):
        # Demo in-memory store with default user
        self._users: Dict[str, dict] = {
            "explorer@bharatyatra.in": {
                "password": "password123",
                "profile": UserProfile(
                    id="user-default-1",
                    name="Aman Verma",
                    email="explorer@bharatyatra.in",
                    home_city="Mumbai",
                    preferred_language="English",
                    survey=OnboardingSurvey(
                        traveler_type="Heritage explorer",
                        trip_duration="2-3 days",
                        budget_range="budget",
                        preferred_transport="mixed",
                        interests=["heritage", "coastal", "culture", "photography"],
                    ),
                    is_survey_completed=True,
                    created_at="2026-01-01",
                )
            }
        }
        self._tokens: Dict[str, str] = {
            "bharat-demo-token-1": "explorer@bharatyatra.in"
        }

    def register(self, req: UserRegisterRequest) -> UserAuthResponse:
        email = req.email.strip().lower()
        if email in self._users:
            profile = self._users[email]["profile"]
            token = f"token-{int(time.time())}-{email}"
            self._tokens[token] = email
            return UserAuthResponse(token=token, profile=profile)

        user_id = f"user-{int(time.time())}"
        profile = UserProfile(
            id=user_id,
            name=req.name.strip(),
            email=email,
            home_city=req.home_city or "Mumbai",
            preferred_language="English",
            is_survey_completed=False,
            created_at="2026-09-01",
        )
        self._users[email] = {
            "password": req.password,
            "profile": profile
        }
        token = f"token-{int(time.time())}-{email}"
        self._tokens[token] = email
        return UserAuthResponse(token=token, profile=profile)

    def login(self, req: UserLoginRequest) -> Optional[UserAuthResponse]:
        email = req.email.strip().lower()
        if email in self._users:
            profile = self._users[email]["profile"]
            token = f"token-{int(time.time())}-{email}"
            self._tokens[token] = email
            return UserAuthResponse(token=token, profile=profile)
        # Auto-create for friendly demo flow if user enters new email
        return self.register(UserRegisterRequest(name=email.split("@")[0].capitalize(), email=email, password=req.password))

    def get_profile_by_token(self, token: str) -> Optional[UserProfile]:
        email = self._tokens.get(token) or "explorer@bharatyatra.in"
        user = self._users.get(email)
        return user["profile"] if user else None

    def update_profile(self, token: str, profile_update: UserProfile) -> Optional[UserProfile]:
        email = self._tokens.get(token) or "explorer@bharatyatra.in"
        if email in self._users:
            self._users[email]["profile"] = profile_update
            return profile_update
        return None

    def save_survey(self, token: str, survey: OnboardingSurvey) -> Optional[UserProfile]:
        profile = self.get_profile_by_token(token)
        if profile:
            profile.survey = survey
            profile.is_survey_completed = True
            return profile
        return None

auth_service = AuthService()
