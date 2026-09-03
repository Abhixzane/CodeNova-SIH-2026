"""
Railway and Metro Connectivity Lookup Tool.
"""

RAILWAY_LOOKUP_TOOL_DECLARATION = {
    "name": "lookup_nearest_railway_hub",
    "description": "Finds the nearest suburban railway or metro stations to any Indian tourist destination.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "place_name": {
                "type": "STRING",
                "description": "Name of the heritage monument or destination.",
            },
            "city": {
                "type": "STRING",
                "description": "City name where destination is located.",
            },
        },
        "required": ["place_name", "city"],
    },
}
