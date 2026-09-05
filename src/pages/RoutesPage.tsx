import React, { useState } from 'react';
import { PlaceSummary } from '../types';
import { RouteCalculator } from '../components/destination/RouteCalculator';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { Navigation, MapPin, Train } from 'lucide-react';
import { GuideIllustration } from '../components/cultural-guides/GuideIllustrations';
import { GuideSpeechBubble } from '../components/cultural-guides/GuideSpeechBubble';

interface RoutesPageProps {
  places: PlaceSummary[];
  onSelectPlace?: (placeId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({ places, onSelectPlace, onNavigateTab }) => {
  const [selectedDestId, setSelectedDestId] = useState('gateway-of-india');
  const [activeView, setActiveView] = useState<'calculator' | 'map'>('calculator');
  const [mapOrigin, setMapOrigin] = useState('csmt');
  const [mapDest, setMapDest] = useState('gateway-of-india');

  const selectedPlace =
    places.find((p) => p.id === selectedDestId) ||
    places.find((p) => p.id === 'gateway-of-india') ||
    places[0];

  const lat = selectedPlace?.coordinates?.lat ?? 18.922;
  const lng = selectedPlace?.coordinates?.lng ?? 72.8347;

  const handleViewOnMap = (origin: string, dest: string) => {
    setMapOrigin(origin);
    setMapDest(dest);
    setActiveView('map');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#EFE8DF] shadow-warm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-200">
            <Navigation className="w-3.5 h-3.5 text-amber-700" />
            <span>Multimodal Transit Engine</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Journey Planner & Transit Routes
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Compare suburban trains, cabs, buses, and walking routes across Indian destinations with verified local fares.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-2xl border border-[#EFE8DF] self-start sm:self-auto">
          <button
            onClick={() => setActiveView('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeView === 'calculator'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Journey Planner
          </button>
          <button
            onClick={() => setActiveView('map')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeView === 'map'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* Safar Transit Specialist Companion Card with non-blocking GuideSpeechBubble */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-white to-stone-50 border border-emerald-200 shadow-warm">
        <GuideIllustration characterId="safar" size="md" animated={true} popIn={true} popDirection="left" />
        <div className="flex-1 w-full min-w-0">
          <GuideSpeechBubble
            characterId="safar"
            contextMode="transit"
            speechText="Let's find the smartest multimodal connection for your journey. Connecting suburban railway corridors, metro lines, and verified local auto-rickshaw fares across India."
            contextTag="Transit Specialist Pro-Tip"
            orientation="right"
            nonBlocking={true}
            quickActions={
              onNavigateTab
                ? [
                    {
                      label: 'Explore Mumbai Suburban Rail',
                      onClick: () => onNavigateTab('mumbai-local'),
                      primary: true,
                    },
                  ]
                : []
            }
          />
        </div>
      </div>

      {/* Quick Destination Switcher */}
      <div className="bg-white rounded-3xl p-5 border border-[#EFE8DF] shadow-warm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Select Destination Monument / Site:
          </label>
          <span className="text-xs text-stone-500">
            Selected: <strong className="text-amber-800 font-bold">{selectedPlace?.name || 'Selected Destination'}</strong>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {places.slice(0, 12).map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedDestId(p.id);
                setMapDest(p.id);
              }}
              className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all truncate ${
                selectedDestId === p.id
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-xs'
                  : 'bg-[#FAF8F5] text-stone-700 border-[#EFE8DF] hover:bg-stone-100'
              }`}
            >
              <MapPin className="w-3 h-3 text-amber-700 inline mr-1" />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* View Content */}
      {activeView === 'calculator' ? (
        selectedPlace && (
          <RouteCalculator
            destinationId={selectedPlace.id}
            destinationName={selectedPlace.name}
            destinationLat={lat}
            destinationLng={lng}
            destinationCity={selectedPlace.city}
            onViewOnMap={handleViewOnMap}
          />
        )
      ) : (
        <div className="space-y-4">
          <InteractiveMap
            onSelectPlace={(id) => onSelectPlace?.(id)}
            selectedCity={selectedPlace?.city || 'Mumbai'}
            initialOrigin={mapOrigin}
            initialDestination={mapDest}
            height="620px"
          />
        </div>
      )}
    </div>
  );
};
