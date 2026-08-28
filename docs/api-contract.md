# CodeNova-SIH-2026 API Contract

> **Note**: This document specifies the planned REST API contract between the React Frontend and the FastAPI Backend. These endpoints represent the specification baseline and are not yet implemented.

---

## Base URL
```
http://localhost:8000
```

All API routes are prefixed with `/api`.

---

## Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/states` | Retrieve list of all states and union territories |
| `GET` | `/api/places` | Retrieve list of tourist destinations / places |
| `GET` | `/api/places/{id}` | Retrieve detailed information for a specific place by ID |
| `GET` | `/api/places?state={state}` | Retrieve places filtered by state/UT |
| `GET` | `/api/places?category={category}` | Retrieve places filtered by category |
| `GET` | `/api/search?q={query}` | Search places across names, descriptions, and tags |
| `POST` | `/api/ai/chat` | Interact with the AI Tourism Assistant |

---

## Endpoint Specifications

### 1. Get States
- **Route**: `GET /api/states`
- **Description**: Returns all supported states and union territories with high-level metadata.
- **Query Parameters**: None

#### Response (`200 OK`)
```json
[
  {
    "id": "rajasthan",
    "name": "Rajasthan",
    "capital": "Jaipur",
    "region": "North India",
    "total_places": 45,
    "thumbnail_url": "https://example.com/images/rajasthan.jpg"
  }
]
```

---

### 2. Get Places (All / Filtered)
- **Route**: `GET /api/places`
- **Description**: Returns a paginated/filtered list of tourist locations.
- **Query Parameters**:
  - `state` *(optional, string)*: Filter places by state code or name (e.g. `rajasthan`, `kerala`).
  - `category` *(optional, string)*: Filter places by category (e.g. `heritage`, `nature`, `spiritual`, `adventure`).
  - `limit` *(optional, integer, default: 20)*: Maximum number of records to return.
  - `offset` *(optional, integer, default: 0)*: Pagination offset.

#### Example Requests
- `GET /api/places`
- `GET /api/places?state=rajasthan`
- `GET /api/places?category=heritage`
- `GET /api/places?state=rajasthan&category=heritage`

#### Response (`200 OK`)
```json
{
  "total": 1,
  "limit": 20,
  "offset": 0,
  "data": [
    {
      "id": "hawa-mahal",
      "name": "Hawa Mahal",
      "state": "Rajasthan",
      "city": "Jaipur",
      "category": "heritage",
      "summary": "Palace of Winds made with red and pink sandstone.",
      "coordinates": {
        "lat": 26.9239,
        "lng": 75.8267
      },
      "rating": 4.6,
      "thumbnail_url": "https://example.com/images/hawa-mahal.jpg"
    }
  ]
}
```

---

### 3. Get Place Details by ID
- **Route**: `GET /api/places/{id}`
- **Description**: Returns detailed information for a single tourist location, including multimedia links, 3D model references, and visiting hours.
- **Path Parameters**:
  - `id` *(required, string)*: Unique identifier of the place (e.g. `hawa-mahal`).

#### Response (`200 OK`)
```json
{
  "id": "hawa-mahal",
  "name": "Hawa Mahal",
  "state": "Rajasthan",
  "city": "Jaipur",
  "category": "heritage",
  "description": "Hawa Mahal is a palace in the city of Jaipur, India. Built from red and pink sandstone...",
  "coordinates": {
    "lat": 26.9239,
    "lng": 75.8267
  },
  "best_time_to_visit": "October to March",
  "visiting_hours": "09:00 AM - 05:00 PM",
  "entry_fee": {
    "domestic": 50,
    "international": 200,
    "currency": "INR"
  },
  "images": [
    "https://example.com/images/hawa-mahal-1.jpg",
    "https://example.com/images/hawa-mahal-2.jpg"
  ],
  "model_3d": {
    "has_model": true,
    "model_url": "https://example.com/models/hawa-mahal.glb"
  },
  "tags": ["palace", "architecture", "pink-city", "unesco"]
}
```

#### Error Response (`404 Not Found`)
```json
{
  "detail": "Place not found"
}
```

---

### 4. Search Places
- **Route**: `GET /api/search`
- **Description**: Performs keyword search across place names, cities, states, descriptions, and tags.
- **Query Parameters**:
  - `q` *(required, string)*: Search keyword or phrase.
  - `limit` *(optional, integer, default: 20)*: Result limit.

#### Example Request
- `GET /api/search?q=fort`

#### Response (`200 OK`)
```json
{
  "query": "fort",
  "count": 1,
  "results": [
    {
      "id": "amber-fort",
      "name": "Amber Fort",
      "state": "Rajasthan",
      "city": "Jaipur",
      "category": "heritage",
      "match_score": 0.95
    }
  ]
}
```

---

### 5. AI Tourism Assistant Chat
- **Route**: `POST /api/ai/chat`
- **Description**: Sends a conversational prompt to the AI Tourism Assistant to get recommendations, trip itineraries, and answers to tourism questions.
- **Headers**:
  - `Content-Type: application/json`

#### Request Body
```json
{
  "message": "Plan a 3-day cultural trip to Jaipur with heritage sites.",
  "conversation_id": "conv-12345",
  "context": {
    "state": "Rajasthan",
    "budget": "medium",
    "travelers": 2
  }
}
```

#### Response (`200 OK`)
```json
{
  "conversation_id": "conv-12345",
  "reply": "Here is a curated 3-day itinerary for Jaipur...",
  "suggested_places": [
    {
      "id": "hawa-mahal",
      "name": "Hawa Mahal"
    },
    {
      "id": "amber-fort",
      "name": "Amber Fort"
    }
  ],
  "sources": ["Tourism Department Database"]
}
```

#### Error Response (`400 Bad Request`)
```json
{
  "detail": "Message field cannot be empty"
}
```
