import React from 'react';
import { PlaceSummary, StateItem } from '../types';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { Compass } from 'lucide-react';

interface MapPageProps {
  places: PlaceSummary[];
  states: StateItem[];
  onSelectPlace: (placeId: string) => void;
  onNavigateToPlace?: (placeId: string) => void;
  onView3DPlace?: (placeId: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  places,
  states,
  onSelectPlace,
  onNavigateToPlace,
  onView3DPlace,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Geospatial Tourism Exploration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-['Plus_Jakarta_Sans']">
            Interactive India & Mumbai Map
          </h1>
          <p className="text-xs text-charcoal-light mt-0.5">
            Discover verified attractions, filter by theme, and view straight-line proximity
          </p>
        </div>
      </div>

      <InteractiveMap
        places={places}
        states={states}
        onSelectPlace={onSelectPlace}
        onNavigateToPlace={onNavigateToPlace}
        onView3DPlace={onView3DPlace}
        height="h-[680px]"
      />
    </div>
  );
};
