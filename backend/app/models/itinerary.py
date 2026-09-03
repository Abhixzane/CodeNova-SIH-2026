from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from ..db.base import Base


class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=True)
    title = Column(String, nullable=False)
    city = Column(String, nullable=False)
    duration_hours = Column(Float, nullable=False)
    total_places = Column(Integer, default=0)
    estimated_cost = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    id = Column(String, primary_key=True, index=True)
    itinerary_id = Column(String, ForeignKey("itineraries.id"), nullable=False)
    place_id = Column(String, nullable=False)
    place_name = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    visit_minutes = Column(Integer, default=60)
    travel_minutes = Column(Integer, default=15)
