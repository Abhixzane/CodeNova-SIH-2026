import React from 'react';
import { MapPin, Map as MapIcon, Layers } from 'lucide-react';
import { InteractiveMap } from '../components/map/InteractiveMap';

interface MapPageProps {
  onSelectPlace: (id: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  onSelectPlace,
  selectedCity,
  onSelectCity,
}) => {
  const cities = ['Mumbai', 'Delhi', 'Jaipur', 'Kochi', 'Goa'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <MapIcon className="w-3.5 h-3.5" />
            <span>Geospatial Heritage Discovery</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal">Interactive Heritage Map</h1>
          <p className="text-xs text-charcoal-light">
            Plotting monuments, heritage precincts, and suburban rail junctions in {selectedCity}.
          </p>
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => onSelectCity(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCity.toLowerCase() === c.toLowerCase()
                  ? 'bg-orange-500 text-charcoal font-bold border border-orange-400'
                  : 'bg-slate-900 text-charcoal-light hover:text-charcoal border border-parchment-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <InteractiveMap onSelectPlace={onSelectPlace} selectedCity={selectedCity} />
    </div>
  );
};
