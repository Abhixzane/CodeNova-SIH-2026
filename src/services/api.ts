import {
  StateItem,
  CityItem,
  PlaceDetail,
  PlaceListResponse,
  PlaceSummary,
  RouteResponse,
  AIChatRequest,
  AIChatResponse,
  ItineraryRequest,
  ItineraryResponse,
  UserProfile,
  OnboardingSurvey,
  FavoriteItem,
  TripItem,
  CityWeather,
  RailwayStationInfo,
  NearbyPlacesResponse,
  PlatformStats,
  MumbaiLocalStation,
  MumbaiLocalRouteResult,
  CulturalItem,
  ArtisanProfile,
  LocalProvider,
  AccessibilityRecord,
  InfrastructureFacility,
  DestinationHealthResponse,
  HeritageConditionReport,
  HeritageCluster,
  CommuterNetwork,
} from '../types';

const API_BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('bharat_token') || 'bharat-demo-token-1';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`API Error ${res.status}: ${errorBody || res.statusText}`);
  }

  return res.json();
}

export const api = {
  // -------------------------------------------------------------
  // States & Cities
  // -------------------------------------------------------------
  async getStates(): Promise<StateItem[]> {
    try {
      return await request<StateItem[]>('/states');
    } catch {
      return [
        { id: 'maharashtra', name: 'Maharashtra', capital: 'Mumbai', region: 'Western India', total_places: 14 },
        { id: 'rajasthan', name: 'Rajasthan', capital: 'Jaipur', region: 'Northern India', total_places: 8 },
        { id: 'delhi', name: 'Delhi (NCT)', capital: 'New Delhi', region: 'Northern India', total_places: 6 },
        { id: 'kerala', name: 'Kerala', capital: 'Thiruvananthapuram', region: 'Southern India', total_places: 6 },
      ];
    }
  },

  async getCities(): Promise<CityItem[]> {
    try {
      return await request<CityItem[]>('/cities');
    } catch {
      return [
        { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', state_id: 'maharashtra', lat: 18.9431, lng: 72.8230, description: 'The City of Dreams', places_count: 14 },
        { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', state_id: 'rajasthan', lat: 26.9124, lng: 75.7873, description: 'The Pink City', places_count: 8 },
        { id: 'delhi', name: 'New Delhi', state: 'Delhi (NCT)', state_id: 'delhi', lat: 28.6139, lng: 77.2090, description: 'The Historic Capital', places_count: 6 },
        { id: 'kochi', name: 'Kochi', state: 'Kerala', state_id: 'kerala', lat: 9.9312, lng: 76.2673, description: 'Queen of the Arabian Sea', places_count: 6 },
      ];
    }
  },

  // -------------------------------------------------------------
  // Places & Search
  // -------------------------------------------------------------
  async getPlaces(params?: {
    state?: string;
    city?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<PlaceListResponse> {
    const q = new URLSearchParams();
    if (params?.state) q.set('state', params.state);
    if (params?.city) q.set('city', params.city);
    if (params?.category) q.set('category', params.category);
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.offset) q.set('offset', String(params.offset));

    try {
      return await request<PlaceListResponse>(`/places?${q.toString()}`);
    } catch {
      return { total: 0, limit: 20, offset: 0, data: [] };
    }
  },

  async getPlaceById(id: string): Promise<PlaceDetail> {
    return await request<PlaceDetail>(`/places/${id}`);
  },

  async getPlace(id: string): Promise<PlaceDetail> {
    return this.getPlaceById(id);
  },

  async searchPlaces(query: string): Promise<PlaceSummary[]> {
    try {
      const q = new URLSearchParams({ q: query });
      return await request<PlaceSummary[]>(`/search?${q.toString()}`);
    } catch {
      return [];
    }
  },

  async search(query: string, city?: string, limit?: number): Promise<{ total: number; results: any[] }> {
    const results = await this.searchPlaces(query);
    return { total: results.length, results };
  },

  async getNearbyPlaces(latOrParams: any, lng?: number, radiusKm: number = 10, limit: number = 6): Promise<any> {
    let lat: number;
    let long: number;
    let rad = radiusKm;
    let lim = limit;

    if (typeof latOrParams === 'object' && latOrParams !== null) {
      lat = latOrParams.lat;
      long = latOrParams.lng;
      rad = latOrParams.radius_km || 10;
      lim = latOrParams.limit || 6;
    } else {
      lat = latOrParams;
      long = lng || 72.8347;
    }

    const q = new URLSearchParams({
      lat: String(lat),
      lng: String(long),
      radius_km: String(rad),
      limit: String(lim),
    });

    try {
      const data = await request<any>(`/places/nearby?${q.toString()}`);
      if (Array.isArray(data)) {
        return { origin: { latitude: lat, longitude: long }, radius_km: rad, total: data.length, results: data };
      }
      return data;
    } catch {
      return { origin: { latitude: lat, longitude: long }, radius_km: rad, total: 0, results: [] };
    }
  },

  async getNearby(lat: number, lng: number, radiusKm: number = 10, limit: number = 6): Promise<any> {
    return this.getNearbyPlaces(lat, lng, radiusKm, limit);
  },

  // -------------------------------------------------------------
  // Hotels & Accommodation
  // -------------------------------------------------------------
  async getNearbyHotels(lat?: number, lng?: number, city?: string): Promise<any[]> {
    try {
      const q = new URLSearchParams();
      if (lat !== undefined && lng !== undefined) {
        q.set('lat', String(lat));
        q.set('lng', String(lng));
      }
      if (city) q.set('city', city);
      const res = await request<{ total: number; results: any[] }>(`/hotels/nearby?${q.toString()}`);
      return res.results || [];
    } catch {
      return [];
    }
  },

  async getFareTariffs(): Promise<any> {
    try {
      return await request<any>('/fares/tariffs');
    } catch {
      return null;
    }
  },

  // -------------------------------------------------------------
  // Railway Stations
  // -------------------------------------------------------------
  async getRailwayStations(city?: string): Promise<RailwayStationInfo[]> {
    try {
      const q = city ? `?city=${encodeURIComponent(city)}` : '';
      const data = await request<any[]>(`/railway-stations${q}`);
      return data.map((s: any) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        line: s.lines ? s.lines.join(', ') : 'Suburban Hub',
        distance_km: s.distance_km || 0,
        walking_time_mins: s.walking_time_mins || 15,
        road_time_mins: s.road_time_mins || 8,
        transfer_modes: s.transfer_modes || ['Taxi', 'Bus', 'Walk'],
      }));
    } catch {
      return [];
    }
  },

  async getNearbyRailwayStations(lat: number, lng: number, limit: number = 3): Promise<RailwayStationInfo[]> {
    try {
      const q = new URLSearchParams({ lat: String(lat), lng: String(lng), limit: String(limit) });
      const data = await request<any[]>(`/railway-stations/nearby?${q.toString()}`);
      return data.map((s: any) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        line: s.lines ? s.lines.join(', ') : 'Suburban Hub',
        distance_km: s.distance_km || 1.2,
        walking_time_mins: s.walking_time_mins || 15,
        road_time_mins: s.road_time_mins || 8,
        transfer_modes: s.transfer_modes || ['Taxi', 'Bus', 'Walk'],
      }));
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Routes & Maps
  // -------------------------------------------------------------
  async getRoutes(originOrObj: any, destination?: string, mode?: string, city?: string): Promise<RouteResponse> {
    let orig: string;
    let dest: string;
    let m = mode;
    let c = city;

    if (typeof originOrObj === 'object' && originOrObj !== null) {
      orig = originOrObj.origin;
      dest = originOrObj.destination;
      m = originOrObj.mode;
      c = originOrObj.city || originOrObj.cityContext || city;
    } else {
      orig = originOrObj;
      dest = destination || 'gateway-of-india';
    }

    const q = new URLSearchParams({ origin: orig, destination: dest });
    if (m) q.set('mode', m);
    if (c) q.set('city', c);

    return await request<RouteResponse>(`/routes?${q.toString()}`);
  },

  async getDirectionsUrl(originOrObj: any, destination?: string, mode: string = 'driving', city?: string): Promise<{ url: string } & string> {
    let orig: string;
    let dest: string;
    let m = mode;
    let c = city;

    if (typeof originOrObj === 'object' && originOrObj !== null) {
      orig = originOrObj.origin;
      dest = originOrObj.destination;
      m = originOrObj.mode || 'driving';
      c = originOrObj.city || originOrObj.cityContext || city;
    } else {
      orig = originOrObj;
      dest = destination || 'gateway-of-india';
    }

    const q = new URLSearchParams({ origin: orig, destination: dest, mode: m });
    if (c) q.set('city', c);
    try {
      const data = await request<{ navigation_url: string }>(`/maps/directions?${q.toString()}`);
      const resStr: any = data.navigation_url;
      resStr.url = data.navigation_url;
      return resStr;
    } catch {
      const fallback = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(orig)}&destination=${encodeURIComponent(dest)}&travelmode=${m.toLowerCase()}`;
      const resStr: any = fallback;
      resStr.url = fallback;
      return resStr;
    }
  },

  async getGoogleMapsUrl(origin: string, destination: string, mode: string = 'driving', city?: string): Promise<string> {
    const res: any = await this.getDirectionsUrl(origin, destination, mode, city);
    return typeof res === 'string' ? res : (res?.url || '');
  },

  // -------------------------------------------------------------
  // AI Assistant
  // -------------------------------------------------------------
  async sendAIChat(req: AIChatRequest): Promise<AIChatResponse> {
    return await request<AIChatResponse>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },

  async chatAI(req: any): Promise<AIChatResponse> {
    return this.sendAIChat(req);
  },

  // -------------------------------------------------------------
  // Itinerary Planner
  // -------------------------------------------------------------
  async generateItinerary(req: ItineraryRequest): Promise<ItineraryResponse> {
    return await request<ItineraryResponse>('/itinerary', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },

  // -------------------------------------------------------------
  // Weather
  // -------------------------------------------------------------
  async getWeather(city: string = 'mumbai'): Promise<CityWeather> {
    try {
      const q = new URLSearchParams({ city });
      return await request<CityWeather>(`/weather?${q.toString()}`);
    } catch {
      return {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        temperature_c: 28,
        condition: 'Sunny & Coastal Breeze',
        humidity: 68,
        wind_kmh: 14,
        status: 'Estimated',
      };
    }
  },

  // -------------------------------------------------------------
  // Auth & Profile
  // -------------------------------------------------------------
  async register(name: string, email: string, password: string, home_city?: string): Promise<{ token: string; profile: UserProfile }> {
    const data = await request<{ token: string; profile: UserProfile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, home_city }),
    });
    if (data.token) {
      localStorage.setItem('bharat_token', data.token);
    }
    return data;
  },

  async login(email: string, password: string): Promise<{ token: string; profile: UserProfile }> {
    const data = await request<{ token: string; profile: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('bharat_token', data.token);
    }
    return data;
  },

  async getProfile(): Promise<UserProfile> {
    return await request<UserProfile>('/profile');
  },

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    return await request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  async saveSurvey(survey: OnboardingSurvey): Promise<UserProfile> {
    return await request<UserProfile>('/profile/survey', {
      method: 'POST',
      body: JSON.stringify(survey),
    });
  },

  // -------------------------------------------------------------
  // Favorites
  // -------------------------------------------------------------
  async getFavorites(): Promise<FavoriteItem[]> {
    try {
      return await request<FavoriteItem[]>('/favorites');
    } catch {
      return [];
    }
  },

  async addFavorite(placeId: string): Promise<FavoriteItem> {
    return await request<FavoriteItem>('/favorites', {
      method: 'POST',
      body: JSON.stringify({ place_id: placeId }),
    });
  },

  async removeFavorite(placeId: string): Promise<void> {
    await request<void>(`/favorites/${placeId}`, { method: 'DELETE' });
  },

  // -------------------------------------------------------------
  // Trips
  // -------------------------------------------------------------
  async getTrips(): Promise<TripItem[]> {
    try {
      return await request<TripItem[]>('/trips');
    } catch {
      return [];
    }
  },

  async createTrip(trip: Omit<TripItem, 'id' | 'created_at'>): Promise<TripItem> {
    return await request<TripItem>('/trips', {
      method: 'POST',
      body: JSON.stringify(trip),
    });
  },

  async saveTrip(trip: Omit<TripItem, 'id' | 'created_at'>): Promise<TripItem> {
    return await this.createTrip(trip);
  },

  async deleteTrip(tripId: string): Promise<void> {
    await request<void>(`/trips/${tripId}`, { method: 'DELETE' });
  },

  // -------------------------------------------------------------
  // Platform Statistics
  // -------------------------------------------------------------
  async getStats(): Promise<PlatformStats> {
    try {
      return await request<PlatformStats>('/stats');
    } catch {
      return {
        heritage_count: 45,
        destinations_count: 78,
        states_count: 36,
        cities_count: 24,
        mumbai_local_stations_count: 65,
        three_d_models_count: 45,
        transport_modes: ['Suburban Rail', 'Metro', 'Drive / Taxi', 'Walking', 'Bicycle'],
      };
    }
  },

  // -------------------------------------------------------------
  // Heritage Experiences (42+ Curated UNESCO & National Sites)
  // -------------------------------------------------------------
  async getHeritage(params?: {
    category?: string;
    state?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ total: number; limit: number; offset: number; data: any[] }> {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.state) q.set('state', params.state);
    if (params?.search) q.set('search', params.search);
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.offset) q.set('offset', String(params.offset));

    try {
      return await request<{ total: number; limit: number; offset: number; data: any[] }>(`/heritage?${q.toString()}`);
    } catch {
      return { total: 0, limit: 50, offset: 0, data: [] };
    }
  },

  async getHeritageById(id: string): Promise<any> {
    return await request<any>(`/heritage/${id}`);
  },

  // -------------------------------------------------------------
  // Mumbai Suburban Local Rail Module
  // -------------------------------------------------------------
  async getMumbaiLocalLines(): Promise<any> {
    return await request<any>('/mumbai-local/lines');
  },

  async getMumbaiLocalStations(): Promise<MumbaiLocalStation[]> {
    return await request<MumbaiLocalStation[]>('/mumbai-local/stations');
  },

  async getMumbaiLocalRoute(from: string, to: string): Promise<MumbaiLocalRouteResult> {
    const q = new URLSearchParams({ from, to });
    return await request<MumbaiLocalRouteResult>(`/mumbai-local/route?${q.toString()}`);
  },

  // -------------------------------------------------------------
  // Distance Calculation
  // -------------------------------------------------------------
  async getDistance(params: {
    from?: string;
    to?: string;
    lat1?: number;
    lng1?: number;
    lat2?: number;
    lng2?: number;
  }): Promise<{
    origin: { name: string; lat: number; lng: number };
    destination: { name: string; lat: number; lng: number };
    aerial_distance_km: number;
    estimated_road_distance_km: number;
    drive_time_mins: number;
    walking_time_mins: number;
  }> {
    const q = new URLSearchParams();
    if (params.from) q.set('from', params.from);
    if (params.to) q.set('to', params.to);
    if (params.lat1 !== undefined) q.set('lat1', String(params.lat1));
    if (params.lng1 !== undefined) q.set('lng1', String(params.lng1));
    if (params.lat2 !== undefined) q.set('lat2', String(params.lat2));
    if (params.lng2 !== undefined) q.set('lng2', String(params.lng2));

    return await request<any>(`/distance?${q.toString()}`);
  },

  // -------------------------------------------------------------
  // Culture & Living Heritage
  // -------------------------------------------------------------
  async getCulture(params?: { city?: string; category?: string }): Promise<CulturalItem[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    if (params?.category) q.set('category', params.category);
    try {
      return await request<CulturalItem[]>(`/culture?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Artisans & GI Craft Traditions
  // -------------------------------------------------------------
  async getArtisans(params?: { city?: string; gi_only?: boolean }): Promise<ArtisanProfile[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    if (params?.gi_only) q.set('gi_only', 'true');
    try {
      return await request<ArtisanProfile[]>(`/artisans?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Verified Local Providers & Homestays
  // -------------------------------------------------------------
  async getProviders(params?: {
    city?: string;
    category?: string;
    verification_status?: string;
  }): Promise<LocalProvider[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    if (params?.category) q.set('category', params.category);
    if (params?.verification_status) q.set('verification_status', params.verification_status);
    try {
      return await request<LocalProvider[]>(`/providers?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Infrastructure Facilities & Nearby Lookup
  // -------------------------------------------------------------
  async getFacilities(params?: {
    city?: string;
    type?: string;
    accessible?: boolean;
  }): Promise<InfrastructureFacility[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    if (params?.type) q.set('type', params.type);
    if (params?.accessible) q.set('accessible', 'true');
    try {
      return await request<InfrastructureFacility[]>(`/facilities?${q.toString()}`);
    } catch {
      return [];
    }
  },

  async getNearbyFacilities(lat: number, lng: number, radiusKm: number = 5): Promise<InfrastructureFacility[]> {
    const q = new URLSearchParams({ lat: String(lat), lng: String(lng), radius_km: String(radiusKm) });
    try {
      return await request<InfrastructureFacility[]>(`/facilities/nearby?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Barrier-Free Accessibility Audits
  // -------------------------------------------------------------
  async getAccessibility(params?: {
    place_id?: string;
    city?: string;
    wheelchair?: string;
  }): Promise<AccessibilityRecord[]> {
    const q = new URLSearchParams();
    if (params?.place_id) q.set('place_id', params.place_id);
    if (params?.city) q.set('city', params.city);
    if (params?.wheelchair) q.set('wheelchair', params.wheelchair);
    try {
      return await request<AccessibilityRecord[]>(`/accessibility?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Heritage Clusters & Pan-India Commuter Networks
  // -------------------------------------------------------------
  async getClusters(params?: { city?: string }): Promise<HeritageCluster[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    try {
      return await request<HeritageCluster[]>(`/clusters?${q.toString()}`);
    } catch {
      return [];
    }
  },

  async getSuburbanNetworks(params?: { city?: string }): Promise<CommuterNetwork[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    try {
      return await request<CommuterNetwork[]>(`/suburban-networks?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Destination Health & Tourism Gap Map
  // -------------------------------------------------------------
  async getDestinationHealth(params?: { city?: string }): Promise<DestinationHealthResponse> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    try {
      return await request<DestinationHealthResponse>(`/destination-health?${q.toString()}`);
    } catch {
      return {
        provenance_disclaimer: 'MODELLED / ANALYTICAL ESTIMATE FOR DEMO',
        provenance_badge: 'MODELLED',
        cities: [],
        gap_map_zones: [],
      };
    }
  },

  // -------------------------------------------------------------
  // Heritage Condition Citizen Reporting Workflow
  // -------------------------------------------------------------
  async getReports(params?: {
    site_id?: string;
    city?: string;
    status?: string;
  }): Promise<HeritageConditionReport[]> {
    const q = new URLSearchParams();
    if (params?.site_id) q.set('site_id', params.site_id);
    if (params?.city) q.set('city', params.city);
    if (params?.status) q.set('status', params.status);
    try {
      return await request<HeritageConditionReport[]>(`/reports?${q.toString()}`);
    } catch {
      return [];
    }
  },

  async createReport(data: {
    site_id: string;
    site_name: string;
    city: string;
    reported_by?: string;
    user_role?: string;
    issue_category: string;
    severity: string;
    description: string;
    image_url?: string;
  }): Promise<HeritageConditionReport> {
    return await request<HeritageConditionReport>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateReportStatus(
    id: string,
    status: string,
    note?: string,
    actor?: string
  ): Promise<HeritageConditionReport> {
    return await request<HeritageConditionReport>(`/reports/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note, actor }),
    });
  },
};
