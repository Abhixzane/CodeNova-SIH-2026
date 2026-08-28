"""Main FastAPI Application Entrypoint.

This module initializes the FastAPI app, configures CORS middleware for frontend communication,
mounts core API routers, and defines the system health check endpoint.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models.common import HealthResponse
from app.routers import places_router, search_router, states_router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.PROJECT_DESCRIPTION,
        version=settings.VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # ---------------------------------------------------------
    # CORS Middleware Configuration
    # Allows React/Vite/Next.js frontend clients to communicate
    # with this backend without cross-origin blocking.
    # ---------------------------------------------------------
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ---------------------------------------------------------
    # Health Check & Root Endpoints
    # ---------------------------------------------------------
    @app.get(
        "/health",
        response_model=HealthResponse,
        tags=["System"],
        summary="Service Health Check",
        description="Verify that the FastAPI server is running and healthy.",
    )
    async def health_check() -> HealthResponse:
        """Return system health status."""
        return HealthResponse(status="ok")

    @app.get(
        "/",
        tags=["System"],
        summary="API Root Information",
        description="Root informational endpoint with documentation links.",
    )
    async def root():
        """Return welcome message and documentation links."""
        return {
            "message": "Welcome to CodeNova-SIH-2026 Tourism API",
            "docs": "/docs",
            "health": "/health",
            "version": settings.VERSION,
        }

    # ---------------------------------------------------------
    # Router Mounts (All prefixed under /api)
    # ---------------------------------------------------------
    app.include_router(states_router, prefix=settings.API_PREFIX)
    app.include_router(places_router, prefix=settings.API_PREFIX)
    app.include_router(search_router, prefix=settings.API_PREFIX)

    return app


# Application instance for ASGI servers (e.g. uvicorn app.main:app)
app = create_app()
