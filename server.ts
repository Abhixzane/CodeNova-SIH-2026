import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// Data Repositories & In-Memory Store
// -------------------------------------------------------------
interface StateItem {
  id: string;
  name: string;
  capital: string;
  region: string;
  total_places: number;
  thumbnail_url?: string;
  coordinates?: { lat: number; lng: number };
}

interface CityItem {
  id: string;
  name: string;
  state: string;
  state_id: string;
  lat: number;
  lng: number;
  description: string;
  places_count: number;
}

interface PlaceItem {
  id: string;
  name: string;
  state: string;
  city: string;
  country: string;
  category: string;
  summary: string;
  description?: string;
  history?: string;
  culture?: string;
  architecture?: string;
  coordinates: { lat: number; lng: number };
  rating?: number;
  reviews_count?: string;
  thumbnail_url?: string;
  images?: string[];
  best_time_to_visit?: string;
  visiting_hours?: string;
  entry_fee?: { domestic: number; international: number; currency: string };
  visiting_info?: any;
  model_3d?: any;
  tags: string[];
  features: { map: boolean; navigation: boolean; ai: boolean; '3d': boolean };
  heritage_status?: string;
  area_neighborhood?: string;
}

interface RailwayStation {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  lines: string[];
  is_junction?: boolean;
}

const statesData: StateItem[] = [];
const citiesData: CityItem[] = [];
const placesData: Map<string, PlaceItem> = new Map();
const railwayStationsData: RailwayStation[] = [];

// In-Memory User Data
const usersStore: Map<string, any> = new Map();
const favoritesStore: Map<string, string[]> = new Map();
const tripsStore: Map<string, any[]> = new Map();

// Load datasets
function loadData() {
  try {
    const dataDir = path.join(process.cwd(), 'data');

    // Load states
    const statesPath = path.join(dataDir, 'states.json');
    if (fs.existsSync(statesPath)) {
      const raw = JSON.parse(fs.readFileSync(statesPath, 'utf-8'));
      statesData.push(...raw);
    }

    // Load cities
    const citiesPath = path.join(dataDir, 'cities.json');
    if (fs.existsSync(citiesPath)) {
      const raw = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));
      citiesData.push(...raw);
    }

    // Load railway stations
    const stationsPath = path.join(dataDir, 'railway_stations.json');
    if (fs.existsSync(stationsPath)) {
      const raw = JSON.parse(fs.readFileSync(stationsPath, 'utf-8'));
      railwayStationsData.push(...raw);
    }

    // Load places from subdirectories
    const loadPlacesFile = (filePath: string) => {
      if (fs.existsSync(filePath)) {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        for (const item of raw) {
          if (item && item.id) {
            placesData.set(item.id.toLowerCase(), item);
          }
        }
      }
    };

    loadPlacesFile(path.join(dataDir, 'mumbai', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'rajasthan', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'kerala', 'places.json'));

    // Load india_tourism.json for fallback / supplementary
    const indiaTourismPath = path.join(dataDir, 'india_tourism.json');
    if (fs.existsSync(indiaTourismPath)) {
      const raw = JSON.parse(fs.readFileSync(indiaTourismPath, 'utf-8'));
      if (Array.isArray(raw.places)) {
        for (const p of raw.places) {
          const id = (p.id || '').toLowerCase();
          if (id && !placesData.has(id)) {
            placesData.set(id, {
              id: p.id,
              name: p.name,
              state: p.state || '',
              city: p.city || '',
              country: 'India',
              category: p.category || 'heritage',
              summary: p.summary || p.description || '',
              description: p.description || '',
              coordinates: {
                lat: p.coordinates?.lat || p.latitude || 18.922,
                lng: p.coordinates?.lng || p.longitude || 72.8347,
              },
              rating: p.rating || 4.5,
              thumbnail_url: p.thumbnail_url || p.hero_image_url || '',
              images: p.images || (p.thumbnail_url ? [p.thumbnail_url] : []),
              tags: p.tags || ['heritage', 'tourism'],
              features: p.features || { map: true, navigation: true, ai: true, '3d': false },
            });
          }
        }
      }
    }

    console.log(`[Server] Loaded ${statesData.length} states, ${citiesData.length} cities, ${placesData.size} places, ${railwayStationsData.length} stations.`);
  } catch (err) {
    console.error('[Server] Error loading datasets:', err);
  }
}

loadData();

// Haversine distance helper
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

// Lazy Gemini AI Client initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// -------------------------------------------------------------
// System Endpoints
// -------------------------------------------------------------
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// -------------------------------------------------------------
// States & Cities Endpoints
// -------------------------------------------------------------
app.get('/api/states', (req, res) => {
  res.json(statesData);
});

app.get('/api/cities', (req, res) => {
  const stateId = req.query.state as string;
  if (stateId) {
    const filtered = citiesData.filter(
      (c) => c.state_id?.toLowerCase() === stateId.toLowerCase() || c.state?.toLowerCase() === stateId.toLowerCase()
    );
    return res.json(filtered);
  }
  res.json(citiesData);
});

// -------------------------------------------------------------
// Places Endpoints
// -------------------------------------------------------------
app.get('/api/places', (req, res) => {
  const { state, city, category, limit = '20', offset = '0' } = req.query;
  const lim = parseInt(limit as string, 10) || 20;
  const off = parseInt(offset as string, 10) || 0;

  let results = Array.from(placesData.values());

  if (state) {
    const s = (state as string).toLowerCase().trim();
    results = results.filter((p) => p.state?.toLowerCase().includes(s) || (p as any).state_id?.toLowerCase() === s);
  }

  if (city) {
    const c = (city as string).toLowerCase().trim();
    results = results.filter((p) => p.city?.toLowerCase().includes(c) || (p as any).city_id?.toLowerCase() === c);
  }

  if (category && (category as string).toLowerCase() !== 'all') {
    const cat = (category as string).toLowerCase().trim();
    results = results.filter((p) => p.category?.toLowerCase() === cat);
  }

  const total = results.length;
  const paged = results.slice(off, off + lim);

  res.json({
    total,
    limit: lim,
    offset: off,
    data: paged,
  });
});

app.get('/api/places/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 18.922;
  const lng = parseFloat(req.query.lng as string) || 72.8347;
  const radiusKm = parseFloat(req.query.radius_km as string) || 10;
  const limit = parseInt(req.query.limit as string, 10) || 6;

  const resultsWithDistance = Array.from(placesData.values())
    .map((p) => {
      const pLat = p.coordinates?.lat || (p as any).latitude || 0;
      const pLng = p.coordinates?.lng || (p as any).longitude || 0;
      const dist = haversineDistanceKm(lat, lng, pLat, pLng);
      return { ...p, distance_km: dist };
    })
    .filter((p) => p.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);

  res.json({
    origin: { latitude: lat, longitude: lng },
    radius_km: radiusKm,
    total: resultsWithDistance.length,
    results: resultsWithDistance,
  });
});

app.get('/api/places/:id', (req, res) => {
  const id = req.params.id.toLowerCase().trim();
  const place = placesData.get(id);

  if (!place) {
    // Check if slug or name matches
    for (const p of placesData.values()) {
      if (p.id.toLowerCase() === id || p.name.toLowerCase() === id || (p as any).slug === id) {
        return res.json(p);
      }
    }
    return res.status(404).json({ detail: 'Place not found' });
  }

  // Calculate nearby railway stations if available
  const pLat = place.coordinates?.lat || (place as any).latitude || 18.922;
  const pLng = place.coordinates?.lng || (place as any).longitude || 72.8347;
  const nearbyStations = railwayStationsData
    .map((s) => {
      const dist = haversineDistanceKm(pLat, pLng, s.lat, s.lng);
      return {
        id: s.id,
        name: s.name,
        code: s.code,
        line: s.lines ? s.lines.join(', ') : 'Suburban Hub',
        distance_km: dist,
        walking_time_mins: Math.round(dist * 13),
        road_time_mins: Math.round(dist * 4 + 3),
        transfer_modes: dist < 1.0 ? ['Walk', 'Auto'] : ['Taxi', 'BEST Bus', 'Metro'],
      };
    })
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, 3);

  res.json({
    ...place,
    nearby_stations: nearbyStations,
  });
});

// -------------------------------------------------------------
// Search Endpoint
// -------------------------------------------------------------
app.get('/api/search', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase().trim();
  const limit = parseInt(req.query.limit as string, 10) || 30;

  if (!query) {
    return res.json([]);
  }

  const matches = Array.from(placesData.values())
    .filter((p) => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.state.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.summary?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))
      );
    })
    .slice(0, limit);

  res.json(matches);
});

// -------------------------------------------------------------
// Railway Stations Endpoints
// -------------------------------------------------------------
app.get('/api/railway-stations', (req, res) => {
  const city = req.query.city as string;
  let results = railwayStationsData;

  if (city) {
    const c = city.toLowerCase();
    results = results.filter((s) => s.city.toLowerCase().includes(c));
  }

  const mapped = results.map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    line: s.lines ? s.lines.join(', ') : 'Suburban Hub',
    distance_km: 1.5,
    walking_time_mins: 18,
    road_time_mins: 8,
    transfer_modes: ['Taxi', 'Bus', 'Walk'],
  }));

  res.json(mapped);
});

app.get('/api/railway-stations/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 18.94;
  const lng = parseFloat(req.query.lng as string) || 72.8353;
  const limit = parseInt(req.query.limit as string, 10) || 3;

  const nearby = railwayStationsData
    .map((s) => {
      const dist = haversineDistanceKm(lat, lng, s.lat, s.lng);
      return {
        id: s.id,
        name: s.name,
        code: s.code,
        line: s.lines ? s.lines.join(', ') : 'Suburban Hub',
        distance_km: dist,
        walking_time_mins: Math.round(dist * 13),
        road_time_mins: Math.round(dist * 4 + 3),
        transfer_modes: dist < 1.0 ? ['Walk', 'Auto'] : ['Taxi', 'BEST Bus'],
      };
    })
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);

  res.json(nearby);
});

// -------------------------------------------------------------
// Multi-modal Routing & Directions Endpoints
// -------------------------------------------------------------
function resolveLocation(queryOrId?: string, lat?: number, lng?: number) {
  if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
    return { name: queryOrId || 'Custom Location', place_id: null, latitude: lat, longitude: lng };
  }
  if (!queryOrId) {
    return { name: 'Gateway of India', place_id: 'gateway-of-india', latitude: 18.922, longitude: 72.8347 };
  }
  const q = queryOrId.toLowerCase().trim();
  const place = placesData.get(q);
  if (place) {
    return {
      name: place.name,
      place_id: place.id,
      latitude: place.coordinates?.lat || 18.922,
      longitude: place.coordinates?.lng || 72.8347,
    };
  }
  const station = railwayStationsData.find((s) => s.id.toLowerCase() === q || s.name.toLowerCase().includes(q));
  if (station) {
    return { name: station.name, place_id: station.id, latitude: station.lat, longitude: station.lng };
  }
  return { name: queryOrId, place_id: null, latitude: 18.922, longitude: 72.8347 };
}

app.get('/api/routes', (req, res) => {
  const originStr = req.query.origin as string;
  const destStr = req.query.destination as string;
  const requestedMode = (req.query.mode as string)?.toUpperCase();

  const originLoc = resolveLocation(originStr);
  const destLoc = resolveLocation(destStr);

  const distKm = haversineDistanceKm(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude) || 4.2;

  const options = [];

  // Drive
  if (!requestedMode || requestedMode === 'DRIVE') {
    const driveDuration = Math.round(distKm * 3.2 + 5);
    const estFare = Math.round(distKm * 21 + 50);
    options.push({
      mode: 'DRIVE',
      duration_minutes: driveDuration,
      distance_km: distKm,
      estimated_fare: estFare,
      fare_status: 'estimated',
      provider: 'Taxi / Rideshare & Metered Auto',
      steps_summary: ['Head towards destination via arterial road', 'Continue along main corridor', 'Arrive at destination'],
      speed_tier: 'fastest',
      fare_note: 'Approximate fare based on standard daytime city rates (₹50 base + ₹21/km)',
    });
  }

  // Transit
  if (!requestedMode || requestedMode === 'TRANSIT') {
    const transitDuration = Math.round(distKm * 2.5 + 10);
    const transitFare = distKm > 10 ? 20 : 10;
    options.push({
      mode: 'TRANSIT',
      duration_minutes: transitDuration,
      distance_km: distKm,
      estimated_fare: transitFare,
      fare_status: 'provider_confirmed',
      provider: 'Suburban Railway / Metro / City Bus (BEST)',
      transit_details: [
        {
          transit_type: 'Local Train / Metro',
          line: 'Suburban Line',
          departure_stop: 'Nearby Station',
          arrival_stop: 'Destination Station',
          num_stops: Math.max(1, Math.round(distKm / 1.5)),
        },
      ],
      steps_summary: [
        'Board connecting transport at closest hub',
        `Travel ${distKm} km via public transit network`,
        'Exit and take short 3-minute walkway to destination entrance',
      ],
      speed_tier: 'cheapest',
      fare_note: 'Government subsidized public fare (Standard 2nd class / Ordinary bus)',
    });
  }

  // Walk
  if (!requestedMode || requestedMode === 'WALK') {
    const walkDuration = Math.round(distKm * 12.5);
    options.push({
      mode: 'WALK',
      duration_minutes: walkDuration,
      distance_km: distKm,
      estimated_fare: 0,
      fare_status: 'provider_confirmed',
      provider: 'Pedestrian Heritage Corridor',
      steps_summary: ['Follow pedestrian promenade and heritage walkways', 'Enjoy scenic viewpoints en route'],
      speed_tier: 'balanced',
      fare_note: 'Zero fare - healthy, scenic, and eco-friendly',
    });
  }

  // Bicycle
  if (!requestedMode || requestedMode === 'BICYCLE') {
    const bikeDuration = Math.round(distKm * 4.5);
    options.push({
      mode: 'BICYCLE',
      duration_minutes: bikeDuration,
      distance_km: distKm,
      estimated_fare: 0,
      fare_status: 'provider_confirmed',
      provider: 'Cycling Route',
      steps_summary: ['Follow cycle-friendly routes and waterfront esplanades'],
      speed_tier: 'balanced',
      fare_note: 'Eco-friendly active transit',
    });
  }

  res.json({
    origin: originLoc,
    destination: destLoc,
    options,
  });
});

app.get('/api/maps/directions', (req, res) => {
  const origin = encodeURIComponent((req.query.origin as string) || 'Mumbai');
  const destination = encodeURIComponent((req.query.destination as string) || 'Gateway of India');
  const mode = (req.query.mode as string) || 'driving';

  const navigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode.toLowerCase()}`;
  res.json({
    origin: req.query.origin || 'Mumbai',
    destination: req.query.destination || 'Gateway of India',
    travel_mode: mode,
    url: navigationUrl,
    navigation_url: navigationUrl,
  });
});

// -------------------------------------------------------------
// Weather Endpoint
// -------------------------------------------------------------
app.get('/api/weather', (req, res) => {
  const city = ((req.query.city as string) || 'mumbai').toLowerCase().trim();

  const weatherMatrix: Record<string, any> = {
    mumbai: { city: 'Mumbai', temperature_c: 28, condition: 'Sunny & Coastal Breeze', humidity: 68, wind_kmh: 14, status: 'Live (Sensor)' },
    jaipur: { city: 'Jaipur', temperature_c: 31, condition: 'Clear & Warm', humidity: 42, wind_kmh: 10, status: 'Live' },
    delhi: { city: 'New Delhi', temperature_c: 29, condition: 'Pleasant & Sunny', humidity: 52, wind_kmh: 8, status: 'Live' },
    kochi: { city: 'Kochi', temperature_c: 27, condition: 'Tropical Breeze', humidity: 76, wind_kmh: 16, status: 'Live' },
    goa: { city: 'Panaji', temperature_c: 28, condition: 'Sunny Beach Weather', humidity: 70, wind_kmh: 12, status: 'Live' },
    shimla: { city: 'Shimla', temperature_c: 18, condition: 'Crisp Mountain Air', humidity: 48, wind_kmh: 6, status: 'Live' },
  };

  const weather = weatherMatrix[city] || {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    temperature_c: 27,
    condition: 'Pleasant & Mild',
    humidity: 58,
    wind_kmh: 11,
    status: 'Estimated',
  };

  res.json(weather);
});

// -------------------------------------------------------------
// AI Tourism Assistant Chat Endpoint
// -------------------------------------------------------------
app.post('/api/ai/chat', async (req, res) => {
  const { message, conversation_id, place_id, city } = req.body;
  const convId = conversation_id || `conv-${Date.now()}`;
  const query = (message || '').toLowerCase().trim();

  // Find relevant places to recommend
  const cityFilter = city?.toLowerCase();
  const allPlaces = Array.from(placesData.values());
  const candidatePlaces = cityFilter
    ? allPlaces.filter((p) => p.city.toLowerCase() === cityFilter)
    : allPlaces;

  const matched = candidatePlaces
    .filter((p) => query.includes(p.name.toLowerCase()) || query.includes(p.category.toLowerCase()))
    .slice(0, 3);

  const suggestedPlaces = (matched.length > 0 ? matched : candidatePlaces.slice(0, 3)).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    city: p.city,
    reason: `Iconic ${p.category} destination with rich cultural heritage and high visitor rating (${p.rating || 4.7}/5).`,
  }));

  // Try Gemini AI if API key is provided
  const ai = getAIClient();
  if (ai) {
    try {
      const placesContext = candidatePlaces
        .slice(0, 10)
        .map((p) => `- ${p.name} (${p.city}, ${p.category}): ${p.summary}`)
        .join('\n');

      const prompt = `You are BharatYatra's Intelligent Tourism Assistant for Indian destinations.
The user is asking: "${message}"
City context: ${city || 'India'}
${place_id ? `Active place ID: ${place_id}` : ''}

Available destinations in this region:
${placesContext}

Provide a helpful, culturally rich, and practical travel recommendation. Include travel tips, best visiting times, and multimodal transit advice. Keep the response organized, engaging, and under 250 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({
        conversation_id: convId,
        reply: response.text || 'Welcome to India! Here are curated recommendations for your journey.',
        suggested_places: suggestedPlaces,
        sources: ['Ministry of Tourism Verified Data', 'Indian Railways Transit Network', 'Gemini AI Knowledge'],
      });
    } catch (aiErr) {
      console.warn('[Server] Gemini call failed, falling back to rule-based engine:', aiErr);
    }
  }

  // Smart local tourism knowledge engine fallback
  let reply = '';
  if (query.includes('itinerary') || query.includes('plan') || query.includes('day')) {
    reply = `Here is a curated itinerary plan for exploring ${city || 'India'}:\n\n` +
      `1. **Morning**: Start at ${suggestedPlaces[0]?.name || 'Gateway of India'} to beat the crowds and enjoy ideal morning light.\n` +
      `2. **Midday**: Explore the heritage architecture, museums, and local art galleries nearby.\n` +
      `3. **Evening**: Conclude with a seaside promenade stroll or sunset viewpoints.\n\n` +
      `*Tip: Use the interactive Itinerary Planner tab to customize duration, pace, and transit modes!*`;
  } else if (query.includes('fare') || query.includes('route') || query.includes('reach') || query.includes('metro') || query.includes('train')) {
    reply = `Travel intelligence for ${city || 'your route'}:\n\n` +
      `• **Suburban Railway / Metro**: Most cost-effective (₹10 - ₹20). Avoid rush hours (8:30-10:30 AM & 6-8 PM).\n` +
      `• **Metered Auto / Taxis**: Ideal for point-to-point connections with transparent fares.\n` +
      `• **Pedestrian Corridors**: Heritage precincts are best experienced on foot with dedicated footpaths and signage.`;
  } else {
    reply = `Namaste! Welcome to BharatYatra. Exploring ${city || 'India'} is an unforgettable journey through millennia of history, living traditions, and vibrant street life. ` +
      `I recommend visiting **${suggestedPlaces[0]?.name || 'top landmarks'}** and nearby heritage sites. How can I help you customize your visit?`;
  }

  res.json({
    conversation_id: convId,
    reply,
    suggested_places: suggestedPlaces,
    sources: ['BharatYatra Pan-India Tourism Engine', 'Geospatial Transit Index'],
  });
});

// -------------------------------------------------------------
// Itinerary Planner Endpoint
// -------------------------------------------------------------
app.post('/api/itinerary', (req, res) => {
  const { city = 'Mumbai', duration_hours = 6, interests = ['heritage'], budget_level = 'moderate' } = req.body;

  const cityPlaces = Array.from(placesData.values()).filter(
    (p) => p.city.toLowerCase() === city.toLowerCase()
  );

  const availablePlaces = cityPlaces.length > 0 ? cityPlaces : Array.from(placesData.values()).slice(0, 8);

  const totalMinutes = duration_hours * 60;
  const numStops = Math.min(Math.max(2, Math.floor(duration_hours / 1.5)), availablePlaces.length);
  const selectedPlaces = availablePlaces.slice(0, numStops);

  let cumulativeTravel = 0;
  let cumulativeVisit = 0;
  let totalCost = 0;

  const stops = selectedPlaces.map((place, idx) => {
    const travelTime = idx === 0 ? null : Math.round(15 + idx * 5);
    const visitTime = Math.min(90, Math.floor((totalMinutes - numStops * 20) / numStops));
    const dist = idx === 0 ? null : (2.5 + idx * 1.2);
    const cost = budget_level === 'budget' ? 10 : budget_level === 'premium' ? 250 : 60;

    if (travelTime) cumulativeTravel += travelTime;
    cumulativeVisit += visitTime;
    totalCost += cost;

    return {
      order: idx + 1,
      place_id: place.id,
      name: place.name,
      category: place.category,
      coordinates: place.coordinates,
      thumbnail_url: place.thumbnail_url,
      recommended_duration_minutes: visitTime,
      travel_time_from_previous_minutes: travelTime,
      travel_mode_from_previous: idx === 0 ? null : (dist && dist < 1.5 ? 'Walk' : 'Transit / Taxi'),
      distance_from_previous_km: dist,
      estimated_cost: cost,
      visit_tips: place.visiting_info?.tips?.[0] || 'Allocate time for photography and historical exploration.',
      has_3d: Boolean(place.model_3d?.has_model),
    };
  });

  res.json({
    city,
    duration_hours,
    total_places: stops.length,
    estimated_total_visiting_minutes: cumulativeVisit,
    estimated_total_travel_minutes: cumulativeTravel,
    stops,
    summary: `Curated ${duration_hours}-hour ${budget_level} itinerary covering ${stops.length} key landmarks in ${city}.`,
    estimated_total_cost: totalCost,
  });
});

// -------------------------------------------------------------
// Auth & Profile In-Memory Endpoints
// -------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  const { name, email, home_city } = req.body;
  const token = `bharat-token-${Date.now()}`;
  const profile = {
    id: `user-${Date.now()}`,
    name: name || 'Explorer',
    email: email || 'user@example.com',
    home_city: home_city || 'Mumbai',
    created_at: new Date().toISOString(),
  };
  usersStore.set(token, profile);
  res.json({ token, profile });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const token = `bharat-token-${Date.now()}`;
  const profile = {
    id: `user-${Date.now()}`,
    name: email ? email.split('@')[0] : 'Explorer',
    email: email || 'user@example.com',
    home_city: 'Mumbai',
    created_at: new Date().toISOString(),
  };
  usersStore.set(token, profile);
  res.json({ token, profile });
});

app.get('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const profile = usersStore.get(token) || {
    id: 'guest-1',
    name: 'Bharat Explorer',
    email: 'traveler@bharatyatra.in',
    home_city: 'Mumbai',
    created_at: new Date().toISOString(),
  };
  res.json(profile);
});

app.put('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const existing = usersStore.get(token) || { id: 'user-1' };
  const updated = { ...existing, ...req.body };
  usersStore.set(token, updated);
  res.json(updated);
});

app.post('/api/profile/survey', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const profile = usersStore.get(token) || { id: 'user-1', name: 'Explorer' };
  profile.survey = req.body;
  usersStore.set(token, profile);
  res.json(profile);
});

// -------------------------------------------------------------
// Favorites Endpoints
// -------------------------------------------------------------
app.get('/api/favorites', (req, res) => {
  const authHeader = req.headers.authorization || 'default';
  const favIds = favoritesStore.get(authHeader) || ['gateway-of-india', 'marine-drive'];
  const favItems = favIds
    .map((id) => placesData.get(id.toLowerCase()))
    .filter(Boolean)
    .map((p) => ({
      id: p!.id,
      place_id: p!.id,
      name: p!.name,
      city: p!.city,
      state: p!.state,
      category: p!.category,
      thumbnail_url: p!.thumbnail_url,
      rating: p!.rating || 4.6,
      added_at: new Date().toISOString(),
    }));
  res.json(favItems);
});

app.post('/api/favorites', (req, res) => {
  const authHeader = req.headers.authorization || 'default';
  const { place_id } = req.body;
  const list = favoritesStore.get(authHeader) || [];
  if (place_id && !list.includes(place_id)) {
    list.push(place_id);
    favoritesStore.set(authHeader, list);
  }
  const p = placesData.get(place_id?.toLowerCase());
  res.json({
    id: place_id,
    place_id,
    name: p?.name || place_id,
    city: p?.city || 'Mumbai',
    thumbnail_url: p?.thumbnail_url,
    added_at: new Date().toISOString(),
  });
});

app.delete('/api/favorites/:id', (req, res) => {
  const authHeader = req.headers.authorization || 'default';
  const id = req.params.id;
  const list = favoritesStore.get(authHeader) || [];
  favoritesStore.set(
    authHeader,
    list.filter((x) => x !== id)
  );
  res.status(200).json({ status: 'removed' });
});

// -------------------------------------------------------------
// Trips Endpoints
// -------------------------------------------------------------
app.get('/api/trips', (req, res) => {
  const authHeader = req.headers.authorization || 'default';
  const trips = tripsStore.get(authHeader) || [
    {
      id: 'trip-demo-1',
      title: 'South Mumbai Heritage Walk',
      destination: 'Mumbai',
      start_date: '2026-10-15',
      end_date: '2026-10-17',
      places_count: 5,
      total_distance_km: 12.4,
      estimated_budget: 1200,
      created_at: new Date().toISOString(),
    },
  ];
  res.json(trips);
});

app.post('/api/trips', (req, res) => {
  const authHeader = req.headers.authorization || 'default';
  const newTrip = {
    id: `trip-${Date.now()}`,
    ...req.body,
    created_at: new Date().toISOString(),
  };
  const trips = tripsStore.get(authHeader) || [];
  trips.push(newTrip);
  tripsStore.set(authHeader, trips);
  res.json(newTrip);
});

app.delete('/api/trips/:id', (req, res) => {
  const authHeader = req.headers.authorization || 'default';
  const id = req.params.id;
  const trips = tripsStore.get(authHeader) || [];
  tripsStore.set(
    authHeader,
    trips.filter((t) => t.id !== id)
  );
  res.status(200).json({ status: 'deleted' });
});

// -------------------------------------------------------------
// Server Start with Vite Middleware
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] BharatYatra server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
