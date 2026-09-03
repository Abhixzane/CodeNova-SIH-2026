import React, { useState, useEffect } from 'react';
import { PlaceDetail } from '../types';
import { api } from '../services/api';
import { useFavorites } from '../contexts/FavoritesContext';
import {
  ArrowLeft,
  Heart,
  Share2,
  Compass,
  Box,
  Navigation,
  BookOpen,
  Sparkles,
  MapPin,
  Train,
  Clock,
  Ticket,
  CheckCircle,
  Hotel,
  Star,
  ShieldCheck,
  Building
} from 'lucide-react';
import { GatewayOfIndia3D } from '../components/threed/GatewayOfIndia3D';
import { RouteCalculator } from '../components/destination/RouteCalculator';
import { RailwayStationsCard } from '../components/destination/RailwayStationsCard';
import { VisitingInfoCard } from '../components/destination/VisitingInfoCard';
import { NearbyCarousel } from '../components/destination/NearbyCarousel';

interface DestinationDetailPageProps {
  placeId: string;
  onBack: () => void;
  onSelectPlace: (id: string) => void;
  onOpenAIChat?: (placeId: string, placeName: string) => void;
}

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({
  placeId,
  onBack,
  onSelectPlace,
  onOpenAIChat,
}) => {
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | '3d' | 'routes' | 'history' | 'hotels'>('overview');
  const [hotels, setHotels] = useState<any[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        const data = await api.getPlaceById(placeId);
        if (isMounted) {
          setPlace(data);
          // If nearby_hotels attached, set directly, otherwise query nearby
          if ((data as any).nearby_hotels && (data as any).nearby_hotels.length > 0) {
            setHotels((data as any).nearby_hotels);
          } else {
            const pLat = data.coordinates?.lat ?? (data.coordinates as any)?.latitude;
            const pLng = data.coordinates?.lng ?? (data.coordinates as any)?.longitude;
            api.getNearbyHotels(pLat, pLng, data.city).then((h) => {
              if (isMounted && h.length > 0) setHotels(h);
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load destination details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [placeId]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Loading Heritage Dossier...
        </span>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-stone-200 rounded-2xl max-w-lg mx-auto my-12">
        <MapPin className="w-12 h-12 text-stone-400 mb-3" />
        <h3 className="text-base font-bold text-stone-900">Destination Dossier Unavailable</h3>
        <p className="text-xs text-stone-500 mt-1 max-w-xs">{error || 'Place record could not be found.'}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
        >
          ← Return to Explorer
        </button>
      </div>
    );
  }

  const lat = place.coordinates?.lat ?? (place.coordinates as any)?.latitude ?? 18.9220;
  const lng = place.coordinates?.lng ?? (place.coordinates as any)?.longitude ?? 72.8347;

  // Use dynamic nearby_stations from server if available
  const serverStations = (place as any).nearby_stations;
  const railwayStations = Array.isArray(serverStations) && serverStations.length > 0
    ? serverStations
    : [
        {
          id: 'nearby-stn',
          name: `${place.city || 'Central'} Railway Hub`,
          code: 'STN',
          distance_km: 3.5,
          walking_time_mins: 40,
          road_time_mins: 12,
          transfer_modes: ['Taxi', 'Auto-Rickshaw'],
          line: 'Mainline Corridor'
        }
      ];

  const has3D = Boolean(place.features && place.features['3d']);
  const favActive = isFavorite(place.id);
  const nearby = (place as any).nearby_places || [];

  return (
    <div className="min-h-screen bg-stone-50/50 text-stone-900 pb-20">
      {/* Top Hero Dossier Banner */}
      <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-2xl border border-stone-200 shadow-sm bg-stone-200">
        <img
          src={place.thumbnail_url || (place.images && place.images[0]) || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80'}
          alt={place.name}
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle gradient overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-stone-900/10" />

        {/* Back + Action Bar */}
        <div className="absolute top-5 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-stone-900 text-xs font-semibold shadow-xs transition backdrop-blur-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(place.id)}
              className={`p-2.5 rounded-full shadow-xs transition backdrop-blur-sm ${
                favActive
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-white/90 hover:bg-white text-stone-700'
              }`}
              title="Save to Favorites"
            >
              <Heart className={`w-4 h-4 ${favActive ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-xs transition backdrop-blur-sm"
              title="Share Place"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Title & Badges */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
              {place.category}
            </span>
            {place.heritage_status && (
              <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-xs">
                {place.heritage_status}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
            {place.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{place.area_neighborhood || place.city}, {place.state}, {place.country}</span>
          </p>
        </div>
      </div>

      {/* Main Dossier Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-stone-200 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Dossier Overview', icon: Compass },
            { id: '3d', label: '3D WebGL Explorer', icon: Box, disabled: !has3D },
            { id: 'routes', label: 'Multi-Modal Routes & Fares', icon: Navigation },
            { id: 'hotels', label: 'Nearby Stays', icon: Hotel, count: hotels.length },
            { id: 'history', label: 'History & Architecture', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                disabled={tab.disabled}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : tab.disabled
                    ? 'text-stone-400 bg-stone-100 cursor-not-allowed opacity-60'
                    : 'text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    activeTab === tab.id ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Summary Card */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>About this Destination</span>
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {place.description || place.summary}
                </p>

                {place.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {place.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 text-xs border border-stone-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Railway Stations Intelligence */}
              <RailwayStationsCard
                placeName={place.name}
                stations={railwayStations}
                onSelectStationForRoute={() => {
                  setActiveTab('routes');
                }}
              />

              {/* Visiting Guidelines */}
              <VisitingInfoCard place={place} />
            </div>

            {/* Right Sticky Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick AI Tour Guide Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>AI Travel Guide</span>
                </div>
                <h4 className="text-base font-extrabold text-stone-900">
                  Ask AI about {place.name}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Ask about architectural secrets, optimal photography times, historical dynasties, and local culinary specialties.
                </p>
                <button
                  onClick={() => onOpenAIChat && onOpenAIChat(place.id, place.name)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>

              {/* 3D Trigger Card */}
              {has3D && (
                <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
                    <Box className="w-4 h-4 text-indigo-600" />
                    <span>Interactive 3D Model</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Examine arches, stone carvings, and architectural details in real-time WebGL.
                  </p>
                  <button
                    onClick={() => setActiveTab('3d')}
                    className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-semibold text-xs transition border border-indigo-200 flex items-center justify-center gap-2"
                  >
                    <Box className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Open 3D Canvas</span>
                  </button>
                </div>
              )}

              {/* Quick Accommodation Teaser */}
              {hotels.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Hotel className="w-3.5 h-3.5 text-amber-600" /> Nearby Accommodations
                    </span>
                    <button
                      onClick={() => setActiveTab('hotels')}
                      className="text-[11px] font-semibold text-emerald-600 hover:underline"
                    >
                      View all ({hotels.length})
                    </button>
                  </div>
                  <div className="space-y-2">
                    {hotels.slice(0, 2).map((h) => (
                      <div key={h.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                        <div className="font-bold text-stone-900 truncate">{h.name}</div>
                        <div className="flex items-center justify-between text-stone-500 text-[11px] mt-1">
                          <span>{h.category}</span>
                          <span className="font-semibold text-emerald-700">~{h.distance_km || h.calculated_distance_km || 1.2} km</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: 3D EXPLORER */}
        {activeTab === '3d' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">3D Heritage Landmark Explorer</h2>
                <p className="text-xs text-stone-600">
                  Rotate, zoom, toggle wireframe, and inspect architectural features in interactive WebGL.
                </p>
              </div>
            </div>
            <GatewayOfIndia3D
              onPlanVisit={() => setActiveTab('routes')}
              height="h-[600px]"
            />
          </div>
        )}

        {/* TAB 3: ROUTES & FARES */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <RouteCalculator
              destinationId={place.id}
              destinationName={place.name}
              destinationLat={lat}
              destinationLng={lng}
              destinationCity={place.city}
              initialOrigin={railwayStations[0]?.name || undefined}
            />
          </div>
        )}

        {/* TAB 4: NEARBY HOTELS / STAY */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">Nearby Accommodations & Heritage Stays</h2>
                <p className="text-xs text-stone-600">
                  Verified hotels, heritage palaces, and luxury resorts near {place.name}.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
                {hotels.length} verified stays
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                      <img
                        src={hotel.thumbnail_url}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md bg-white/95 text-stone-900 text-[11px] font-bold shadow-xs">
                          {hotel.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          <span>{hotel.rating}</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <h4 className="font-extrabold text-stone-900 text-sm leading-snug">{hotel.name}</h4>
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span className="truncate">{hotel.location}</span>
                      </p>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100 text-stone-600">
                        <span>Distance:</span>
                        <span className="font-bold text-stone-900">
                          {hotel.calculated_distance_km ? `${hotel.calculated_distance_km} km` : `${hotel.distance_km} km`}
                        </span>
                      </div>

                      {hotel.price_indication && (
                        <div className="flex items-center justify-between text-xs text-stone-600">
                          <span>Indicative Tariff:</span>
                          <span className="font-extrabold text-emerald-700">{hotel.price_indication}</span>
                        </div>
                      )}

                      {hotel.amenities && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {hotel.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => {
                        window.open(`https://www.google.com/maps/search/${encodeURIComponent(hotel.name + ' ' + hotel.location)}`, '_blank');
                      }}
                      className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Map Location & Directions</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl shadow-xs">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-900">Historical Heritage & Origins</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {place.history || 'Constructed in the historic era, this landmark holds immense cultural, sculptural, and architectural significance for Indian heritage.'}
              </p>
            </div>

            {place.culture && (
              <div className="space-y-2 border-t border-stone-200 pt-6">
                <h3 className="text-xl font-bold text-stone-900">Cultural Significance</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {place.culture}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Nearby Attractions Carousel */}
        {nearby && nearby.length > 0 && (
          <div className="pt-6 border-t border-stone-200">
            <NearbyCarousel
              places={nearby}
              currentPlaceName={place.name}
              onSelectPlace={onSelectPlace}
            />
          </div>
        )}
      </div>
    </div>
  );
};
