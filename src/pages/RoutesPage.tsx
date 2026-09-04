import React, { useState, useEffect } from 'react';
import { PlaceSummary } from '../types';
import { RouteCalculator } from '../components/destination/RouteCalculator';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { Compass, Route as RouteIcon, MapPin, IndianRupee, Layers, Navigation } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <RouteIcon className="w-3.5 h-3.5" />
            <span>Multi-Modal Travel & Fare Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Route Studio & Fare Estimator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Compare real road travel, suburban local trains, buses, and walking routes across Indian destinations with verified fares and live map polyline tracing.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeView === 'calculator'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fare & Mode Studio
          </button>
          <button
            onClick={() => setActiveView('map')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeView === 'map'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Interactive Map Route</span>
          </button>
        </div>
      </div>

      {/* Destination Picker */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Destination:
          </label>
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{selectedPlace?.name || 'Selected'}</strong> ({selectedPlace?.city || 'India'})
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
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              📍 {p.name}
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
