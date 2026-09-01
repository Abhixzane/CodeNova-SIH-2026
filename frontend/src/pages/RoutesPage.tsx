import React, { useState } from 'react';
import { PlaceSummary } from '../types';
import { RouteCalculator } from '../components/destination/RouteCalculator';
import { Compass, Route, MapPin, IndianRupee } from 'lucide-react';

interface RoutesPageProps {
  places: PlaceSummary[];
  onSelectPlace?: (placeId: string) => void;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({ places }) => {
  const [selectedDestId, setSelectedDestId] = useState('marine-drive');

  const selectedPlace = places.find((p) => p.id === selectedDestId) || places[0];
  const lat = selectedPlace?.coordinates?.lat ?? selectedPlace?.coordinates?.latitude ?? 18.9431;
  const lng = selectedPlace?.coordinates?.lng ?? selectedPlace?.coordinates?.longitude ?? 72.8230;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold border border-emerald-500/20">
          <Route className="w-3.5 h-3.5" />
          <span>Multi-Modal Travel & Fare Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-['Plus_Jakarta_Sans']">
          Route Studio & Fare Estimator
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-light max-w-2xl">
          Compare road travel, suburban local trains, buses, and walking routes across Mumbai with transparent fare status.
        </p>
      </div>

      {/* Destination Picker */}
      <div className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-4 border border-parchment-300 bg-parchment-50/90 space-y-2">
        <label className="text-xs font-bold uppercase text-charcoal-light block">
          Select Target Tourism Destination:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {places.slice(0, 8).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedDestId(p.id)}
              className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all truncate ${
                selectedDestId === p.id
                  ? 'bg-terracotta/15 text-terracotta border-sage shadow-sm'
                  : 'bg-parchment-100/80 text-charcoal-light border-parchment-300 hover:bg-slate-800'
              }`}
            >
              ?? {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Route Calculator Component */}
      {selectedPlace && (
        <RouteCalculator
          destinationId={selectedPlace.id}
          destinationName={selectedPlace.name}
          destinationLat={lat}
          destinationLng={lng}
        />
      )}
    </div>
  );
};
