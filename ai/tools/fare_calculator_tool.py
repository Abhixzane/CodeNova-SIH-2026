"""
Transit Fare Estimation Tool for Indian Urban Transport.
"""

FARE_CALCULATOR_TOOL_DECLARATION = {
    "name": "estimate_travel_fare",
    "description": "Calculates estimated fares across taxi, auto-rickshaw, metro, and local train modes in INR.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "origin": {
                "type": "STRING",
                "description": "Origin location or landmark name.",
            },
            "destination": {
                "type": "STRING",
                "description": "Destination landmark name.",
            },
            "distance_km": {
                "type": "NUMBER",
                "description": "Distance in kilometers between locations.",
            },
            "city": {
                "type": "STRING",
                "description": "Indian metropolitan area (e.g. Mumbai, Delhi).",
            },
        },
        "required": ["origin", "destination", "distance_km"],
    },
}
