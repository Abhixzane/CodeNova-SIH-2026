import React, { useState, useEffect } from 'react';
import { PlaceSummary } from '../types';
import { api } from '../services/api';
import { DestinationCard } from '../components/destination/DestinationCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Search, MapPin, ArrowLeft } from 'lucide-react';

interface SearchPageProps {
  onBack?: () => void;
  initialQuery?: string;
  places?: PlaceSummary[];
  onSelectPlace: (placeId: string) => void;
  onNavigateToPlace?: (placeId: string) => void;
  onView3DPlace?: (placeId: string) => void;
  onBackToHome?: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  places = [],
  onSelectPlace,
  onNavigateToPlace,
  onView3DPlace,
  onBackToHome,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<PlaceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'heritage', label: '🏛️ Heritage' },
    { id: 'coastal', label: '🏖️ Coastal' },
    { id: 'nature', label: '🌲 Nature' },
    { id: 'spiritual', label: '✨ Spiritual' },
    { id: 'museum', label: '🏛️ Museums' },
  ];

  const performSearch = async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const resp = await api.searchPlaces(q.trim());
      setSearchResults(resp);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const filteredPlaces = searchResults.filter((p) => {
    if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToHome}
          className="p-2 rounded-xl bg-parchment-100 border border-parchment-300 text-charcoal-light hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-['Plus_Jakarta_Sans']">
            Search Tourism Intelligence
          </h1>
          <p className="text-xs text-charcoal-light mt-0.5">
            Query across verified destinations, landmarks, categories, tags, and heritage history
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="relative heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-2.5 border border-parchment-300 bg-parchment-100 shadow-xl flex items-center gap-2 focus-within:border-terracotta">
          <Search className="w-5 h-5 text-terracotta ml-3 flex-shrink-0" />
          <input
            type="text"
            placeholder='Search e.g. "famous places in Mumbai", "caves", "beaches", "monuments"...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-charcoal placeholder-slate-400 focus:outline-none px-2 py-1.5"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-terracotta hover:bg-terracotta-dark text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            Search
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-terracotta text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-parchment-100/90 text-charcoal-light hover:text-charcoal hover:bg-slate-800 border border-parchment-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingSpinner message="Searching verified tourism catalog..." />
      ) : filteredPlaces.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-charcoal-light">
            <span>
              Found <strong>{filteredPlaces.length}</strong> matching destinations for "{query}"
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <DestinationCard
                key={place.id}
                place={place}
                onSelect={onSelectPlace}
                onNavigate={onNavigateToPlace}
                onView3D={onView3DPlace}
              />
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-12 text-center border-parchment-300 max-w-md mx-auto space-y-3">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-charcoal">No exact matching places found</h3>
          <p className="text-xs text-charcoal-light">
            Try searching for keywords like "Marine Drive", "Gateway", "CSMT", "caves", or "beaches".
          </p>
        </div>
      ) : (
        <div className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-12 text-center border-parchment-300 max-w-md mx-auto space-y-3">
          <Search className="w-12 h-12 text-terracotta/50 mx-auto" />
          <h3 className="text-base font-bold text-charcoal">Enter a query to discover places</h3>
          <p className="text-xs text-charcoal-light">
            Try typing natural questions or destination names.
          </p>
        </div>
      )}
    </div>
  );
};
