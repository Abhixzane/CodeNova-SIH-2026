import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { PlaceSummary } from '../types';

interface SearchPageProps {
  initialQuery?: string;
  onSelectPlace: (id: string) => void;
  onBack: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  onSelectPlace,
  onBack,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<PlaceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const executeSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const data = await api.searchPlaces(searchTerm);
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  const filteredResults = results.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.category?.toLowerCase() === categoryFilter.toLowerCase();
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6 animate-fadeIn">
      {/* Search Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-slate-900 border border-parchment-300 text-charcoal-light hover:text-charcoal hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeSearch(query)}
            placeholder="Search monuments, forts, temples, or cities across India..."
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-slate-900 border border-parchment-300 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-orange-500 transition"
          />
          <button
            onClick={() => executeSearch(query)}
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-charcoal text-xs font-bold transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'heritage', 'museum', 'coastal', 'nature'].map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              categoryFilter === c
                ? 'bg-orange-500 text-charcoal shadow-sm'
                : 'bg-slate-900 text-charcoal-light hover:text-charcoal border border-parchment-300'
            }`}
          >
            {c === 'all' ? 'All Categories' : c}
          </button>
        ))}
      </div>

      {/* Results */}
      <div>
        <div className="text-xs text-charcoal-light mb-4">
          Found {filteredResults.length} matching places
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-orange-400 font-semibold animate-pulse">
            Scanning architectural catalog...
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-slate-900/50 border border-parchment-300 p-8 space-y-2">
            <p className="text-sm font-bold text-charcoal">No destinations matched "{query}"</p>
            <p className="text-xs text-charcoal-light">
              Try broader search terms like "Caves", "Fort", "Gateway", "Church", or "Palace".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectPlace(p.id)}
                className="group cursor-pointer rounded-2xl bg-parchment-100/90 hover:bg-slate-800 border border-parchment-300 hover:border-orange-500/50 p-4 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  {p.thumbnail_url ? (
                    <img
                      src={p.thumbnail_url}
                      alt={p.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-slate-950 flex items-center justify-center text-orange-400 flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                  )}

                  <div className="min-w-0 space-y-1 flex-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-charcoal-light border border-parchment-300 capitalize">
                      {p.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-orange-400 transition-colors truncate">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-charcoal-light line-clamp-2">
                      {p.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-charcoal-light">
                  <span>{p.city}, {p.state}</span>
                  <span className="text-orange-400 font-semibold group-hover:underline">
                    View →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
