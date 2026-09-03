"""
Prompt templates for generating optimized day itineraries across Indian heritage circuits.
"""

DAY_CIRCUIT_PROMPT_TEMPLATE = """
Generate a realistic, time-optimized day travel circuit for {city}.
Duration: {duration_hours} hours.
Interests: {interests}
Budget Level: {budget_level}

Requirements:
- Plan sequentially from morning (approx 09:00 AM) to evening.
- Account for realistic Indian urban traffic delays and walking distances between stops.
- Group nearby attractions topologically to avoid criss-crossing the city.
- Suggest exact transport modes between each consecutive stop (e.g. Metro Line 2A, Western Line Local, or Taxi).
- Estimate ticket prices in INR for Indian domestic travelers.
"""
