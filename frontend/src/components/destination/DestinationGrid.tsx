import React, { useState } from 'react';
import { PlaceSummary, CategoryType } from '../../types';
import { DestinationCard } from './DestinationCard';
import { Sparkles, SlidersHorizontal, MapPin } from 'lucide-react';

interface DestinationGridProps {
  places: PlaceSummary[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSelectPlace: (placeId: string) => void;
  onNavigatePlace?: (placeId: string) => void;
  onView3DPlace?: (placeId: string) => void;
  title?: string;
  subtitle?: string;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({
  places,
  selectedCategory,
  onCategoryChange,
  onSelectPlace,
  onNavigatePlace,
  onView3DPlace,
  title = 'Featured Destinations',
  subtitle = 'Discover verified landmarks, cultural treasures, and scenic coastlines across Mumbai & India',
}) => {
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'default'>('rating');

  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'heritage', label: '??? Heritage' },
    { id: 'coastal', label: '?? Coastal & Beaches' },
    { id: 'nature', label: '?? Nature & Parks' },
    { id: 'spiritual', label: '?? Spiritual' },
    { id: 'museum', label: '?? Art & Museums' },
    { id: 'cultural', label: '?? Cultural' },
  ];

  const sortedPlaces = [...places].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Curated Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-['Plus_Jakarta_Sans'] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-charcoal-light mt-1 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs">
          <SlidersHorizontal className="w-4 h-4 text-charcoal-light" />
          <span className="text-charcoal-light">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-parchment-100 border border-parchment-300 rounded-lg px-3 py-1.5 text-charcoal focus:outline-none focus:border-orange-500"
          >
            <option value="rating">Highest Rated</option>
            <option value="name">Alphabetical</option>
            <option value="default">Default Order</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-orange-500 text-charcoal shadow-lg shadow-orange-500/20 font-semibold'
                  : 'bg-parchment-100/90 text-charcoal-light hover:text-charcoal hover:bg-slate-800 border border-parchment-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Places Cards Grid */}
      {sortedPlaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPlaces.map((place) => (
            <DestinationCard
              key={place.id}
              place={place}
              onSelect={onSelectPlace}
              onNavigate={onNavigatePlace}
              onView3D={onView3DPlace}
            />
          ))}
        </div>
      ) : (
        <div className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-12 text-center border-parchment-300 max-w-md mx-auto">
          <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-charcoal-light">No destinations found</h3>
          <p className="text-xs text-slate-500 mt-1">Try selecting another category filter above.</p>
        </div>
      )}
    </div>
  );
};
