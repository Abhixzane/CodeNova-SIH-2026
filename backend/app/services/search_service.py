"""Search Service for Multi-Attribute Destination Matching."""

from typing import List, Optional
from app.models.search import SearchResponse, SearchResultItem
from app.services.place_service import place_service


class SearchService:
    """Provides keyword-based search with multi-field weighted scoring."""

    def __init__(self, service=place_service) -> None:
        self.place_service = service

    def search(
        self,
        query: str,
        limit: int = 20,
        city: Optional[str] = None,
    ) -> SearchResponse:
        """Search places across name, city, state, category, tags, and descriptions."""
        query_clean = query.strip().lower()
        if not query_clean:
            return SearchResponse(query=query, count=0, results=[])

        places = self.place_service.get_all_places()
        matches: List[SearchResultItem] = []

        query_tokens = [tok for tok in query_clean.split() if len(tok) > 1] or [query_clean]

        for place in places:
            score = 0.0
            p_name = place.name.lower()
            p_city = place.city.lower()
            p_state = place.state.lower()
            p_cat = place.category.lower()
            p_tags = [t.lower() for t in place.tags]
            p_summary = (place.summary or "").lower()
            p_desc = (place.description or "").lower()
            p_history = (place.history or "").lower()

            # 1. Exact Name match
            if query_clean == p_name or query_clean == place.id.lower():
                score = max(score, 1.0)
            elif query_clean in p_name:
                score = max(score, 0.9)
            elif any(tok in p_name for tok in query_tokens):
                score = max(score, 0.85)

            # 2. City or State match
            if query_clean in p_city or query_clean in p_state:
                score = max(score, 0.8)
            elif any(tok in p_city or tok in p_state for tok in query_tokens):
                score = max(score, 0.75)

            # 3. Category or Tag match
            if query_clean == p_cat or any(query_clean == t for t in p_tags):
                score = max(score, 0.75)
            elif query_clean in p_cat or any(query_clean in t for t in p_tags):
                score = max(score, 0.7)
            elif any(tok in p_cat or any(tok in t for t in p_tags) for tok in query_tokens):
                score = max(score, 0.65)

            # 4. Content / Summary / Description / History match
            if query_clean in p_summary or query_clean in p_desc or query_clean in p_history:
                score = max(score, 0.5)
            elif any(tok in p_summary or tok in p_desc or tok in p_history for tok in query_tokens):
                score = max(score, 0.4)

            # Boost score if destination matches city context
            if city and city.strip().lower() in p_city:
                score += 0.1

            if score > 0:
                matches.append(
                    SearchResultItem(
                        id=place.id,
                        name=place.name,
                        state=place.state,
                        city=place.city,
                        category=place.category,
                        match_score=round(score, 2),
                    )
                )

        # Sort descending by match score
        matches.sort(key=lambda item: item.match_score or 0.0, reverse=True)
        results = matches[:limit]

        return SearchResponse(
            query=query,
            count=len(results),
            results=results,
        )


# Global singleton instance
search_service = SearchService()
