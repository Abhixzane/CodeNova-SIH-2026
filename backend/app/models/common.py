"""Common / Shared Pydantic Models."""

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Health check response schema."""

    status: str = Field(default="ok", description="Server health status")
