from fastapi import APIRouter, Header, HTTPException
from app.models.user import UserRegisterRequest, UserLoginRequest, UserAuthResponse, UserProfile
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserAuthResponse, summary="Register user account")
async def register_user(req: UserRegisterRequest):
    return auth_service.register(req)

@router.post("/login", response_model=UserAuthResponse, summary="Login user account")
async def login_user(req: UserLoginRequest):
    res = auth_service.login(req)
    if not res:
        raise HTTPException(status_code=400, detail="Invalid login credentials")
    return res

@router.get("/me", response_model=UserProfile, summary="Get current user profile")
async def get_me(authorization: str = Header("bharat-demo-token-1")):
    token = authorization.replace("Bearer ", "").strip()
    profile = auth_service.get_profile_by_token(token)
    if not profile:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return profile
