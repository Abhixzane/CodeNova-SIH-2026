import React, { useState, useEffect } from 'react';
import { PlaceDetail } from '../types';
import { api } from '../services/api';
import {
  ArrowLeft,
  MapPin,
  Compass,
  Sparkles,
  Navigation,
  Box,
  Share2,
  Heart,
  Landmark,
  ShieldCheck,
  Calendar,
  BookOpen,
  Train,
  CheckCircle2,
  Clock,
  IndianRupee,
  Layers,
  Info
} from 'lucide-react';
import { VisitingInfoCard } from '../components/destination/VisitingInfoCard';
import { RailwayStationsCard } from '../components/destination/RailwayStationsCard';
import { NearbyCarousel } from '../components/destination/NearbyCarousel';
import { RouteCalculator } from '../components/destination/RouteCalculator';
import { GatewayOfIndia3D } from '../components/threed/GatewayOfIndia3D';
import { VirasatHeritageGuide } from '../components/cultural-guides/VirasatHeritageGuide';
import { SafarRouteGuide } from '../components/cultural-guides/SafarRouteGuide';

interface DestinationDetailPageProps {
  placeId: string;
  onBack: () => void;
  onSelectPlace: (placeId: string) => void;
  onOpenAIChat?: (placeId: string, placeName: string) => void;
  isFavorite?: (placeId: string) => boolean;
  toggleFavorite?: (placeId: string) => void;
}

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({
  placeId,
  onBack,
  onSelectPlace,
  onOpenAIChat,
  isFavorite = () => false,
  toggleFavorite = () => {},
}) => {
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getPlaceById(placeId);
        if (isMounted) {
          setPlace(data);
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
        <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Loading Heritage Dossier...
        </span>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-[#EFE8DF] rounded-3xl max-w-lg mx-auto my-12 shadow-warm">
        <MapPin className="w-12 h-12 text-stone-400 mb-3" />
        <h3 className="font-serif text-lg font-bold text-stone-900">Destination Dossier Unavailable</h3>
        <p className="text-xs text-stone-500 mt-1 max-w-xs">{error || 'Place record could not be found.'}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-xs"
        >
          ← Return to Explorer
        </button>
      </div>
    );
  }

  const lat = place.coordinates?.lat ?? (place.coordinates as any)?.latitude ?? 18.922;
  const lng = place.coordinates?.lng ?? (place.coordinates as any)?.longitude ?? 72.8347;

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
          line: 'Mainline Corridor',
        },
      ];

  const has3D = Boolean(place.features && place.features['3d']);
  const favActive = isFavorite(place.id);
  const nearby = (place as any).nearby_places || [];

  return (
    <div className="min-h-screen text-stone-900 pb-20 space-y-10 animate-fadeIn">
      {/* 1. Hero image & Top Navigation */}
      <div className="relative h-80 sm:h-[420px] w-full overflow-hidden rounded-3xl border border-[#EFE8DF] shadow-warm bg-stone-100">
        <img
          src={
            place.thumbnail_url ||
            (place.images && place.images[0]) ||
            'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80'
          }
          alt={place.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-stone-900/10" />

        {/* Back and Action Bar */}
        <div className="absolute top-5 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-stone-900 text-xs font-semibold shadow-xs transition backdrop-blur-sm"
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

        {/* 2. Monument name + 3. Location & Heritage Status */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 space-y-2 text-white">
          <div className="flex items-center gap-2 flex-wrap">
            {place.heritage_status && (
              <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 text-xs font-bold shadow-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                <span>{place.heritage_status}</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
              {place.category}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight drop-shadow-sm">
            {place.name}
          </h1>

          <div className="text-xs sm:text-sm text-stone-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              {place.area_neighborhood ? `${place.area_neighborhood}, ` : ''}
              {place.city}, {place.state}, {place.country || 'India'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Editorial Content Column */}
      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-14 px-2">
        {/* 4. Short Introduction */}
        <section className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Overview</span>
          </div>
          <p className="font-serif text-lg sm:text-xl text-stone-800 leading-relaxed">
            {place.description || place.summary}
          </p>
          {place.tags && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {place.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* 5. History */}
        <section className="space-y-4 pt-6 border-t border-[#EFE8DF]">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Historical Significance</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Origins & Heritage Chronicles
          </h2>
          <div className="text-sm text-stone-700 leading-relaxed space-y-3">
            <p>
              {place.history ||
                `${place.name} has stood for centuries as an enduring symbol of regional craftsmanship, civic legacy, and cultural identity.`}
            </p>
            {place.culture && (
              <p className="text-stone-600 italic">
                "{place.culture}"
              </p>
            )}
          </div>
        </section>

        {/* 6. Architecture */}
        <section className="space-y-4 pt-6 border-t border-[#EFE8DF]">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" />
            <span>Architectural Craftsmanship</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Structural Geometry & Masonry
          </h2>
          <p className="text-sm text-stone-700 leading-relaxed">
            {(place as any).architecture ||
              `${place.name} showcases signature traditional Indian architectural motifs, combining precision stone geometry, ornate arches, and master craftsmanship designed to withstand the test of time.`}
          </p>

          {/* Virasat Cultural Heritage Guide */}
          <div className="pt-2">
            <VirasatHeritageGuide
              monumentName={place.name}
              location={`${place.city}, ${place.state}`}
              heritageStatus={place.heritage_status || 'Catalogued Heritage Site'}
              onAskHeritageAI={(prompt) => onOpenAIChat?.(place.id, prompt)}
              onView3DModel={has3D ? () => {} : undefined}
            />
          </div>
        </section>

        {/* 7. Visitor Information */}
        <section className="space-y-4 pt-6 border-t border-[#EFE8DF]">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Practical Information</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Visitor Guidelines & Timings
          </h2>
          <VisitingInfoCard place={place} />
        </section>

        {/* 8. Nearby Places */}
        {nearby && nearby.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-[#EFE8DF]">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Surrounding Heritage</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Nearby Places of Interest
            </h2>
            <NearbyCarousel
              places={nearby}
              currentPlaceName={place.name}
              onSelectPlace={onSelectPlace}
            />
          </section>
        )}

        {/* 9. How to Reach */}
        <section className="space-y-6 pt-6 border-t border-[#EFE8DF]">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" />
            <span>Transit & Access</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            How to Reach {place.name}
          </h2>

          {/* Railway Stations Card */}
          <RailwayStationsCard
            placeName={place.name}
            stations={railwayStations}
            onSelectStationForRoute={() => {}}
          />

          {/* Safar Cultural Route Guide */}
          <SafarRouteGuide
            origin={railwayStations[0]?.name || `${place.city} Station`}
            destination={place.name}
            cityContext={place.city}
            estimatedFare={railwayStations[0] ? `₹${Math.max(10, Math.round(railwayStations[0].distance_km * 18))}` : '₹30 - ₹120'}
            onOpenRailTransit={() => {}}
          />

          {/* Multimodal Journey Planner */}
          <RouteCalculator
            destinationId={place.id}
            destinationName={place.name}
            destinationLat={lat}
            destinationLng={lng}
            destinationCity={place.city}
            initialOrigin={railwayStations[0]?.name || undefined}
          />
        </section>

        {/* 10. 3D Experience (if available) */}
        {has3D && (
          <section className="space-y-4 pt-6 border-t border-[#EFE8DF]">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5" />
              <span>3D Digital Twin</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Interactive 3D Heritage Explorer
            </h2>
            <p className="text-xs text-stone-600">
              Inspect architectural arches, dome elevations, and stone masonry details in WebGL.
            </p>
            <GatewayOfIndia3D
              onPlanVisit={() => {}}
              height="h-[550px]"
            />
          </section>
        )}

        {/* 11. AI Guide */}
        <section className="pt-6 border-t border-[#EFE8DF]">
          <div className="rounded-3xl bg-white border border-[#EFE8DF] shadow-warm p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Personal Cultural Concierge</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Ask YatraVerse about {place.name}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Curious about architectural secrets, morning photography lighting, or hidden courtyard carvings? Ask our cultural guide.
            </p>
            <button
              onClick={() => onOpenAIChat && onOpenAIChat(place.id, place.name)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Cultural Conversation</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
