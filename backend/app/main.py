from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import (
    health_router,
    states_router,
    places_router,
    routes_router,
    itinerary_router,
    ai_router,
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent Tourism Platform for Smart India Hackathon (SIH) 2026 - CodeNova",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers under /api
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(states_router, prefix=settings.API_V1_STR)
app.include_router(places_router, prefix=settings.API_V1_STR)
app.include_router(routes_router, prefix=settings.API_V1_STR)
app.include_router(itinerary_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "project": "BharatYatra (CodeNova-SIH-2026)",
        "docs": "/docs",
        "health": "/api/health",
        "api": "/api",
    }
