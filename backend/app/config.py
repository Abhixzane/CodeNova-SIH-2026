import os
try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        class BaseSettings:
            pass
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "BharatYatra API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./bharatyatra.db")
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "*"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
