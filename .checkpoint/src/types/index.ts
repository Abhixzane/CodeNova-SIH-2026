export type TransportMode = 'DRIVE' | 'TRANSIT' | 'WALK' | 'AUTO' | 'BICYCLE';

export interface RouteStep {
  instruction: string;
  distance_km?: number;
  duration_mins?: number;
  mode?: string;
}

export interface RouteOption {
  mode: TransportMode | string;
  duration_mins?: number;
  duration_minutes?: number;
  distance_km: number;
  estimated_fare: number | null;
  fare_status: string;
  fare_note?: string;
  summary?: string;
  provider?: string;
  speed_tier?: string;
  line_info?: string;
  steps?: string[] | RouteStep[];
  steps_summary?: string[];
  polyline?: [number, number][];
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
  origin: any;
  destination: any;
  distance_km?: number;
  duration_mins?: number;
  transport_mode?: TransportMode | string;
  estimated_fare?: number;
  fare_currency?: string;
  route_summary?: string;
  steps?: RouteStep[];
  options?: RouteOption[];
  alternatives?: RouteAlternative[];
  google_maps_url?: string;
  traffic_level?: string;
  polyline?: [number, number][];
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
  role?: UserRole;
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

export interface PlatformStats {
  heritage_count: number;
  destinations_count: number;
  states_count: number;
  cities_count: number;
  mumbai_local_stations_count: number;
  three_d_models_count: number;
  transport_modes: string[];
}

export interface MumbaiLocalStation {
  order: number;
  code: string;
  name: string;
  km_from_start: number;
  lat: number;
  lng: number;
  is_interchange: boolean;
  interchanges: string[];
  lines?: string[];
}

export interface MumbaiLocalRouteResult {
  from: MumbaiLocalStation;
  to: MumbaiLocalStation;
  from_line: string;
  to_line: string;
  route_type: 'direct' | 'interchange';
  interchange?: {
    code: string;
    name: string;
    description: string;
  } | null;
  distance_km: number;
  journey_time_minutes: number;
  stops_count: number;
  intermediate_stops: MumbaiLocalStation[];
  fare: {
    second_class: number;
    first_class: number;
    ac_local: number;
    currency: string;
    label: string;
    source: string;
  };
}

export interface HeritageSite extends PlaceSummary {
  historical_significance?: string;
  architectural_style?: string;
  best_time_to_visit?: string;
  timings?: string;
  nearest_transport?: {
    railway_station?: string;
    metro_station?: string;
    airport?: string;
  };
}

export type ProvenanceBadge =
  | 'OFFICIAL'
  | 'VERIFIED_SECONDARY'
  | 'COMMUNITY'
  | 'UNVERIFIED'
  | 'ESTIMATED'
  | 'MODELLED'
  | 'SIMULATED DEMO DATA';

export type VerificationStatus =
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'COMMUNITY_LISTED'
  | 'UNVERIFIED';

export type UserRole = 'TRAVELLER' | 'PROVIDER' | 'GOVERNMENT' | 'ADMIN';

export interface CulturalItem {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  region: string;
  description: string;
  cultural_significance: string;
  provenance: ProvenanceBadge;
  thumbnail_url: string;
  best_locations: string[];
  tags: string[];
}

export interface ArtisanProfile {
  id: string;
  artisan_name: string;
  craft_tradition: string;
  gi_tag_status: boolean;
  city: string;
  state: string;
  region: string;
  story: string;
  workshop_location: string;
  visiting_allowed: boolean;
  demonstration_available: boolean;
  experience_duration: string;
  price_range: string;
  verification_status: VerificationStatus;
  provenance: ProvenanceBadge;
  thumbnail_url: string;
  products: string[];
}

export interface LocalProvider {
  id: string;
  name: string;
  category: 'ACCOMMODATION' | 'GUIDE' | 'ARTISAN' | 'WORKSHOP' | 'FOOD' | 'TRANSPORT';
  city: string;
  state: string;
  verification_status: VerificationStatus;
  provenance: ProvenanceBadge;
  rating: number;
  reviews_count: number;
  contact: {
    phone?: string;
    email?: string;
    booking_url?: string;
    address?: string;
  };
  pricing: string;
  description: string;
  languages: string[];
  thumbnail_url: string;
  specialties: string[];
}

export interface AccessibilityRecord {
  place_id: string;
  place_name: string;
  city: string;
  state: string;
  wheelchair_access: 'YES' | 'NO' | 'PARTIAL' | 'UNKNOWN';
  ramp_available: boolean;
  accessible_toilet: boolean;
  elevator_available: boolean;
  dedicated_parking: boolean;
  tactile_paving_or_braille: boolean;
  audio_guide_available: boolean;
  seating_resting_points: boolean;
  flat_terrain_percentage: number;
  accessibility_notes: string;
  provenance: ProvenanceBadge;
}

export interface InfrastructureFacility {
  id: string;
  name: string;
  type: 'TOILET' | 'PARKING' | 'MEDICAL' | 'POLICE' | 'TOURIST_INFO' | 'WATER_ATM';
  city: string;
  lat: number;
  lng: number;
  address: string;
  is_accessible: boolean;
  is_24x7: boolean;
  contact: string;
  description?: string;
  distance_km?: number;
}

export interface DestinationHealthCity {
  city_id: string;
  city_name: string;
  state: string;
  visitor_load_index: number;
  transport_load_index: number;
  heritage_risk_index: number;
  accessibility_score: number;
  sanitation_readiness: number;
  infrastructure_gap_score: number;
  local_business_participation: number;
  peak_season_warning: string;
  critical_gaps: string[];
  recommendations: string[];
}

export interface TourismGapZone {
  id: string;
  zone_name: string;
  city: string;
  footfall_density: 'HIGH' | 'VERY_HIGH' | 'MODERATE';
  transit_connectivity_gap: 'HIGH' | 'MODERATE' | 'LOW';
  sanitation_gap: 'CRITICAL' | 'MODERATE' | 'SUFFICIENT';
  parking_shortage: boolean;
  first_aid_gap: boolean;
  recommended_action: string;
}

export interface DestinationHealthResponse {
  provenance_disclaimer: string;
  provenance_badge: ProvenanceBadge;
  cities: DestinationHealthCity[];
  gap_map_zones: TourismGapZone[];
}

export interface HeritageConditionReportTimeline {
  status: string;
  timestamp: string;
  note: string;
  actor: string;
}

export interface HeritageConditionReport {
  id: string;
  site_id: string;
  site_name: string;
  city: string;
  reported_by: string;
  user_role: UserRole;
  issue_category:
    | 'STRUCTURAL_DAMAGE'
    | 'WASTE_LITTER'
    | 'MISSING_SIGNAGE'
    | 'ACCESSIBILITY_BARRIER'
    | 'LIGHTING_SAFETY'
    | 'FACILITY_BREAKDOWN';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status:
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'VERIFIED'
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'RESOLVED'
    | 'REJECTED';
  timeline: HeritageConditionReportTimeline[];
  created_at: string;
  updated_at: string;
  image_url?: string;
}

export interface HeritageCluster {
  id: string;
  name: string;
  city: string;
  state: string;
  description: string;
  sites_count: number;
  recommended_duration_hours: number;
  transit_tip: string;
  sites: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    thumbnail_url?: string;
  }>;
}

export interface CommuterNetwork {
  id: string;
  city: string;
  network_name: string;
  operator: string;
  type: 'SUBURBAN_RAIL' | 'METRO' | 'RRTS' | 'FERRY';
  daily_ridership: string;
  lines_count: number;
  stations_count: number;
  fare_structure: string;
  description: string;
  lines: Array<{
    name: string;
    color: string;
    key_stations: string[];
  }>;
}

