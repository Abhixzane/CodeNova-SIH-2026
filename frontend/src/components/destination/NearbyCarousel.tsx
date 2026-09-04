import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface NearbyCarouselProps {
  nearby?: any[];
  places?: any[];
  currentPlaceName?: string;
  onSelectPlace: (id: string) => void;
}

export const NearbyCarousel: React.FC<NearbyCarouselProps> = ({
  nearby,
  places,
  currentPlaceName,
  onSelectPlace,
}) => {
  const items = nearby || places || [];

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
          <Navigation className="w-4 h-4 text-orange-500" />
          <span>Nearby Heritage & Attractions {currentPlaceName ? `near ${currentPlaceName}` : ''}</span>
        </h3>
        <span className="text-xs text-charcoal-light">{items.length} places nearby</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item: any) => (
          <div
            key={item.id}
            onClick={() => onSelectPlace(item.id)}
            className="group cursor-pointer rounded-2xl bg-parchment-100/80 hover:bg-slate-800 border border-parchment-300 hover:border-orange-500/50 p-3.5 transition-all flex items-start gap-3"
          >
            {item.thumbnail_url ? (
              <img
                src={item.thumbnail_url}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-950 flex items-center justify-center text-orange-400 flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-charcoal-light border border-parchment-300 capitalize">
                  {item.category || 'Sight'}
                </span>
                {item.distance_km !== undefined && (
                  <span className="text-[10px] text-amber-400 font-mono font-semibold">
                    {item.distance_km.toFixed(1)} km away
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-charcoal truncate group-hover:text-orange-400 transition-colors">
                {item.name}
              </h4>
              <p className="text-[11px] text-charcoal-light line-clamp-1">
                {item.summary || item.city}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
