export type TransportMode = 'DRIVE' | 'TRANSIT' | 'WALK' | 'AUTO';

export interface RouteStep {
  instruction: string;
  distance_km?: number;
  duration_mins?: number;
  mode?: string;
}

export interface RouteOption {
  mode: TransportMode | string;
  duration_mins: number;
  distance_km: number;
  estimated_fare: number | null;
  fare_status: string;
  fare_note?: string;
  summary?: string;
  line_info?: string;
  steps?: string[] | RouteStep[];
}

export interface RouteAlternative {
  mode: string;
  duration_mins: number;
  distance_km: number;
  estimated_fare: number;
  route_summary: string;
  traffic_level?: string;
}

export interface RouteResponse {
  origin: string;
  destination: string;
  distance_km: number;
  duration_mins: number;
  transport_mode: TransportMode | string;
  estimated_fare: number;
  fare_currency: string;
  route_summary: string;
  steps: RouteStep[];
  options?: RouteOption[];
  alternatives?: RouteAlternative[];
  google_maps_url?: string;
  traffic_level?: string;
}

export interface StateItem {
  id: string;
  name: string;
  capital: string;
  region: string;
  total_places: number;
  thumbnail_url?: string;
  coordinates?: { lat: number; lng: number };
}

export interface CityItem {
  id: string;
  name: string;
  state: string;
  state_id: string;
  lat: number;
  lng: number;
  description: string;
  places_count: number;
}

export interface PlaceSummary {
  id: string;
  name: string;
  state: string;
  city: string;
  category: string;
  summary: string;
  coordinates: { lat: number; lng: number };
  rating?: number;
  reviews_count?: string;
  thumbnail_url?: string;
  tags?: string[];
  features?: {
    map: boolean;
    navigation: boolean;
    ai: boolean;
    '3d': boolean;
  };
  heritage_status?: string;
  entry_fee?: { domestic: number; international: number; currency: string };
  visiting_hours?: string;
  area_neighborhood?: string;
}

export interface VisitingInfo {
  opening_time?: string;
  closing_time?: string;
  weekly_closed_day?: string;
  ideal_duration_hours?: number;
  photography_allowed?: boolean;
  guided_tours_available?: boolean;
  wheelchair_accessible?: boolean;
  nearby_parking?: boolean;
  metro_station?: string;
  railway_station?: string;
  bus_stop?: string;
}

export interface Model3DInfo {
  available: boolean;
  type?: string;
  model_url?: string;
  preview_image?: string;
  poly_count?: string;
}

export interface PlaceDetail extends PlaceSummary {
  country?: string;
  description?: string;
  history?: string;
  culture?: string;
  architecture?: string;
  images?: string[];
  best_time_to_visit?: string;
  visiting_info?: VisitingInfo;
  model_3d?: Model3DInfo;
}

export interface PlaceListResponse {
  total: number;
  limit: number;
  offset: number;
  data: PlaceSummary[];
}

export interface RailwayStationInfo {
  id: string;
  name: string;
  code: string;
  line: string;
  distance_km: number;
  walking_time_mins: number;
  road_time_mins: number;
  transfer_modes: string[];
}

export interface CityWeather {
  city: string;
  temperature_c: number;
  condition: string;
  humidity?: number;
  humidity_percent?: number;
  wind_kmh?: number;
  status?: string;
  advisory?: string;
}

export interface ItineraryStop {
  order: number;
  place_id: string;
  name?: string;
  place_name?: string;
  category?: string;
  arrival_time?: string;
  departure_time?: string;
  recommended_duration_minutes?: number;
  visit_minutes?: number;
  travel_time_from_previous_minutes?: number;
  travel_mode_from_previous?: string;
  distance_from_previous_km?: number;
  coordinates?: { lat: number; lng: number };
  tips?: string;
  visit_tips?: string;
  thumbnail_url?: string;
  activity?: string;
  start_time?: string;
  end_time?: string;
  travel_to_next?: {
    mode: string;
    duration_minutes: number;
    distance_km: number;
  };
}

export interface ItineraryRequest {
  city: string;
  duration_hours: number;
  origin?: string;
  origin_place_id?: string;
  interests?: string[];
  pace?: 'relaxed' | 'moderate' | 'fast' | 'packed';
  budget_level?: 'budget' | 'standard' | 'luxury' | 'moderate';
  budget?: string;
}

export interface ItineraryResponse {
  title?: string;
  city: string;
  duration_hours: number;
  total_places?: number;
  total_travel_time_minutes?: number;
  estimated_total_cost?: number;
  total_cost_estimate?: {
    budget: number;
    moderate: number;
    luxury: number;
  };
  summary: string;
  stops?: ItineraryStop[];
  timeline?: ItineraryStop[];
  estimated_total_visiting_minutes?: number;
  estimated_total_travel_minutes?: number;
}

export interface BudgetPlanOption {
  type: string;
  title?: string;
  mode_name: string;
  estimated_cost: number;
  duration_hours: number;
  stops_count: number;
  explanation: string;
  transport_summary?: string;
  stops: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  home_city?: string;
  travel_style?: string;
  interests?: string[];
  preferred_transport?: string;
  budget_preference?: string;
  survey?: OnboardingSurvey;
  created_at?: string;
}

export interface OnboardingSurvey {
  travel_style: string;
  traveler_type?: string;
  interests: string[];
  preferred_transport: string;
  budget_preference: string;
}

export interface FavoriteItem {
  id: string;
  user_id?: string;
  place_id: string;
  created_at: string;
  place?: PlaceSummary;
}

export interface TripStop {
  order: number;
  place_id: string;
  place_name: string;
  visit_minutes?: number;
  travel_minutes?: number;
}

export interface TripItem {
  id: string;
  title: string;
  city: string;
  duration_hours: number;
  total_places?: number;
  estimated_cost: number;
  created_at: string;
  stops: TripStop[];
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AIChatRequest {
  message: string;
  city?: string;
  place_id?: string;
  place_name?: string;
  history?: AIChatMessage[];
}

export interface AIChatResponse {
  reply: string;
  suggested_places?: Array<{ id: string; name: string; city: string; reason?: string }>;
  suggested_actions?: string[];
}

export interface NearbyPlacesResponse {
  origin: { latitude: number; longitude: number };
  radius_km: number;
  total: number;
  results: PlaceSummary[];
}
