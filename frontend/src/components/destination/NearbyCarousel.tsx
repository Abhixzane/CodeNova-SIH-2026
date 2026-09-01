import React from 'react';
import { NearbyPlaceItem } from '../../types';
import { MapPin, ArrowRight, Navigation } from 'lucide-react';

interface NearbyCarouselProps {
  places?: NearbyPlaceItem[];
  nearbyPlaces?: NearbyPlaceItem[];
  currentPlaceName?: string;
  onSelect?: (placeId: string) => void;
  onSelectPlace?: (placeId: string) => void;
  onNavigateTo?: (placeId: string) => void;
}

export const NearbyCarousel: React.FC<NearbyCarouselProps> = ({
  places,
  nearbyPlaces,
  currentPlaceName,
  onSelect,
  onSelectPlace,
  onNavigateTo,
}) => {
  const items = nearbyPlaces || places || [];
  const handleSelect = onSelectPlace || onSelect || (() => {});

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-charcoal font-['Plus_Jakarta_Sans'] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-terracotta" />
          <span>Explore Nearby Attractions {currentPlaceName ? `Around ${currentPlaceName}` : ''}</span>
        </h3>
        <span className="text-xs text-charcoal-light font-mono">Within 10 km</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((place) => (
          <div
            key={place.id}
            className="heritage-border heritage-shadow bg-parchment-50 hover:shadow-md transition-shadow rounded-2xl p-4 border border-parchment-300 bg-parchment-50/90 flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start gap-3">
              <img
                src={place.thumbnail_url || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f'}
                alt={place.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-slate-800"
              />
              <div className="flex-1 min-w-0">
                <h4 
                  onClick={() => handleSelect(place.id)}
                  className="text-xs font-bold text-charcoal hover:text-terracotta transition-colors cursor-pointer truncate"
                >
                  {place.name}
                </h4>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-bold text-terracotta bg-terracotta/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
                    {place.distance_km < 1 ? `${(place.distance_km * 1000).toFixed(0)} m` : `${place.distance_km.toFixed(1)} km`}
                  </span>
                  <span className="text-[10px] text-charcoal-light uppercase">
                    {place.category}
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-light line-clamp-1 mt-1">
                  {place.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-parchment-300">
              <button
                onClick={() => handleSelect(place.id)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-parchment-100 hover:bg-slate-800 text-charcoal text-xs font-bold rounded-xl transition-colors border border-parchment-300"
              >
                <span>View Dossier</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
