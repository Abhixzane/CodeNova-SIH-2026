import React from 'react';
import { PlaceSummary } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { MapPin, Box, ArrowRight, Navigation } from 'lucide-react';

interface DestinationCardProps {
  place: PlaceSummary;
  onSelect: (placeId: string) => void;
  onNavigate?: (placeId: string) => void;
  onView3D?: (placeId: string) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  place,
  onSelect,
  onNavigate,
  onView3D,
}) => {
  const categoryColorMap: Record<string, string> = {
    heritage: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    coastal: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    nature: 'bg-terracotta/10 text-terracotta border-emerald-500/30',
    spiritual: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    museum: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    cultural: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    shopping: 'bg-orange-500/10 text-orange-400 border-terracotta/30',
  };

  const badgeClass = categoryColorMap[place.category.toLowerCase()] || 'bg-slate-800 text-charcoal-light border-parchment-300';

  return (
    <div className="heritage-border heritage-shadow bg-parchment-50 hover:shadow-md transition-shadow rounded-2xl overflow-hidden flex flex-col group border border-parchment-300/80 bg-parchment-100/60">
      {/* Thumbnail Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img
          src={place.thumbnail_url || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f'}
          alt={place.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Category & 3D Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border backdrop-blur-md ${badgeClass}`}>
            {place.category}
          </span>
          {place.features && place.features['3d'] && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500/90 text-charcoal border border-orange-400 shadow-md shadow-orange-500/30 backdrop-blur-md">
              <Box className="w-3.5 h-3.5" />
              <span>3D Ready</span>
            </span>
          )}
        </div>

        {/* Rating & City overlay at bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-charcoal bg-slate-950/80 px-2 py-1 rounded-md backdrop-blur-sm border border-parchment-300">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-medium">{place.city}, {place.state}</span>
          </div>
          {place.rating && (
            <div className="bg-slate-950/80 px-2 py-1 rounded-md backdrop-blur-sm border border-parchment-300">
              <RatingStars rating={place.rating} />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 
            onClick={() => onSelect(place.id)}
            className="text-lg font-bold text-charcoal group-hover:text-orange-400 transition-colors cursor-pointer line-clamp-1"
          >
            {place.name}
          </h3>
          <p className="text-xs text-charcoal-light line-clamp-2 mt-1.5 leading-relaxed">
            {place.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {place.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[11px] text-charcoal-light border border-parchment-300/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-parchment-300/60 flex items-center gap-2">
          <button
            onClick={() => onSelect(place.id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-charcoal text-xs font-semibold transition-all border border-terracotta/30"
          >
            <span>Explore Place</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {onNavigate && (
            <button
              onClick={() => onNavigate(place.id)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-charcoal-light hover:text-charcoal transition-colors border border-parchment-300"
              title="Calculate route to destination"
            >
              <Navigation className="w-4 h-4 text-orange-400" />
            </button>
          )}
          {place.features && place.features['3d'] && onView3D && (
            <button
              onClick={() => onView3D(place.id)}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-charcoal transition-colors border border-amber-500/30"
              title="Explore 3D Monument"
            >
              <Box className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
