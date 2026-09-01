"""Main FastAPI Application Entrypoint.

Initializes the FastAPI app, configures CORS middleware for BharatYatra frontend,
mounts core API routers, and defines the system health check and root info endpoints.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models.common import HealthResponse
from app.routers import (
    ai_router,
    auth_router,
    cities_router,
    favorites_router,
    itinerary_router,
    maps_router,
    places_router,
    profile_router,
    railway_stations_router,
    routes_router,
    search_router,
    states_router,
    trips_router,
    v1_router,
    weather_router,
)


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

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get(
        "/health",
        response_model=HealthResponse,
        tags=["System"],
        summary="Service Health Check",
        description="Verify that the FastAPI server is running and healthy.",
    )
    async def health_check() -> HealthResponse:
        return HealthResponse(status="ok")

    @app.get(
        "/",
        tags=["System"],
        summary="API Root Information",
        description="Root informational endpoint.",
    )
    async def root():
        return {
            "message": "Welcome to BharatYatra Intelligent Tourism Platform API",
            "tagline": "Explore India. Experience Heritage.",
            "docs": "/docs",
            "health": "/health",
            "version": settings.VERSION,
        }

    # Mount API routers
    app.include_router(states_router, prefix=settings.API_PREFIX)
    app.include_router(cities_router, prefix=settings.API_PREFIX)
    app.include_router(places_router, prefix=settings.API_PREFIX)
    app.include_router(railway_stations_router, prefix=settings.API_PREFIX)
    app.include_router(search_router, prefix=settings.API_PREFIX)
    app.include_router(routes_router, prefix=settings.API_PREFIX)
    app.include_router(maps_router, prefix=settings.API_PREFIX)
    app.include_router(ai_router, prefix=settings.API_PREFIX)
    app.include_router(itinerary_router, prefix=settings.API_PREFIX)
    app.include_router(weather_router, prefix=settings.API_PREFIX)
    app.include_router(auth_router, prefix=settings.API_PREFIX)
    app.include_router(profile_router, prefix=settings.API_PREFIX)
    app.include_router(favorites_router, prefix=settings.API_PREFIX)
    app.include_router(trips_router, prefix=settings.API_PREFIX)
    app.include_router(v1_router, prefix=settings.API_PREFIX)

    return app


app = create_app()
