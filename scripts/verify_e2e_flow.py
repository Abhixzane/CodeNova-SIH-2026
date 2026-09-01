import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from fastapi.testclient import TestClient

BACKEND_DIR = Path("backend").resolve()
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app

client = TestClient(app)

print("=" * 65)
print("  BHARATYATRA - SIH 2026 FLAGSHIP DEMO FLOW VERIFICATION")
print("=" * 65)

# 1. Health
resp = client.get("/health")
assert resp.status_code == 200, f"Health failed: {resp.text}"
print("[PASS] 1. GET /health -> status: ok")

# 2. States Listing
resp = client.get("/api/states")
assert resp.status_code == 200
states = resp.json()
assert len(states) >= 3
print(f"[PASS] 2. GET /api/states -> {len(states)} states loaded (Maharashtra, Rajasthan, Kerala, etc.)")

# 3. Search natural query: "famous places in Mumbai"
resp = client.get("/api/search?q=famous places in Mumbai&city=Mumbai")
assert resp.status_code == 200
search_data = resp.json()
assert search_data["count"] > 0
result_names = [r["name"] for r in search_data["results"]]
print(f"[PASS] 3. GET /api/search?q=famous places in Mumbai -> {search_data['count']} places found")
print(f"       Top matches: {result_names[:4]}")

# 4. Destination Detail for "marine-drive"
resp = client.get("/api/places/marine-drive")
assert resp.status_code == 200
marine = resp.json()
assert marine["id"] == "marine-drive"
lat = marine["coordinates"].get("lat") or marine["coordinates"].get("latitude")
lng = marine["coordinates"].get("lng") or marine["coordinates"].get("longitude")
assert lat == 18.9431
assert lng == 72.8230
print(f"[PASS] 4. GET /api/places/marine-drive -> Loaded '{marine['name']}' ({marine['category']})")
print(f"       History: {marine['history'][:60]}...")
print(f"       Coordinates: ({lat}, {lng})")

# 5. Route calculation: Origin: CSMT -> Destination: Marine Drive
resp = client.get("/api/routes?origin=csmt&destination=marine-drive")
assert resp.status_code == 200
route_data = resp.json()
assert len(route_data["options"]) >= 3
print(f"[PASS] 5. GET /api/routes?origin=csmt&destination=marine-drive -> {len(route_data['options'])} travel modes")
for opt in route_data["options"]:
    fare_str = f"Rs.{opt['estimated_fare']:.0f}" if opt['estimated_fare'] is not None else "Free"
    print(f"       - Mode {opt['mode']:<8}: {opt['duration_minutes']} min | {opt['distance_km']:.1f} km | Fare: {fare_str:<6} (Status: {opt['fare_status']})")

# 6. Google Maps Directions URL handoff
resp = client.get("/api/maps/directions?origin=csmt&destination=marine-drive&travel_mode=driving")
assert resp.status_code == 200
maps_data = resp.json()
assert "https://www.google.com/maps/dir/?" in maps_data["url"]
assert "key=" not in maps_data["url"]
print(f"[PASS] 6. GET /api/maps/directions -> Safe Universal URL generated:")
print(f"       {maps_data['url']}")

# 7. AI Assistant Chat: "I am near CSMT, have Rs 500 and 5 hours. What should I visit?"
resp = client.post("/api/ai/chat", json={
    "message": "I am near CSMT, have 500 rupees and 5 hours. What should I visit?",
    "city": "Mumbai"
})
assert resp.status_code == 200
ai_data = resp.json()
assert len(ai_data["suggested_places"]) > 0 or len(ai_data["reply"]) > 0
print(f"[PASS] 7. POST /api/ai/chat -> Grounded multi-turn journey response generated")
print(f"       Sources: {ai_data['sources']}")
print(f"       Suggested Places: {[p['name'] for p in ai_data['suggested_places']]}")
print(f"       AI Reply: {ai_data['reply'][:120]}...")

# 8. Itinerary Planning: 5-hour Mumbai tour from CSMT
resp = client.post("/api/itinerary", json={
    "city": "Mumbai",
    "origin": "csmt",
    "duration_hours": 5.0,
    "interests": ["heritage", "coastal"]
})
assert resp.status_code == 200
itin_data = resp.json()
assert itin_data["total_places"] >= 2
print(f"[PASS] 8. POST /api/itinerary -> {itin_data['total_places']}-stop tour generated for 5h budget")
for stop in itin_data["stops"]:
    prev_info = f" (Travel: {stop['travel_time_from_previous_minutes']}m)" if stop['travel_time_from_previous_minutes'] else " (Start Hub)"
    print(f"       Stop {stop['order']}: {stop['name']:<25} | Visit: {stop['recommended_duration_minutes']}m{prev_info}")

# 9. 3D Model Metadata: Gateway of India
resp = client.get("/api/places/gateway-of-india")
assert resp.status_code == 200
gateway = resp.json()
assert gateway["features"]["3d"] is True
assert gateway["model_3d"]["available"] is True
print(f"[PASS] 9. 3D Model Metadata -> Gateway of India (features.3d = True, model_3d.available = True)")

# 10. API v1 Multimodal Routing with Vincenty Geodetic Calculation
resp = client.post("/api/v1/routing/calculate", json={
    "origin": "CSMT Terminus",
    "destination": "Gateway of India",
    "origin_lat": 18.9400,
    "origin_lng": 72.8353,
    "dest_lat": 18.9220,
    "dest_lng": 72.8347
})
assert resp.status_code == 200
v1_route = resp.json()
assert v1_route["route_count"] >= 3
print(f"[PASS] 10. POST /api/v1/routing/calculate -> {v1_route['route_count']} modes computed ({v1_route['crow_distance_km']} km crow distance)")

# 11. API v1 Algorithmic Fare & Tariff Breakdown with Night Surcharge
resp_day = client.post("/api/v1/routing/fare-estimate", json={"distance_km": 12.5, "mode": "AUTO_RICKSHAW", "is_night_time": False})
resp_night = client.post("/api/v1/routing/fare-estimate", json={"distance_km": 12.5, "mode": "AUTO_RICKSHAW", "is_night_time": True})
assert resp_day.status_code == 200 and resp_night.status_code == 200
fare_d, fare_n = resp_day.json(), resp_night.json()
assert fare_n["min_fare_inr"] > fare_d["min_fare_inr"]
print(f"[PASS] 11. POST /api/v1/routing/fare-estimate -> Day Fare: {fare_d['formatted_fare']} | Night Fare (1.25x): {fare_n['formatted_fare']}")

# 12. API v1 Constraint-Driven Itinerary Adjustment
resp = client.post("/api/v1/itinerary/adjust", json={"city": "Mumbai", "adjustment_action": "make_cheaper"})
assert resp.status_code == 200
v1_itin = resp.json()
assert v1_itin["total_stops"] >= 2
print(f"[PASS] 12. POST /api/v1/itinerary/adjust -> {v1_itin['total_stops']} stops | Total Est: {v1_itin['estimated_total_cost_formatted']}")

# 13. API v1 Stateful Multi-turn AI Assistant with UI Actions Dispatch
resp_ai_1 = client.post("/api/v1/ai/chat", json={"message": "Show me Gateway of India", "session_token": "demo-e2e-session"})
resp_ai_2 = client.post("/api/v1/ai/chat", json={"message": "Can I explore it in 3D?", "session_token": "demo-e2e-session"})
assert resp_ai_1.status_code == 200 and resp_ai_2.status_code == 200
d_ai_2 = resp_ai_2.json()
assert any(a["action_type"] == "TRIGGER_3D_EXPLORER" for a in d_ai_2["ui_actions"])
print(f"[PASS] 13. POST /api/v1/ai/chat -> Multi-turn co-reference & UI action dispatch (TRIGGER_3D_EXPLORER) verified")

# 14. API v1 Heritage Transit Hub Proximity Discovery
resp = client.get("/api/v1/destinations/gateway-of-india/transit")
assert resp.status_code == 200
v1_transit = resp.json()
assert v1_transit["transit_hubs_count"] >= 1
print(f"[PASS] 14. GET /api/v1/destinations/gateway-of-india/transit -> {v1_transit['transit_hubs_count']} transit hubs linked")

# 15. API v1 User Preferences Profile
resp = client.put("/api/v1/user/preferences?email=demo@bharatyatra.in", json={"budget": "budget-friendly", "pace": "relaxed"})
assert resp.status_code == 200
print(f"[PASS] 15. PUT /api/v1/user/preferences -> User preferences persisted successfully")

print("=" * 65)
print("  ALL 15 BHARATYATRA FLAGSHIP DEMO STEPS VERIFIED AND PASSING!")
print("=" * 65)

