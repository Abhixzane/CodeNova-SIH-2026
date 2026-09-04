import React from 'react';
import { MapPin, Map as MapIcon, Layers, Sparkles, Navigation } from 'lucide-react';
import { InteractiveMap } from '../components/map/InteractiveMap';

interface MapPageProps {
  onSelectPlace: (id: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onView3DPlace?: (placeId: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  onSelectPlace,
  selectedCity,
  onSelectCity,
  onView3DPlace,
}) => {
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <MapIcon className="w-3.5 h-3.5" />
            <span>Real YatraVerse Cartography & Routing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Interactive Heritage & Transit Map</h1>
          <p className="text-xs text-slate-500">
            India-wide geospatial network spanning 45 UNESCO/ASI heritage sites, suburban railway hubs, and multi-modal routing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> 45 Heritage Sites
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Rail Network
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Sights
          </span>
        </div>
      </div>

      {/* Main Map */}
      <InteractiveMap
        onSelectPlace={onSelectPlace}
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
        onView3DPlace={onView3DPlace}
        height="clamp(480px, 72vh, 660px)"
      />
    </div>
  );
};
