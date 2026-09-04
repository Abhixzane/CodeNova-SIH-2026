import React, { useState } from 'react';
import { Search, Compass, Sparkles, Navigation, Calendar, Box, ArrowRight, MapPin, Landmark, Train } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface LandingHeroProps {
  onSearch: (query: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSearch,
  onNavigateTab,
  selectedCity,
  onSelectCity,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const cities = ['All India', 'Delhi', 'Jaipur', 'Agra', 'Mumbai', 'Varanasi', 'Kochi', 'Goa', 'Bengaluru'];

  return (
    <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
      {/* Subtle top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700" />

      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Smart India Hackathon 2026 • Unified Geospatial Tourism Architecture</span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Discover India. Experience Heritage.{' '}
            <span className="text-emerald-700">Navigate Smarter.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Pan-India geospatial tourism system featuring verified UNESCO heritage monuments across all 28 States & 8 UTs, multimodal routing with railway intelligence, 3D WebGL reconstructions, and Gemini AI travel planning.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> Regional Scope:
          </span>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => onSelectCity(c)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCity.toLowerCase() === c.toLowerCase()
                  ? 'bg-emerald-600 text-white shadow-xs border border-emerald-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={
              selectedCity.toLowerCase() === 'all india'
                ? 'Search heritage monuments, forts, temples, or stations across India...'
                : `Search heritage monuments, forts, temples, or stations in ${selectedCity}...`
            }
            className="w-full pl-11 pr-28 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap pt-2">
          <button
            onClick={() => onNavigateTab('heritage')}
            className="px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center gap-1.5 transition"
          >
            <Landmark className="w-3.5 h-3.5 text-amber-600" />
            <span>45 Heritage Sites</span>
          </button>

          <button
            onClick={() => onNavigateTab('mumbai-local')}
            className="px-3.5 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-semibold text-sky-900 flex items-center gap-1.5 transition"
          >
            <Train className="w-3.5 h-3.5 text-sky-600" />
            <span>Mumbai Local Rail</span>
          </button>

          <button
            onClick={() => onNavigateTab('routes')}
            className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-1.5 transition"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multimodal Transit</span>
          </button>

          <button
            onClick={() => onNavigateTab('itinerary')}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <span>Day Planner</span>
          </button>

          <button
            onClick={() => onNavigateTab('3d')}
            className="px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold text-indigo-900 flex items-center gap-1.5 transition"
          >
            <Box className="w-3.5 h-3.5 text-indigo-600" />
            <span>3D Monuments</span>
          </button>
        </div>
      </div>
    </div>
  );
};
