from sqlalchemy import Column, String, JSON, DateTime
from sqlalchemy.sql import func
from ..db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    home_city = Column(String, nullable=True)
    travel_style = Column(String, nullable=True)
    budget_preference = Column(String, nullable=True)
    preferred_transport = Column(String, nullable=True)
    interests = Column(JSON, nullable=True)
    survey = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
