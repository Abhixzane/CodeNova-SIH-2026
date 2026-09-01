import React, { useEffect, useState } from 'react';
import { PlaceDetail } from '../types';
import { api } from '../services/api';
import { getNearbyStationsForPlace } from '../services/railwayStations';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { RouteCalculator } from '../components/destination/RouteCalculator';
import { VisitingInfoCard } from '../components/destination/VisitingInfoCard';
import { NearbyCarousel } from '../components/destination/NearbyCarousel';
import { RailwayStationsCard } from '../components/destination/RailwayStationsCard';
import { GatewayOfIndia3D } from '../components/threed/GatewayOfIndia3D';
import { useFavorites } from '../contexts/FavoritesContext';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Box, 
  ArrowLeft, 
  Share2, 
  Heart
} from 'lucide-react';

interface DestinationDetailPageProps {
  placeId: string;
  onBack: () => void;
  onSelectPlace: (id: string) => void;
  onOpenAIChat?: (placeId: string, placeName: string) => void;
  onView3D?: (placeId: string) => void;
}

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({
  placeId,
  onBack,
  onSelectPlace,
  onOpenAIChat,
  onView3D,
}) => {
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [nearby, setNearby] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | '3d' | 'routes' | 'history'>('overview');
  const { isFavorite, toggleFavorite } = useFavorites();

  const loadDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPlace(placeId);
      setPlace(data);

      const lat = data.coordinates.lat ?? (data.coordinates as any).latitude ?? 18.9220;
      const lng = data.coordinates.lng ?? (data.coordinates as any).longitude ?? 72.8347;
      const nearbyData = await api.getNearbyPlaces(lat, lng, 15, 6);
      setNearby(nearbyData.results || nearbyData);
    } catch (err: any) {
      setError(err.message || 'Failed to load destination details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [placeId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Retrieving verified heritage dossier and transit connections..." />
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorMessage message={error || 'Destination not found'} onRetry={loadDetails} />
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-parchment-100 text-charcoal-light text-xs font-semibold hover:text-charcoal"
        >
          ← Return to Destinations
        </button>
      </div>
    );
  }

  const lat = place.coordinates.lat ?? (place.coordinates as any).latitude ?? 18.9220;
  const lng = place.coordinates.lng ?? (place.coordinates as any).longitude ?? 72.8347;
  const railwayStations = getNearbyStationsForPlace(place.id);
  const has3D = place.features && place.features['3d'];
  const favActive = isFavorite(place.id);

  return (
    <div className="min-h-screen bg-parchment text-charcoal pb-20">
      {/* Top Hero Dossier Banner */}
      <div className="relative h-96 w-full overflow-hidden bg-parchment-100">
        <img
          src={place.thumbnail_url || (place.images && place.images[0]) || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80'}
          alt={place.name}
          className="w-full h-full object-cover object-center scale-105 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d19] via-[#080d19]/60 to-transparent" />

        {/* Back + Action Bar */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-parchment-300 text-charcoal hover:text-charcoal text-xs font-semibold transition"
          >
            <ArrowLeft size={16} />
            <span>Back to Explorer</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(place.id)}
              className={`p-2.5 rounded-full backdrop-blur-md border transition ${
                favActive
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-black/60 border-parchment-300 text-charcoal-light hover:text-rose-400'
              }`}
              title="Save to Wishlist"
            >
              <Heart size={18} className={favActive ? 'fill-rose-400' : ''} />
            </button>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Destination link copied to clipboard!');
                }
              }}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-parchment-300 text-charcoal-light hover:text-charcoal transition"
              title="Share Place"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Hero Title & Badges */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-terracotta/20 border border-sage text-terracotta text-xs font-bold uppercase tracking-wider">
              {place.category}
            </span>
            {place.heritage_status && (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                {place.heritage_status}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-charcoal tracking-tight">{place.name}</h1>
          <p className="text-xs sm:text-sm text-charcoal-light flex items-center gap-2">
            <MapPin size={16} className="text-terracotta" />
            <span>{place.area_neighborhood || place.city}, {place.state}, {place.country}</span>
          </p>
        </div>
      </div>

      {/* Main Dossier Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-parchment-300 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Dossier Overview' },
            { id: '3d', label: '3D WebGL Explorer', disabled: !has3D },
            { id: 'routes', label: 'Multi-Modal Routes & Fares' },
            { id: 'history', label: 'History & Architecture' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              disabled={tab.disabled}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-terracotta text-slate-950 shadow-md shadow-emerald-500/20'
                  : tab.disabled
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-charcoal-light hover:text-charcoal hover:bg-parchment-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Summary Card */}
              <div className="bg-parchment-50 border border-parchment-300 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                  <Compass size={18} className="text-terracotta" />
                  <span>About this Destination</span>
                </h3>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  {place.description || place.summary}
                </p>

                {place.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {place.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-parchment-100 text-charcoal-light text-xs border border-parchment-300"
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
                onSelectStationForRoute={(st) => {
                  setActiveTab('routes');
                }}
              />

              {/* Visiting Guidelines */}
              <VisitingInfoCard place={place} />
            </div>

            {/* Right Sticky Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick AI Tour Guide Card */}
              <div className="bg-gradient-to-br from-[#0c1427] to-[#0d1c38] border border-emerald-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-terracotta text-xs font-bold uppercase">
                  <Sparkles size={16} /> AI Travel Guide
                </div>
                <h4 className="text-lg font-bold text-charcoal">Ask AI about {place.name}</h4>
                <p className="text-xs text-charcoal-light leading-relaxed">
                  Get contextual heritage stories, secret photography spots, and multi-modal transit advice.
                </p>
                <button
                  onClick={() => onOpenAIChat && onOpenAIChat(place.id, place.name)}
                  className="w-full py-3 rounded-xl bg-terracotta hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} /> Ask AI Assistant
                </button>
              </div>

              {/* 3D Trigger Card */}
              {has3D && (
                <div className="bg-parchment-50 border border-parchment-300 rounded-3xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-terracotta text-xs font-bold">
                    <Box size={16} /> Interactive 3D Model
                  </div>
                  <p className="text-xs text-charcoal-light">
                    Examine the basalt arches, domes, and architectural hotspots in real-time WebGL.
                  </p>
                  <button
                    onClick={() => setActiveTab('3d')}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-charcoal font-semibold text-xs transition border border-parchment-300 flex items-center justify-center gap-2"
                  >
                    <Box size={14} className="text-terracotta" /> Open 3D Canvas
                  </button>
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
                <h2 className="text-2xl font-bold text-charcoal">3D Heritage Landmark Explorer</h2>
                <p className="text-xs text-charcoal-light">
                  Rotate, zoom, and inspect architectural features with custom lighting presets.
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
              initialOrigin="csmt"
            />
          </div>
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-parchment-50 border border-parchment-300 rounded-3xl p-8 space-y-6 max-w-4xl">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-charcoal">Historical Heritage & Origins</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                {place.history || 'Constructed in the early 20th century, this historic landmark holds immense cultural and architectural significance for India.'}
              </p>
            </div>

            {place.culture && (
              <div className="space-y-2 border-t border-parchment-300 pt-6">
                <h3 className="text-xl font-bold text-charcoal">Cultural Significance</h3>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  {place.culture}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Nearby Attractions Carousel */}
        {nearby && nearby.length > 0 && (
          <div className="pt-6 border-t border-parchment-300">
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
