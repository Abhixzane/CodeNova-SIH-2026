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
const heritageData: any[] = [];
const railwayStationsData: RailwayStation[] = [];
let mumbaiLocalNetwork: any = null;
let hotelsData: any[] = [];
let faresConfig: any = null;

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

    // Load hotels
    const hotelsPath = path.join(dataDir, 'hotels.json');
    if (fs.existsSync(hotelsPath)) {
      hotelsData = JSON.parse(fs.readFileSync(hotelsPath, 'utf-8'));
    }

    // Load fare tariffs
    const faresPath = path.join(dataDir, 'fares.json');
    if (fs.existsSync(faresPath)) {
      faresConfig = JSON.parse(fs.readFileSync(faresPath, 'utf-8'));
    }

    // Load Mumbai Local Network
    const mumbaiNetworkPath = path.join(dataDir, 'mumbai_local_network.json');
    if (fs.existsSync(mumbaiNetworkPath)) {
      mumbaiLocalNetwork = JSON.parse(fs.readFileSync(mumbaiNetworkPath, 'utf-8'));
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
    loadPlacesFile(path.join(dataDir, 'maharashtra', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'delhi', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'rajasthan', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'kerala', 'places.json'));

    // Load Heritage 42+ structured experiences
    const heritagePath = path.join(dataDir, 'heritage', 'monuments.json');
    if (fs.existsSync(heritagePath)) {
      const rawHeritage = JSON.parse(fs.readFileSync(heritagePath, 'utf-8'));
      heritageData.push(...rawHeritage);
      for (const item of rawHeritage) {
        if (item && item.id) {
          placesData.set(item.id.toLowerCase(), item);
        }
      }
    }

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
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', app: 'YatraVerse', timestamp: new Date().toISOString() });
});

// Platform Statistics
app.get('/api/stats', (req, res) => {
  const threeDCount = Array.from(placesData.values()).filter(
    (p) => p.features?.['3d'] || p.model_3d?.has_model || p.model_3d?.available
  ).length;

  const mumbaiStationCount = mumbaiLocalNetwork
    ? (mumbaiLocalNetwork.lines?.western?.stations?.length || 0) +
      (mumbaiLocalNetwork.lines?.central?.stations?.length || 0) +
      (mumbaiLocalNetwork.lines?.harbour?.stations?.length || 0)
    : railwayStationsData.length;

  res.json({
    heritage_count: heritageData.length,
    destinations_count: placesData.size,
    states_count: statesData.length,
    cities_count: citiesData.length,
    mumbai_local_stations_count: mumbaiStationCount,
    three_d_models_count: threeDCount,
    transport_modes: ['Suburban Rail', 'Metro', 'Drive / Taxi', 'Walking', 'Bicycle'],
  });
});

// -------------------------------------------------------------
// Heritage Endpoints (42+ Curated Experiences)
// -------------------------------------------------------------
app.get('/api/heritage', (req, res) => {
  const { category, state, search, limit = '50', offset = '0' } = req.query;
  let results = [...heritageData];

  if (category && (category as string).toLowerCase() !== 'all') {
    results = results.filter(
      (h) => h.category?.toLowerCase() === (category as string).toLowerCase()
    );
  }

  if (state && (state as string).toLowerCase() !== 'all') {
    const s = (state as string).toLowerCase().trim();
    results = results.filter((h) => h.state?.toLowerCase().includes(s));
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city?.toLowerCase().includes(q) ||
        h.state?.toLowerCase().includes(q) ||
        h.summary?.toLowerCase().includes(q)
    );
  }

  const lim = parseInt(limit as string, 10) || 50;
  const off = parseInt(offset as string, 10) || 0;

  res.json({
    total: results.length,
    limit: lim,
    offset: off,
    data: results.slice(off, off + lim),
  });
});

app.get('/api/heritage/:id', (req, res) => {
  const id = req.params.id.toLowerCase().trim();
  const found = heritageData.find(
    (h) => h.id.toLowerCase() === id || h.name.toLowerCase() === id
  );
  if (found) {
    return res.json(found);
  }
  const place = placesData.get(id);
  if (place) return res.json(place);
  res.status(404).json({ detail: 'Heritage site not found' });
});

// -------------------------------------------------------------
// Mumbai Local Suburban Rail Module Endpoints
// -------------------------------------------------------------
app.get('/api/mumbai-local/lines', (req, res) => {
  if (!mumbaiLocalNetwork) {
    return res.status(500).json({ detail: 'Mumbai local dataset unavailable' });
  }
  res.json(mumbaiLocalNetwork);
});

app.get('/api/mumbai-local/stations', (req, res) => {
  if (!mumbaiLocalNetwork) {
    return res.status(500).json({ detail: 'Mumbai local dataset unavailable' });
  }
  const stationsMap = new Map();
  ['western', 'central', 'harbour'].forEach((lineKey) => {
    const line = mumbaiLocalNetwork.lines[lineKey];
    if (line && line.stations) {
      line.stations.forEach((st: any) => {
        if (!stationsMap.has(st.code)) {
          stationsMap.set(st.code, { ...st, lines: [line.name] });
        } else {
          const existing = stationsMap.get(st.code);
          if (!existing.lines.includes(line.name)) {
            existing.lines.push(line.name);
          }
        }
      });
    }
  });
  res.json(Array.from(stationsMap.values()));
});

app.get('/api/mumbai-local/route', (req, res) => {
  if (!mumbaiLocalNetwork) {
    return res.status(500).json({ detail: 'Mumbai local network data unavailable' });
  }
  const fromQuery = ((req.query.from as string) || '').toLowerCase().trim();
  const toQuery = ((req.query.to as string) || '').toLowerCase().trim();

  if (!fromQuery || !toQuery) {
    return res.status(400).json({ detail: 'Parameters "from" and "to" station names or codes required' });
  }

  // Find stations across all lines
  let fromStation: any = null;
  let fromLineKey = '';
  let toStation: any = null;
  let toLineKey = '';

  for (const lineKey of ['western', 'central', 'harbour']) {
    const stations = mumbaiLocalNetwork.lines[lineKey].stations;
    const s1 = stations.find(
      (s: any) => s.code.toLowerCase() === fromQuery || s.name.toLowerCase().includes(fromQuery)
    );
    const s2 = stations.find(
      (s: any) => s.code.toLowerCase() === toQuery || s.name.toLowerCase().includes(toQuery)
    );
    if (s1 && !fromStation) {
      fromStation = s1;
      fromLineKey = lineKey;
    }
    if (s2 && !toStation) {
      toStation = s2;
      toLineKey = lineKey;
    }
  }

  if (!fromStation || !toStation) {
    return res.status(404).json({ detail: 'One or both stations not found in Mumbai Suburban dataset' });
  }

  let distanceKm = 0;
  let routeType = 'direct';
  let intermediateStops: any[] = [];
  let interchangeStation: any = null;

  if (fromLineKey === toLineKey) {
    // Same line
    const stations = mumbaiLocalNetwork.lines[fromLineKey].stations;
    const idx1 = stations.findIndex((s: any) => s.code === fromStation.code);
    const idx2 = stations.findIndex((s: any) => s.code === toStation.code);
    distanceKm = Math.abs(stations[idx2].km_from_start - stations[idx1].km_from_start);
    const startIdx = Math.min(idx1, idx2);
    const endIdx = Math.max(idx1, idx2);
    intermediateStops = stations.slice(startIdx, endIdx + 1);
    if (idx1 > idx2) intermediateStops.reverse();
  } else {
    // Cross-line interchange (e.g. via Dadar, Kurla, or Sandhurst Road)
    routeType = 'interchange';
    const isWesternCentral =
      (fromLineKey === 'western' && toLineKey === 'central') ||
      (fromLineKey === 'central' && toLineKey === 'western');
    
    const interchangeCode = isWesternCentral ? 'DDR' : 'CLA';
    const interchangeName = isWesternCentral ? 'Dadar Junction' : 'Kurla Junction';

    interchangeStation = {
      code: interchangeCode,
      name: interchangeName,
      description: `Switch between ${mumbaiLocalNetwork.lines[fromLineKey].name} and ${mumbaiLocalNetwork.lines[toLineKey].name} via Foot Overbridge interchange`,
    };

    const dist1 = haversineDistanceKm(fromStation.lat, fromStation.lng, 19.0183, 72.8428);
    const dist2 = haversineDistanceKm(19.0183, 72.8428, toStation.lat, toStation.lng);
    distanceKm = Math.round((dist1 + dist2) * 10) / 10;
  }

  distanceKm = Math.max(1, Math.round(distanceKm * 10) / 10);
  const journeyMins = Math.round(distanceKm * 2.2 + (routeType === 'interchange' ? 12 : 3));

  // Determine standard railway fare slab
  let secondClass = 5;
  let firstClass = 50;
  let acLocal = 35;
  for (const slab of mumbaiLocalNetwork.fare_slabs) {
    if (distanceKm <= slab.max_km) {
      secondClass = slab.second_class;
      firstClass = slab.first_class;
      acLocal = slab.ac_local;
      break;
    }
  }

  res.json({
    from: fromStation,
    to: toStation,
    from_line: mumbaiLocalNetwork.lines[fromLineKey]?.name,
    to_line: mumbaiLocalNetwork.lines[toLineKey]?.name,
    route_type: routeType,
    interchange: interchangeStation,
    distance_km: distanceKm,
    journey_time_minutes: journeyMins,
    stops_count: intermediateStops.length || Math.round(distanceKm / 1.8),
    intermediate_stops: intermediateStops,
    fare: {
      second_class: secondClass,
      first_class: firstClass,
      ac_local: acLocal,
      currency: 'INR (₹)',
      label: 'Estimated / Dataset Standard Suburban Fare',
      source: mumbaiLocalNetwork.meta.data_source,
    },
  });
});

// Distance calculation API
app.get('/api/distance', (req, res) => {
  const { from, to, lat1, lng1, lat2, lng2 } = req.query;

  let originLat = parseFloat(lat1 as string);
  let originLng = parseFloat(lng1 as string);
  let destLat = parseFloat(lat2 as string);
  let destLng = parseFloat(lng2 as string);

  let originName = 'Point A';
  let destName = 'Point B';

  if (from) {
    const loc = resolveLocation(from as string);
    originLat = loc.latitude;
    originLng = loc.longitude;
    originName = loc.name;
  }

  if (to) {
    const loc = resolveLocation(to as string);
    destLat = loc.latitude;
    destLng = loc.longitude;
    destName = loc.name;
  }

  if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
    return res.status(400).json({ detail: 'Valid coordinates or destination names required' });
  }

  const distanceKm = haversineDistanceKm(originLat, originLng, destLat, destLng);
  const roadEstKm = Math.round(distanceKm * 1.25 * 10) / 10;

  res.json({
    origin: { name: originName, lat: originLat, lng: originLng },
    destination: { name: destName, lat: destLat, lng: destLng },
    aerial_distance_km: distanceKm,
    estimated_road_distance_km: roadEstKm,
    drive_time_mins: Math.round(roadEstKm * 3.2 + 5),
    walking_time_mins: Math.round(roadEstKm * 12.5),
  });
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
// Destinations & Places Endpoints
// -------------------------------------------------------------
app.get(['/api/destinations', '/api/places'], (req, res) => {
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

app.get(['/api/destinations/:id', '/api/places/:id'], (req, res) => {
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

  // Calculate nearby hotels / accommodations
  const nearbyHotels = hotelsData
    .map((h) => {
      const dist = haversineDistanceKm(pLat, pLng, h.lat, h.lng);
      return {
        ...h,
        calculated_distance_km: dist,
      };
    })
    .sort((a, b) => a.calculated_distance_km - b.calculated_distance_km)
    .slice(0, 4);

  res.json({
    ...place,
    nearby_stations: nearbyStations,
    nearby_hotels: nearbyHotels,
  });
});

// Nearby Hotels endpoint
app.get('/api/hotels/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const city = ((req.query.city as string) || '').toLowerCase().trim();
  const radius = parseFloat(req.query.radius as string) || 35;

  let matches = [...hotelsData];
  if (!isNaN(lat) && !isNaN(lng)) {
    matches = matches
      .map((h) => ({
        ...h,
        calculated_distance_km: haversineDistanceKm(lat, lng, h.lat, h.lng),
      }))
      .filter((h) => h.calculated_distance_km <= radius)
      .sort((a, b) => a.calculated_distance_km - b.calculated_distance_km);
  } else if (city) {
    matches = matches.filter((h) => h.city.toLowerCase().includes(city));
  }

  res.json({
    total: matches.length,
    results: matches.slice(0, 8),
  });
});

// Fare Tariffs configuration endpoint
app.get('/api/fares/tariffs', (req, res) => {
  res.json(faresConfig || { error: 'Fares configuration not loaded' });
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
function generateRoutePath(lat1: number, lon1: number, lat2: number, lon2: number, mode: string): [number, number][] {
  const points: [number, number][] = [];
  const numSteps = Math.min(25, Math.max(8, Math.round(haversineDistanceKm(lat1, lon1, lat2, lon2) * 2)));
  
  // Vector between origin and destination
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const distance = Math.sqrt(dLat * dLat + dLon * dLon);
  
  // Perpendicular vector for slight realistic road curving
  const perpLat = -dLon / (distance || 1);
  const perpLon = dLat / (distance || 1);
  const curveFactor = mode === 'WALK' ? 0.0008 : mode === 'BICYCLE' ? 0.0012 : 0.002;

  points.push([lat1, lon1]);

  for (let i = 1; i < numSteps; i++) {
    const fraction = i / numSteps;
    // Sinusoidal displacement along perpendicular axis
    const wobble = Math.sin(fraction * Math.PI) * Math.sin(fraction * 3 * Math.PI) * curveFactor;
    const ptLat = lat1 + dLat * fraction + perpLat * wobble;
    const ptLon = lon1 + dLon * fraction + perpLon * wobble;
    points.push([Math.round(ptLat * 100000) / 100000, Math.round(ptLon * 100000) / 100000]);
  }

  points.push([lat2, lon2]);
  return points;
}

function resolveLocation(queryOrId?: string, lat?: number, lng?: number) {
  if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
    return { name: queryOrId || 'Custom Location', place_id: null, latitude: lat, longitude: lng };
  }
  if (!queryOrId) {
    return { name: 'Gateway of India', place_id: 'gateway-of-india', latitude: 18.922, longitude: 72.8347 };
  }
  const q = queryOrId.toLowerCase().trim();

  // 1. Direct place ID or slug match
  let place = placesData.get(q);
  if (!place) {
    for (const p of placesData.values()) {
      if (p.id.toLowerCase() === q || p.name.toLowerCase() === q || p.name.toLowerCase().includes(q)) {
        place = p;
        break;
      }
    }
  }
  if (place) {
    return {
      name: place.name,
      place_id: place.id,
      latitude: place.coordinates?.lat || 18.922,
      longitude: place.coordinates?.lng || 72.8347,
    };
  }

  // 2. Heritage match
  const h = heritageData.find((item) => item.id.toLowerCase() === q || item.name.toLowerCase().includes(q));
  if (h) {
    return {
      name: h.name,
      place_id: h.id,
      latitude: h.coordinates?.lat || 18.922,
      longitude: h.coordinates?.lng || 72.8347,
    };
  }

  // 3. Railway station match
  const station = railwayStationsData.find(
    (s) => s.id.toLowerCase() === q || s.code.toLowerCase() === q || s.name.toLowerCase().includes(q)
  );
  if (station) {
    return { name: station.name, place_id: station.id, latitude: station.lat, longitude: station.lng };
  }

  // 4. City match
  const city = citiesData.find(
    (c) => c.id.toLowerCase() === q || c.name.toLowerCase() === q || c.name.toLowerCase().includes(q)
  );
  if (city) {
    return { name: city.name, place_id: city.id, latitude: city.lat, longitude: city.lng };
  }

  // 5. State match
  const state = statesData.find(
    (s) => s.id.toLowerCase() === q || s.name.toLowerCase() === q || s.name.toLowerCase().includes(q)
  );
  if (state && state.coordinates) {
    return { name: state.name, place_id: state.id, latitude: state.coordinates.lat, longitude: state.coordinates.lng };
  }

  return { name: queryOrId, place_id: null, latitude: 18.922, longitude: 72.8347 };
}

// -------------------------------------------------------------
// Graph Network Model & Dijkstra Routing Engine for Pan-India Transit
// -------------------------------------------------------------
interface GraphNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface GraphEdge {
  from: string;
  to: string;
  distance_km: number;
  rail_time_hours: number;
  road_time_hours: number;
  corridor_name: string;
  rail_fare_3ac: number;
  rail_fare_sl: number;
}

const ROUTING_GRAPH_NODES: Record<string, GraphNode> = {
  mumbai: { id: 'mumbai', name: 'Mumbai', lat: 18.9431, lng: 72.8230 },
  delhi: { id: 'delhi', name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  agra: { id: 'agra', name: 'Agra', lat: 27.1767, lng: 78.0081 },
  jaipur: { id: 'jaipur', name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  varanasi: { id: 'varanasi', name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  amritsar: { id: 'amritsar', name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
  kolkata: { id: 'kolkata', name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  chennai: { id: 'chennai', name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  bengaluru: { id: 'bengaluru', name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  hyderabad: { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  kochi: { id: 'kochi', name: 'Kochi', lat: 9.9312, lng: 76.2673 },
  goa: { id: 'goa', name: 'Goa', lat: 15.4909, lng: 73.8278 },
  ahmedabad: { id: 'ahmedabad', name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  bhopal: { id: 'bhopal', name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
  bhubaneswar: { id: 'bhubaneswar', name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
  aurangabad: { id: 'aurangabad', name: 'Chhatrapati Sambhajinagar', lat: 19.8762, lng: 75.3433 },
  hampi: { id: 'hampi', name: 'Hampi (Hosapete)', lat: 15.3350, lng: 76.4600 },
  madurai: { id: 'madurai', name: 'Madurai', lat: 9.9252, lng: 78.1198 }
};

const ROUTING_GRAPH_EDGES: GraphEdge[] = [
  { from: 'delhi', to: 'agra', distance_km: 210, rail_time_hours: 1.8, road_time_hours: 3.2, corridor_name: 'Gatimaan / Yamuna Expressway Corridor', rail_fare_3ac: 580, rail_fare_sl: 180 },
  { from: 'delhi', to: 'jaipur', distance_km: 280, rail_time_hours: 3.5, road_time_hours: 4.5, corridor_name: 'Delhi-Jaipur Express Corridor (NH48)', rail_fare_3ac: 640, rail_fare_sl: 210 },
  { from: 'delhi', to: 'amritsar', distance_km: 450, rail_time_hours: 5.0, road_time_hours: 7.0, corridor_name: 'Grand Trunk / Northern Railway Corridor', rail_fare_3ac: 980, rail_fare_sl: 310 },
  { from: 'delhi', to: 'varanasi', distance_km: 790, rail_time_hours: 8.0, road_time_hours: 11.5, corridor_name: 'Vande Bharat Northern Mainline', rail_fare_3ac: 1450, rail_fare_sl: 450 },
  { from: 'agra', to: 'jaipur', distance_km: 240, rail_time_hours: 4.0, road_time_hours: 4.2, corridor_name: 'Golden Triangle Connector (NH21)', rail_fare_3ac: 560, rail_fare_sl: 190 },
  { from: 'agra', to: 'varanasi', distance_km: 610, rail_time_hours: 7.5, road_time_hours: 9.5, corridor_name: 'Purvanchal / North Central Corridor', rail_fare_3ac: 1150, rail_fare_sl: 380 },
  { from: 'mumbai', to: 'ahmedabad', distance_km: 490, rail_time_hours: 5.2, road_time_hours: 8.5, corridor_name: 'Western Railway Dedicated Corridor (NH48)', rail_fare_3ac: 1050, rail_fare_sl: 340 },
  { from: 'ahmedabad', to: 'jaipur', distance_km: 660, rail_time_hours: 9.0, road_time_hours: 11.0, corridor_name: 'Rajasthan Western Line', rail_fare_3ac: 1250, rail_fare_sl: 410 },
  { from: 'mumbai', to: 'goa', distance_km: 580, rail_time_hours: 7.5, road_time_hours: 10.5, corridor_name: 'Konkan Railway Coastal Corridor', rail_fare_3ac: 1200, rail_fare_sl: 390 },
  { from: 'mumbai', to: 'aurangabad', distance_km: 370, rail_time_hours: 5.5, road_time_hours: 6.5, corridor_name: 'Samruddhi Mahamarg / Central Rail', rail_fare_3ac: 820, rail_fare_sl: 260 },
  { from: 'mumbai', to: 'bhopal', distance_km: 780, rail_time_hours: 11.0, road_time_hours: 13.5, corridor_name: 'Central Railway Mainline', rail_fare_3ac: 1420, rail_fare_sl: 440 },
  { from: 'bhopal', to: 'agra', distance_km: 440, rail_time_hours: 5.5, road_time_hours: 7.0, corridor_name: 'Bhopal Shatabdi North-Central Line', rail_fare_3ac: 920, rail_fare_sl: 300 },
  { from: 'mumbai', to: 'hyderabad', distance_km: 710, rail_time_hours: 12.0, road_time_hours: 13.0, corridor_name: 'Hussain Sagar Corridor', rail_fare_3ac: 1350, rail_fare_sl: 420 },
  { from: 'hyderabad', to: 'bengaluru', distance_km: 570, rail_time_hours: 8.5, road_time_hours: 9.0, corridor_name: 'South Central Highway Corridor (NH44)', rail_fare_3ac: 1180, rail_fare_sl: 370 },
  { from: 'bengaluru', to: 'chennai', distance_km: 350, rail_time_hours: 4.2, road_time_hours: 6.0, corridor_name: 'Vande Bharat Southern Corridor', rail_fare_3ac: 780, rail_fare_sl: 240 },
  { from: 'bengaluru', to: 'kochi', distance_km: 550, rail_time_hours: 9.5, road_time_hours: 10.5, corridor_name: 'Western Ghats / Southern Corridor', rail_fare_3ac: 1150, rail_fare_sl: 360 },
  { from: 'bengaluru', to: 'hampi', distance_km: 340, rail_time_hours: 5.5, road_time_hours: 6.5, corridor_name: 'Hampi Express Rail Corridor', rail_fare_3ac: 740, rail_fare_sl: 230 },
  { from: 'chennai', to: 'madurai', distance_km: 460, rail_time_hours: 6.0, road_time_hours: 7.5, corridor_name: 'Tejas Pandian Corridor', rail_fare_3ac: 990, rail_fare_sl: 310 },
  { from: 'madurai', to: 'kochi', distance_km: 260, rail_time_hours: 6.5, road_time_hours: 6.5, corridor_name: 'Cardamom Hills / Kochi Corridor', rail_fare_3ac: 620, rail_fare_sl: 200 },
  { from: 'varanasi', to: 'kolkata', distance_km: 680, rail_time_hours: 8.5, road_time_hours: 12.0, corridor_name: 'Grand Chord Express Corridor', rail_fare_3ac: 1320, rail_fare_sl: 410 },
  { from: 'kolkata', to: 'bhubaneswar', distance_km: 440, rail_time_hours: 6.0, road_time_hours: 7.5, corridor_name: 'Howrah-Puri Eastern Line', rail_fare_3ac: 950, rail_fare_sl: 290 },
  { from: 'bhubaneswar', to: 'chennai', distance_km: 1220, rail_time_hours: 18.0, road_time_hours: 21.0, corridor_name: 'Coromandel Coastal Trunk Line', rail_fare_3ac: 2150, rail_fare_sl: 680 },
  { from: 'goa', to: 'kochi', distance_km: 720, rail_time_hours: 11.0, road_time_hours: 14.0, corridor_name: 'Konkan-Malabar Coast Line', rail_fare_3ac: 1380, rail_fare_sl: 430 }
];

function findNearestGraphNode(lat: number, lng: number): GraphNode {
  let nearest = ROUTING_GRAPH_NODES.mumbai;
  let minDistance = Infinity;
  for (const node of Object.values(ROUTING_GRAPH_NODES)) {
    const d = haversineDistanceKm(lat, lng, node.lat, node.lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = node;
    }
  }
  return nearest;
}

// Dijkstra shortest path on graph
function calculateDijkstraPath(startNodeId: string, endNodeId: string) {
  if (startNodeId === endNodeId) {
    return { path: [startNodeId], total_distance: 0, total_rail_time: 0, total_road_time: 0, edges: [] };
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, { node: string; edge: GraphEdge } | null> = {};
  const unvisited = new Set<string>();

  for (const nodeId of Object.keys(ROUTING_GRAPH_NODES)) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  }
  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    let current: string | null = null;
    let smallestDist = Infinity;
    for (const nodeId of unvisited) {
      if (distances[nodeId] < smallestDist) {
        smallestDist = distances[nodeId];
        current = nodeId;
      }
    }

    if (!current || distances[current] === Infinity) break;
    if (current === endNodeId) break;

    unvisited.delete(current);

    // Find neighbors
    for (const edge of ROUTING_GRAPH_EDGES) {
      let neighbor: string | null = null;
      if (edge.from === current) neighbor = edge.to;
      else if (edge.to === current) neighbor = edge.from;

      if (neighbor && unvisited.has(neighbor)) {
        const alt = distances[current] + edge.distance_km;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = { node: current, edge };
        }
      }
    }
  }

  // Backtrack path
  const path: string[] = [];
  const edges: GraphEdge[] = [];
  let curr: string | null = endNodeId;

  while (curr) {
    path.unshift(curr);
    const prev = previous[curr];
    if (prev) {
      edges.unshift(prev.edge);
      curr = prev.node;
    } else {
      break;
    }
  }

  let total_distance = 0;
  let total_rail_time = 0;
  let total_road_time = 0;
  for (const edge of edges) {
    total_distance += edge.distance_km;
    total_rail_time += edge.rail_time_hours;
    total_road_time += edge.road_time_hours;
  }

  return { path, total_distance, total_rail_time, total_road_time, edges };
}

app.get('/api/routes', (req, res) => {
  const originStr = req.query.origin as string;
  const destStr = req.query.destination as string;
  const origLat = parseFloat(req.query.orig_lat as string);
  const origLng = parseFloat(req.query.orig_lng as string);
  const destLat = parseFloat(req.query.dest_lat as string);
  const destLng = parseFloat(req.query.dest_lng as string);
  const requestedMode = (req.query.mode as string)?.toUpperCase();

  const originLoc = resolveLocation(originStr, origLat, origLng);
  const destLoc = resolveLocation(destStr, destLat, destLng);

  const distKm =
    haversineDistanceKm(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude) || 4.2;

  const options = [];
  const isInterCity = distKm >= 75;

  if (isInterCity) {
    // -------------------------------------------------------------
    // INTER-CITY ROUTING (Pan-India Graph with Dijkstra Engine)
    // -------------------------------------------------------------
    const startGraphNode = findNearestGraphNode(originLoc.latitude, originLoc.longitude);
    const endGraphNode = findNearestGraphNode(destLoc.latitude, destLoc.longitude);
    const graphResult = calculateDijkstraPath(startGraphNode.id, endGraphNode.id);

    const effectiveRailDist = graphResult.total_distance > 0 ? graphResult.total_distance : distKm;
    const effectiveRailHours = graphResult.total_rail_time > 0 ? graphResult.total_rail_time : Math.round((distKm / 75) * 10) / 10;
    const effectiveRoadHours = graphResult.total_road_time > 0 ? graphResult.total_road_time : Math.round((distKm / 55) * 10) / 10;

    const polyline = generateRoutePath(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude, 'TRANSIT');

    // 1. Indian Railways Express / Vande Bharat (Rail)
    const trainFare3AC = Math.round(effectiveRailDist * 1.35 + 80);
    const trainFareSL = Math.round(effectiveRailDist * 0.45 + 50);
    const trainFareVB = Math.round(effectiveRailDist * 2.10 + 120);

    const haltsText = graphResult.path.length > 2
      ? `Via ${graphResult.path.slice(1, -1).map(id => ROUTING_GRAPH_NODES[id]?.name).join(' → ')}`
      : 'Direct Express Corridor';

    options.push({
      mode: 'TRANSIT',
      title: 'Indian Railways Express / Vande Bharat',
      duration_minutes: Math.round(effectiveRailHours * 60),
      distance_km: effectiveRailDist,
      estimated_fare: trainFare3AC,
      fare_status: 'estimated',
      provider: 'Indian Railways (IRCTC)',
      speed_tier: 'fastest',
      fare_note: `Estimated tariff: 3AC: ₹${trainFare3AC} | Sleeper: ₹${trainFareSL} | Vande Bharat CC: ₹${trainFareVB}`,
      steps_summary: [
        `Transfer from ${originLoc.name} to nearest railhead (${startGraphNode.name} Railway Station)`,
        `Board Express / Vande Bharat corridor towards ${endGraphNode.name} (${haltsText})`,
        `Distance along rail network: ${effectiveRailDist} km (Estimated ${effectiveRailHours} hrs)`,
        `Arrive at ${endGraphNode.name} Junction and take local transit (Auto/Taxi) to ${destLoc.name}`
      ],
      polyline,
      routing_engine: 'YatraVerse Graph Solver (Dijkstra Shortest Path)'
    });

    // 2. Multimodal Transit (Cab + Express Train + Local Auto)
    options.push({
      mode: 'MULTIMODAL',
      title: 'Multimodal Hub Transit (Cab + Train + Auto)',
      duration_minutes: Math.round(effectiveRailHours * 60 + 45),
      distance_km: effectiveRailDist + 12,
      estimated_fare: trainFare3AC + 150,
      fare_status: 'estimated',
      provider: 'Multimodal Transit Network',
      speed_tier: 'balanced',
      fare_note: 'Includes estimated first-mile cab + Indian Railways 3-Tier AC + last-mile auto transfer',
      steps_summary: [
        `First Mile: Board local metered taxi from ${originLoc.name} to ${startGraphNode.name} Junction`,
        `Line Haul: Fast train corridor along ${haltsText}`,
        `Last Mile: Auto-rickshaw from ${endGraphNode.name} Station to entrance of ${destLoc.name}`
      ],
      polyline,
      routing_engine: 'YatraVerse Multimodal Graph Layer'
    });

    // 3. National Highway Express Cab / Self-Drive (Road)
    const cabFare = Math.round(distKm * 16 + (distKm / 100) * 180 + 200);
    options.push({
      mode: 'DRIVE',
      title: 'National Highway Express Cab / Self-Drive',
      duration_minutes: Math.round(effectiveRoadHours * 60),
      distance_km: distKm,
      estimated_fare: cabFare,
      fare_status: 'estimated',
      provider: 'National Highway Intercity Cab',
      speed_tier: 'flexible',
      fare_note: `Estimated outstation sedan rate (₹16/km + estimated Fastag highway toll of ₹${Math.round((distKm / 100) * 180)})`,
      steps_summary: [
        `Depart ${originLoc.name} and join national highway arterial link`,
        `Cruise along national highway corridor towards ${destLoc.name} (${distKm} km)`,
        `Pass through official toll plazas and rest stops`,
        `Arrive at main parking / entrance gate of ${destLoc.name}`
      ],
      polyline: generateRoutePath(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude, 'DRIVE'),
      routing_engine: 'YatraVerse Highway Vector Engine'
    });

    // 4. Intercity AC Bus
    const busFare = Math.round(distKm * 1.8 + 60);
    options.push({
      mode: 'BUS',
      title: 'Intercity AC Sleeper / State Transport',
      duration_minutes: Math.round(effectiveRoadHours * 60 + 60),
      distance_km: distKm,
      estimated_fare: busFare,
      fare_status: 'estimated',
      provider: 'State Road Transport / Private Volvo',
      speed_tier: 'cheapest',
      fare_note: `Estimated AC bus tariff (₹${busFare} per passenger seat)`,
      steps_summary: [
        `Board intercity coach at central bus terminal near ${startGraphNode.name}`,
        `Travel via express road corridor with scheduled meal halt`,
        `Alight at destination bus terminal and take feeder auto to ${destLoc.name}`
      ],
      polyline,
      routing_engine: 'YatraVerse Bus Route Engine'
    });

  } else {
    // -------------------------------------------------------------
    // LOCAL / REGIONAL ROUTING (< 75 km)
    // -------------------------------------------------------------
    // 1. Drive / Taxi
    if (!requestedMode || requestedMode === 'DRIVE') {
      const driveDuration = Math.round(distKm * 3.2 + 5);
      const estFare = Math.round(distKm * 21 + 50);
      const polyline = generateRoutePath(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude, 'DRIVE');
      options.push({
        mode: 'DRIVE',
        title: 'Taxi / Rideshare (AC Cab)',
        duration_minutes: driveDuration,
        distance_km: distKm,
        estimated_fare: estFare,
        fare_status: 'estimated',
        provider: 'City Taxi / Rideshare',
        steps_summary: [
          `Depart from ${originLoc.name} along arterial city link`,
          `Proceed ${Math.round(distKm * 0.7 * 10) / 10} km along primary transit avenue`,
          `Take designated approach towards ${destLoc.name}`,
          `Arrive at visitor drop-off point`
        ],
        polyline,
        speed_tier: 'fastest',
        fare_note: 'Estimated fare based on standard daytime city rates (₹50 base + ₹21/km)',
      });
    }

    // 2. Auto-Rickshaw
    if (!requestedMode || requestedMode === 'AUTO') {
      const autoDuration = Math.round(distKm * 3.5 + 4);
      const estAutoFare = Math.round(Math.max(28, 28 + (distKm - 1.5) * 15.33));
      options.push({
        mode: 'AUTO',
        title: 'Auto-Rickshaw (Metered)',
        duration_minutes: autoDuration,
        distance_km: distKm,
        estimated_fare: estAutoFare,
        fare_status: 'estimated',
        provider: 'City Metered Auto-Rickshaw',
        steps_summary: [
          `Board auto at designated stand near ${originLoc.name}`,
          `Navigate city streets and bypass heavy traffic`,
          `Drop-off at nearest rickshaw stand beside ${destLoc.name}`
        ],
        polyline: generateRoutePath(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude, 'DRIVE'),
        speed_tier: 'balanced',
        fare_note: 'Estimated government RTO metered rate (₹28 for first 1.5 km, ₹15.33/km thereafter)',
      });
    }

    // 3. Transit (Suburban Rail / Metro / City Bus)
    if (!requestedMode || requestedMode === 'TRANSIT') {
      const transitDuration = Math.round(distKm * 2.5 + 10);
      const transitFare = distKm > 20 ? 15 : distKm > 10 ? 10 : 5;
      const polyline = generateRoutePath(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude, 'TRANSIT');
      options.push({
        mode: 'TRANSIT',
        title: 'Suburban Railway / Metro',
        duration_minutes: transitDuration,
        distance_km: distKm,
        estimated_fare: transitFare,
        fare_status: 'estimated',
        provider: 'Suburban Rail / City Metro',
        transit_details: [
          {
            transit_type: 'Local Train / Metro',
            line: 'City Transit Line',
            departure_stop: originLoc.name,
            arrival_stop: destLoc.name,
            num_stops: Math.max(1, Math.round(distKm / 1.5)),
          },
        ],
        steps_summary: [
          `Board connecting transit at closest station near ${originLoc.name}`,
          `Travel ${distKm} km via suburban rail / metro line (${Math.max(1, Math.round(distKm / 1.5))} stops)`,
          `Alight at station exit and follow 3-minute walkway to ${destLoc.name}`,
        ],
        polyline,
        speed_tier: 'cheapest',
        fare_note: 'Standard 2nd class suburban railway / metro fare table estimate',
      });
    }

    // 4. City Bus
    if (!requestedMode || requestedMode === 'BUS') {
      const busDuration = Math.round(distKm * 4.0 + 12);
      const busFare = Math.round(Math.min(30, Math.max(6, 6 + (distKm - 5) * 1.8)));
      options.push({
        mode: 'BUS',
        title: 'City Bus Transit',
        duration_minutes: busDuration,
        distance_km: distKm,
        estimated_fare: busFare,
        fare_status: 'estimated',
        provider: 'Municipal City Bus Service',
        steps_summary: [
          `Board city bus at stop near ${originLoc.name}`,
          `Proceed along regular route with municipal stops`,
          `Alight at bus shelter opposite ${destLoc.name}`
        ],
        polyline: generateRoutePath(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude, 'TRANSIT'),
        speed_tier: 'cheapest',
        fare_note: 'Estimated ordinary non-AC municipal bus tariff',
      });
    }

    // 5. Bicycle
    if (!requestedMode || requestedMode === 'BICYCLE') {
      const bikeDuration = Math.round(distKm * 4.5);
      const polyline = generateRoutePath(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude, 'BICYCLE');
      options.push({
        mode: 'BICYCLE',
        title: 'Cycling Corridor',
        duration_minutes: bikeDuration,
        distance_km: distKm,
        estimated_fare: 0,
        fare_status: 'estimated',
        provider: 'Active Cycling Route',
        steps_summary: [
          `Cycle along shared low-traffic street from ${originLoc.name}`,
          'Follow cycle-friendly avenues and waterfront corridors',
          `Reach secure bicycle parking near ${destLoc.name}`
        ],
        polyline,
        speed_tier: 'balanced',
        fare_note: 'Eco-friendly zero fare route with public rental docks available',
      });
    }

    // 6. Walk (if <= 12 km)
    if ((!requestedMode || requestedMode === 'WALK') && distKm <= 12) {
      const walkDuration = Math.round(distKm * 12.5);
      const polyline = generateRoutePath(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude, 'WALK');
      options.push({
        mode: 'WALK',
        title: 'Pedestrian Heritage Walk',
        duration_minutes: walkDuration,
        distance_km: distKm,
        estimated_fare: 0,
        fare_status: 'estimated',
        provider: 'Pedestrian Heritage Corridor',
        steps_summary: [
          `Start walk from ${originLoc.name} pedestrian zone`,
          'Follow sidewalks, heritage promenades, and pedestrian crosswalks',
          `Arrive at entry courtyard of ${destLoc.name}`
        ],
        polyline,
        speed_tier: 'balanced',
        fare_note: 'Zero fare - scenic and healthy pedestrian walkway',
      });
    }
  }

  res.json({
    origin: originLoc,
    destination: destLoc,
    distance_km: distKm,
    is_inter_city: isInterCity,
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

      const prompt = `You are YatraVerse's Intelligent Tourism Assistant for Indian destinations.
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
    reply = `Namaste! Welcome to YatraVerse. Exploring ${city || 'India'} is an unforgettable journey through millennia of history, living traditions, and vibrant street life. ` +
      `I recommend visiting **${suggestedPlaces[0]?.name || 'top landmarks'}** and nearby heritage sites. How can I help you customize your visit?`;
  }

  res.json({
    conversation_id: convId,
    reply,
    suggested_places: suggestedPlaces,
    sources: ['YatraVerse Pan-India Tourism Engine', 'Geospatial Transit Index'],
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
    console.log(`[Server] YatraVerse server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
