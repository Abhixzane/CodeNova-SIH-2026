from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime
from datetime import datetime
from backend.app.db.session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    place_id = Column(String, index=True)
    title = Column(String)
    state = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Trip(Base):
    __tablename__ = "trips"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    title = Column(String)
    city = Column(String)
    duration_hours = Column(Integer)
    estimated_cost = Column(Float)
    stops_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"
    id = Column(String, primary_key=True, index=True)
    monument_id = Column(String, index=True)
    monument_name = Column(String)
    issue_type = Column(String)
    severity = Column(String)
    description = Column(Text)
    status = Column(String, default="Reported")
    created_at = Column(DateTime, default=datetime.utcnow)
