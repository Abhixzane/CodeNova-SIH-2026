"""
Place Search and Discovery Tool for Gemini Function Calling.
"""

PLACE_SEARCH_TOOL_DECLARATION = {
    "name": "search_places",
    "description": "Searches for heritage monuments, cultural landmarks, and attractions across Indian cities.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "query": {
                "type": "STRING",
                "description": "The search keywords such as 'forts in Jaipur' or 'Gateway of India'.",
            },
            "city": {
                "type": "STRING",
                "description": "Optional city name filter (e.g. Mumbai, Delhi, Jaipur).",
            },
            "category": {
                "type": "STRING",
                "description": "Category filter such as heritage, nature, spiritual, or adventure.",
            },
        },
        "required": ["query"],
    },
}
