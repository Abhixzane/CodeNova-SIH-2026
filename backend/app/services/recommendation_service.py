"""Recommendation Service for Tourist Destinations."""

from typing import List, Optional
from app.models.place import PlaceDetail, PlaceSummary
from app.services.place_service import place_service


class RecommendationService:
    """Provides interest-based and category-based destination recommendations."""

    def __init__(self, service=place_service) -> None:
        self.place_service = service

    def recommend(
        self,
        city: Optional[str] = None,
        interests: Optional[List[str]] = None,
        exclude_place_id: Optional[str] = None,
        limit: int = 5,
    ) -> List[PlaceSummary]:
        """Recommend destinations scored by interest alignment and ratings."""
        all_places = self.place_service.get_all_places()

        if city:
            city_clean = city.strip().lower()
            all_places = [p for p in all_places if city_clean in p.city.lower()]

        if exclude_place_id:
            all_places = [p for p in all_places if p.id.lower() != exclude_place_id.strip().lower()]

        interests_clean = [i.strip().lower() for i in (interests or []) if i.strip()]

        scored_places = []
        for place in all_places:
            score = (place.rating or 4.0) * 1.0

            p_cat = place.category.lower()
            p_tags = [t.lower() for t in place.tags]

            for interest in interests_clean:
                if interest == p_cat:
                    score += 3.0
                elif any(interest in t for t in p_tags):
                    score += 2.0

            scored_places.append((score, place))

        # Sort descending by score
        scored_places.sort(key=lambda x: x[0], reverse=True)

        top_places = [p for _, p in scored_places[:limit]]

        return [
            PlaceSummary(
                id=p.id,
                name=p.name,
                state=p.state,
                city=p.city,
                country=p.country,
                category=p.category,
                summary=p.summary,
                coordinates=p.coordinates,
                rating=p.rating,
                thumbnail_url=p.thumbnail_url,
                tags=p.tags,
                features=p.features,
            )
            for p in top_places
        ]


# Global singleton instance
recommendation_service = RecommendationService()
