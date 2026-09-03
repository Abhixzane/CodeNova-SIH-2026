import React, { useState } from 'react';
import { Search, Compass, Sparkles, Navigation, Calendar, Box, ArrowRight, MapPin } from 'lucide-react';
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

  const cities = ['Mumbai', 'Delhi', 'Jaipur', 'Kochi', 'Goa', 'Agra', 'Varanasi'];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900/60 border border-parchment-300 p-6 sm:p-10 lg:p-12 shadow-2xl">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-parchment-300 backdrop-blur-md text-xs font-semibold text-charcoal">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Next-Generation Tourism & Heritage Intelligence</span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-charcoal leading-tight">
            Discover the Soul of <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">India</span>
          </h1>
          <p className="text-sm sm:text-base text-charcoal-light max-w-2xl leading-relaxed">
            Curated architectural monuments, verified multi-modal routes, suburban transit timings, 3D WebGL experiences, and time-budgeted day planners.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Destination Hub:
          </span>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => onSelectCity(c)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                selectedCity.toLowerCase() === c.toLowerCase()
                  ? 'bg-orange-500 text-charcoal shadow-md shadow-orange-500/25 border border-orange-400'
                  : 'bg-slate-950/70 text-charcoal-light hover:text-charcoal border border-parchment-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={`Search monuments, caves, forts, or temples in ${selectedCity}...`}
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-950/90 border border-parchment-300 text-xs sm:text-sm text-charcoal placeholder-slate-500 focus:outline-none focus:border-orange-500 shadow-xl transition"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-charcoal font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap pt-2">
          <button
            onClick={() => onNavigateTab('itinerary')}
            className="px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-parchment-300 text-xs font-semibold text-charcoal flex items-center gap-2 transition"
          >
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>Smart Day Planner</span>
          </button>

          <button
            onClick={() => onNavigateTab('3d')}
            className="px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-parchment-300 text-xs font-semibold text-charcoal flex items-center gap-2 transition"
          >
            <Box className="w-4 h-4 text-amber-400" />
            <span>3D Monument View</span>
          </button>

          <button
            onClick={() => onNavigateTab('routes')}
            className="px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-parchment-300 text-xs font-semibold text-charcoal flex items-center gap-2 transition"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Multi-Modal Routes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
