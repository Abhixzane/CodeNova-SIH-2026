from sqlalchemy import Column, String, Integer, Float
from ..db.base import Base


class State(Base):
    __tablename__ = "states"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    capital = Column(String, nullable=False)
    region = Column(String, nullable=False)
    total_places = Column(Integer, default=0)
    thumbnail_url = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
