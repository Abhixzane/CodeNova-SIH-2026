from sqlalchemy import Column, String, Float, JSON, ForeignKey
from ..db.base import Base


class Place(Base):
    __tablename__ = "places"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False, index=True)
    city = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    summary = Column(String, nullable=False)
    description = Column(String, nullable=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    rating = Column(Float, default=4.5)
    thumbnail_url = Column(String, nullable=True)
    images = Column(JSON, nullable=True)
    best_time_to_visit = Column(String, nullable=True)
    visiting_hours = Column(String, nullable=True)
    entry_fee = Column(JSON, nullable=True)
    model_3d = Column(JSON, nullable=True)
    tags = Column(JSON, nullable=True)
    visiting_info = Column(JSON, nullable=True)
