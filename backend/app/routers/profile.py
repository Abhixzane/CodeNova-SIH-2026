from fastapi import APIRouter, Header, HTTPException
from app.models.user import UserProfile, OnboardingSurvey
from app.services.auth_service import auth_service

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("", response_model=UserProfile, summary="Get profile")
async def get_profile(authorization: str = Header("bharat-demo-token-1")):
    token = authorization.replace("Bearer ", "").strip()
    profile = auth_service.get_profile_by_token(token)
    if not profile:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return profile

@router.put("", response_model=UserProfile, summary="Update profile")
async def update_profile(profile_update: UserProfile, authorization: str = Header("bharat-demo-token-1")):
    token = authorization.replace("Bearer ", "").strip()
    res = auth_service.update_profile(token, profile_update)
    if not res:
        raise HTTPException(status_code=400, detail="Failed to update profile")
    return res

@router.post("/survey", response_model=UserProfile, summary="Save onboarding survey preferences")
async def save_survey(survey: OnboardingSurvey, authorization: str = Header("bharat-demo-token-1")):
    token = authorization.replace("Bearer ", "").strip()
    res = auth_service.save_survey(token, survey)
    if not res:
        raise HTTPException(status_code=400, detail="Failed to save survey")
    return res
