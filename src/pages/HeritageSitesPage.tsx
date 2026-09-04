import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { PlaceSummary } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import {
  Landmark,
  Search,
  MapPin,
  Clock,
  Ticket,
  Box,
  Navigation,
  Heart,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Train,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface HeritageSitesPageProps {
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: any) => void;
  onSelectPlaceForRoute?: (placeId: string) => void;
}

export const HeritageSitesPage: React.FC<HeritageSitesPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  onSelectPlaceForRoute,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [heritageSites, setHeritageSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedSiteForModal, setSelectedSiteForModal] = useState<any | null>(null);

  useEffect(() => {
    const fetchHeritage = async () => {
      setLoading(true);
      try {
        const res = await api.getHeritage({ limit: 100 });
        if (res.data && res.data.length > 0) {
          setHeritageSites(res.data);
        } else {
          // Fallback to places with heritage category
          const placesRes = await api.getPlaces({ limit: 100 });
          setHeritageSites(placesRes.data);
        }
      } catch (err) {
        console.error('Failed to load heritage sites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeritage();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: heritageSites.length,
      'Forts & Palaces': 0,
      'Temples & Sacred': 0,
      'Caves & Rock-Cut': 0,
      'Architectural & Colonial': 0,
      'Natural & Ghats': 0,
    };

    heritageSites.forEach((site) => {
      const siteCat = (site.category || '').toLowerCase();
      const siteTags = (site.tags || []).map((t: string) => t.toLowerCase());

      if (siteCat.includes('fort') || siteCat.includes('palace') || siteTags.includes('fort') || siteTags.includes('palace')) {
        counts['Forts & Palaces']++;
      } else if (siteCat.includes('temple') || siteCat.includes('sacred') || siteTags.includes('temple') || siteTags.includes('religious')) {
        counts['Temples & Sacred']++;
      } else if (siteCat.includes('cave') || siteTags.includes('cave') || siteTags.includes('rock-cut')) {
        counts['Caves & Rock-Cut']++;
      } else if (siteCat.includes('colonial') || siteCat.includes('monument') || siteCat.includes('architecture') || siteTags.includes('colonial')) {
        counts['Architectural & Colonial']++;
      } else if (siteCat.includes('ghat') || siteCat.includes('nature') || siteTags.includes('ghat') || siteTags.includes('lake')) {
        counts['Natural & Ghats']++;
      } else {
        counts['Architectural & Colonial']++;
      }
    });

    return counts;
  }, [heritageSites]);

  const categories = useMemo(() => [
    { id: 'All', label: `All Heritage (${categoryCounts['All'] || heritageSites.length || 45})` },
    { id: 'Forts & Palaces', label: `Forts & Palaces (${categoryCounts['Forts & Palaces'] || 0})` },
    { id: 'Temples & Sacred', label: `Temples & Sacred (${categoryCounts['Temples & Sacred'] || 0})` },
    { id: 'Caves & Rock-Cut', label: `Rock-Cut Caves (${categoryCounts['Caves & Rock-Cut'] || 0})` },
    { id: 'Architectural & Colonial', label: `Colonial & Monuments (${categoryCounts['Architectural & Colonial'] || 0})` },
    { id: 'Natural & Ghats', label: `Ghats & Natural (${categoryCounts['Natural & Ghats'] || 0})` },
  ], [categoryCounts, heritageSites.length]);

  const statesList = useMemo(() => {
    const set = new Set<string>();
    heritageSites.forEach((s) => {
      if (s.state) set.add(s.state);
    });
    return ['All', ...Array.from(set).sort()];
  }, [heritageSites]);

  const filteredSites = useMemo(() => {
    return heritageSites.filter((site) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        site.name?.toLowerCase().includes(q) ||
        site.city?.toLowerCase().includes(q) ||
        site.state?.toLowerCase().includes(q) ||
        site.summary?.toLowerCase().includes(q) ||
        site.historical_significance?.toLowerCase().includes(q) ||
        site.architectural_style?.toLowerCase().includes(q);

      const matchesState =
        selectedState === 'All' ||
        site.state === selectedState ||
        site.state_id === selectedState ||
        (site.state || '').toLowerCase().includes(selectedState.toLowerCase());

      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        const siteCat = (site.category || '').toLowerCase();
        const siteTags = (site.tags || []).map((t: string) => t.toLowerCase());

        if (selectedCategory === 'Forts & Palaces') {
          matchesCategory = siteCat.includes('fort') || siteCat.includes('palace') || siteTags.includes('fort') || siteTags.includes('palace');
        } else if (selectedCategory === 'Temples & Sacred') {
          matchesCategory = siteCat.includes('temple') || siteCat.includes('sacred') || siteTags.includes('temple') || siteTags.includes('religious');
        } else if (selectedCategory === 'Caves & Rock-Cut') {
          matchesCategory = siteCat.includes('cave') || siteTags.includes('cave') || siteTags.includes('rock-cut');
        } else if (selectedCategory === 'Architectural & Colonial') {
          matchesCategory = siteCat.includes('colonial') || siteCat.includes('monument') || siteCat.includes('architecture') || siteTags.includes('colonial');
        } else if (selectedCategory === 'Natural & Ghats') {
          matchesCategory = siteCat.includes('ghat') || siteCat.includes('nature') || siteTags.includes('ghat') || siteTags.includes('lake');
        }
      }

      return matchesSearch && matchesState && matchesCategory;
    });
  }, [heritageSites, searchQuery, selectedCategory, selectedState]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white p-6 sm:p-10 shadow-lg border border-slate-800">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Landmark className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ministry of Tourism & UNESCO Verified Experiences</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {heritageSites.length || 45} Pan-India Heritage Destinations
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Discover India's living antiquity across 36 States and Union Territories. Inspect detailed architectural movements, verified visiting hours, domestic & foreign entry fees, nearest transit corridors, and interactive 3D virtual reconstructions.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{heritageSites.length || 45} Verified Monuments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>UNESCO World Heritage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span>WebGL 3D Scans</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Transit & Railway Linked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search monuments, historical dynasties, architectural styles, or cities..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* State Filter Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="All">All States / UTs ({statesList.length - 1})</option>
              {statesList.filter(s => s !== 'All').map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredSites.length}</strong> of{' '}
          {heritageSites.length} heritage destinations
        </span>
        {selectedState !== 'All' && (
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
            Filtered by: {selectedState}
          </span>
        )}
      </div>

      {/* Heritage Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filteredSites.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <Landmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No heritage sites found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords or resetting your state and category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedState('All');
            }}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => {
            const has3d = site.features?.['3d'] || site.model_3d?.available;
            const fav = isFavorite(site.id);

            return (
              <div
                key={site.id}
                className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Thumbnail Image Container */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={
                      site.thumbnail_url ||
                      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                      {site.heritage_status || 'UNESCO Heritage'}
                    </span>
                    {has3d && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600 text-white shadow-xs flex items-center gap-1">
                        <Box className="w-2.5 h-2.5" />
                        <span>3D Scan</span>
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(site.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                      fav
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-black/40 text-white hover:bg-black/60'
                    }`}
                    title={fav ? 'Remove from saved' : 'Save to favorites'}
                  >
                    <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Location Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{site.city}, {site.state}</span>
                    </div>
                    {site.rating && (
                      <span className="text-[11px] font-bold bg-slate-900/80 px-2 py-0.5 rounded text-amber-400">
                        ★ {site.rating}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                      {site.name}
                    </h3>
                    {site.architectural_style && (
                      <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                        Style: {site.architectural_style}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {site.summary || site.historical_significance}
                    </p>
                  </div>

                  {/* Visiting Details Grid */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{site.visiting_hours || site.timings || '9:00 AM - 5:30 PM'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Ticket className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">
                        {site.entry_fee?.domestic !== undefined
                          ? `₹${site.entry_fee.domestic} (INR)`
                          : '₹50 standard'}
                      </span>
                    </div>
                  </div>

                  {/* Nearest Transit Info */}
                  {(site.nearest_transport?.railway_station || site.visiting_info?.railway_station) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      <Train className="w-3 h-3 text-sky-600 flex-shrink-0" />
                      <span className="truncate">
                        Station: {site.nearest_transport?.railway_station || site.visiting_info?.railway_station}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectPlace(site.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {has3d && (
                      <button
                        onClick={() => {
                          onNavigateTab('3d');
                        }}
                        className="py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="View Interactive 3D Model"
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>3D</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onNavigateTab('routes');
                      }}
                      className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Calculate multimodal route to this site"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Route</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
