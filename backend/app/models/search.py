"""Pydantic Models for Search Operations."""

from typing import List, Optional
from pydantic import BaseModel, Field


class SearchResultItem(BaseModel):
    """Single search match item schema."""

    id: str = Field(..., description="Unique identifier of the matching place")
    name: str = Field(..., description="Name of the place")
    state: str = Field(..., description="State name")
    city: str = Field(..., description="City or district")
    category: str = Field(..., description="Category tag")
    match_score: Optional[float] = Field(None, description="Relevance score of search match")


class SearchResponse(BaseModel):
    """Overall search response schema."""

    query: str = Field(..., description="Original search query string")
    count: int = Field(..., description="Number of results found")
    results: List[SearchResultItem] = Field(default_factory=list, description="List of search result matches")
