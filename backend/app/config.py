"""Application Configuration Module.

Defines runtime settings, server configurations, and CORS policies for the FastAPI backend.
Other team domains can extend this file to configure database URIs, API keys, or external service endpoints.
"""

import os
from typing import List


class Settings:
    """Application settings and environment configuration."""

    PROJECT_NAME: str = "CodeNova-SIH-2026 API"
    PROJECT_DESCRIPTION: str = (
        "Backend REST API foundation for the CodeNova intelligent tourism platform."
    )
    VERSION: str = "0.1.0"
    API_PREFIX: str = "/api"

    # Server configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

    # CORS configuration - allows frontend clients (React/Vite/Next.js) to connect
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*",  # Wildcard enabled for initial development and testing
    ]

    # External Provider Configurations (Loaded safely via environment variables)
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")

    # Base path for local curated tourism datasets
    BASE_DIR: str = str(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
    DATA_DIR: str = os.getenv("DATA_DIR", os.path.join(BASE_DIR, "data"))


settings = Settings()
