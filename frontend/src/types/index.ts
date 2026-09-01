export type CategoryType = 
  | 'heritage'
  | 'coastal'
  | 'nature'
  | 'spiritual'
  | 'museum'
  | 'cultural'
  | 'historic'
  | 'temples'
  | 'beaches'
  | 'food'
  | 'adventure'
  | 'shopping'
  | 'architecture'
  | 'all';

export type FareStatus = 'provider_confirmed' | 'estimated' | 'unavailable' | 'live_data';
export type TransportMode = 'DRIVE' | 'TRANSIT' | 'WALK' | 'BICYCLE' | 'TRAIN' | 'TAXI' | 'AUTO';

export interface Coordinates {
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
}

export interface StateItem {
  id: string;
  name: string;
  capital: string;
  region: string;
  total_places: number;
  thumbnail_url?: string;
}

export interface EntryFee {
  domestic: number;
  international: number;
  currency: string;
}

export interface VisitingInfo {
  best_time_to_visit?: string;
  visiting_hours?: string;
  recommended_duration?: string;
  tips?: string[];
}

export interface Model3D {
  has_model: boolean;
  model_url?: string;
  available?: boolean;
  type?: string;
  asset?: string;
  video_url?: string;
}

export interface PlaceFeatures {
  map: boolean;
  navigation: boolean;
  ai: boolean;
  '3d': boolean;
}

export interface RailwayStationInfo {
  id: string;
  name: string;
  code: string;
  line: string; // e.g. "Western Line", "Central Line", "Harbour Line"
  distance_km: number;
  walking_time_mins: number;
  road_time_mins: number;
  transfer_modes: string[]; // e.g. ["Taxi", "BEST Bus", "Walk"]
}

export interface PlaceSummary {
  id: string;
  name: string;
  state: string;
  city: string;
  country: string;
  category: string;
  summary: string;
  coordinates: Coordinates;
  rating?: number;
  reviews_count?: string;
  thumbnail_url?: string;
  tags: string[];
  features: PlaceFeatures;
  heritage_status?: string;
  area_neighborhood?: string;
}

export interface PlaceDetail extends PlaceSummary {
  description: string;
  history?: string;
  culture?: string;
  architecture?: string;
  best_time_to_visit?: string;
  visiting_hours?: string;
  entry_fee?: EntryFee;
  visiting_info?: VisitingInfo;
  images: string[];
  model_3d?: Model3D;
  nearby_stations?: RailwayStationInfo[];
  why_visit_reasons?: string[];
}

export interface PlaceListResponse {
  total: number;
  limit: number;
  offset: number;
  data: PlaceSummary[];
}

export interface TransitStepDetails {
  transit_type: string;
  line: string;
  departure_stop: string;
  arrival_stop: string;
  num_stops: number;
}

export interface RouteOption {
  mode: TransportMode;
  duration_minutes: number;
  distance_km: number;
  estimated_fare?: number | null;
  fare_status: FareStatus;
  provider: string;
  transit_details?: TransitStepDetails[] | null;
  steps_summary?: string[] | null;
  speed_tier?: 'fastest' | 'cheapest' | 'balanced';
  fare_note?: string;
}

export interface LocationInfo {
  name: string;
  place_id?: string | null;
  latitude: number;
  longitude: number;
}

export interface RouteResponse {
  origin: LocationInfo;
  destination: LocationInfo;
  options: RouteOption[];
}

export interface MapsDirectionsResponse {
  origin: string;
  destination: string;
  travel_mode: string;
  url: string;
}

export interface NearbyPlaceItem {
  id: string;
  name: string;
  state: string;
  city: string;
  category: string;
  summary: string;
  coordinates: Coordinates;
  distance_km: number;
  thumbnail_url?: string;
  rating?: number;
  tags: string[];
  features: PlaceFeatures;
}

export interface NearbyPlacesResponse {
  origin: Coordinates;
  radius_km: number;
  count: number;
  results: NearbyPlaceItem[];
}

export interface SearchItem {
  id: string;
  name: string;
  state: string;
  city: string;
  category: string;
  summary: string;
  thumbnail_url?: string;
  tags: string[];
  score: number;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: SearchItem[];
}

export interface AISuggestedPlace {
  id: string;
  name: string;
  category: string;
  city: string;
  reason?: string;
}

export interface UserPreferences {
  interests: string[];
  budget: 'budget' | 'moderate' | 'premium';
  transport: 'walking' | 'train' | 'bus' | 'taxi' | 'auto' | 'mixed';
  pace: 'relaxed' | 'moderate' | 'fast';
  available_hours?: number;
  current_location?: string;
}

export interface AIChatRequest {
  message: string;
  conversation_id?: string;
  place_id?: string;
  city?: string;
  preferences?: UserPreferences;
}

export interface AIChatResponse {
  conversation_id: string;
  reply: string;
  suggested_places: AISuggestedPlace[];
  sources: string[];
  suggested_routes?: RouteOption[];
  recommended_stations?: RailwayStationInfo[];
}

export interface ItineraryRequest {
  city?: string;
  origin?: string;
  duration_hours?: number;
  interests?: string[];
  max_places?: number;
  budget_level?: 'budget' | 'moderate' | 'premium';
  transport_mode?: string;
}

export interface ItineraryStop {
  order: number;
  place_id: string;
  name: string;
  category: string;
  coordinates: Coordinates;
  thumbnail_url?: string;
  recommended_duration_minutes: number;
  travel_time_from_previous_minutes?: number | null;
  travel_mode_from_previous?: string | null;
  distance_from_previous_km?: number | null;
  estimated_cost?: number | null;
  visit_tips?: string | null;
  has_3d?: boolean;
}

export interface ItineraryResponse {
  city: string;
  duration_hours: number;
  total_places: number;
  estimated_total_visiting_minutes: number;
  estimated_total_travel_minutes: number;
  stops: ItineraryStop[];
  summary: string;
  estimated_total_cost?: number;
}

export interface BudgetPlanOption {
  type: 'CHEAPEST' | 'FASTEST' | 'BALANCED';
  title: string;
  transport_summary: string;
  estimated_cost: number;
  duration_hours: number;
  stops_count: number;
  explanation: string;
  stops: string[];
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

export interface OnboardingSurvey {
  traveler_type: string;
  trip_duration: string;
  budget_range: 'budget' | 'moderate' | 'premium';
  preferred_transport: string;
  interests: string[];
  accessibility_needs?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  home_city?: string;
  preferred_language?: string;
  survey?: OnboardingSurvey;
  is_survey_completed?: boolean;
  created_at?: string;
}

export interface FavoriteItem {
  id: string;
  place_id: string;
  place_name: string;
  city: string;
  category: string;
  thumbnail_url?: string;
  added_at?: string;
}

export interface TripStopItem {
  order: number;
  place_id: string;
  place_name: string;
  visit_minutes: number;
  travel_minutes?: number;
}

export interface TripItem {
  id: string;
  title: string;
  city: string;
  duration_hours: number;
  total_places: number;
  estimated_cost: number;
  stops: TripStopItem[];
  created_at?: string;
}

export interface CityWeather {
  city: string;
  temperature_c: number;
  condition: string;
  humidity: number;
  wind_kmh: number;
  status: string;
}
