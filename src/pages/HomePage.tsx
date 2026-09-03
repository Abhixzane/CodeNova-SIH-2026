import React, { useState, useEffect } from 'react';
import { LandingHero } from '../components/home/LandingHero';
import { FeatureCardsGrid } from '../components/home/FeatureCardsGrid';
import { PopularDestinations } from '../components/home/PopularDestinations';
import { NavTab } from '../components/layout/Sidebar';
import { PlaceSummary, PlatformStats } from '../types';
import { api } from '../services/api';
import {
  MapPin,
  Star,
  Sparkles,
  ArrowRight,
  Landmark,
  Train,
  Box,
  Layers,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  onSearch: (query: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectPlace: (placeId: string) => void;
  onSelectState: (stateId: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  places: PlaceSummary[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  onNavigateTab,
  onSelectPlace,
  onSelectState,
  selectedCity,
  onSelectCity,
  places,
}) => {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const s = await api.getStats();
        setStats(s);
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };
    fetchStats();
  }, []);

  const cityPlaces = places.filter((p) =>
    !selectedCity || selectedCity.toLowerCase() === 'all' || selectedCity.toLowerCase() === 'all india'
      ? true
      : p.city?.toLowerCase().includes(selectedCity.toLowerCase())
  );

  const displayPlaces = cityPlaces.length > 0 ? cityPlaces : places;

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Hero Banner */}
      <LandingHero
        onSearch={onSearch}
        onNavigateTab={onNavigateTab}
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
      />

      {/* Platform Real Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Heritage Sites</span>
            <Landmark className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-slate-900">{stats?.heritage_count || 42}</span>
            <span className="text-[10px] text-slate-500 block">UNESCO World Heritage</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">States & UTs</span>
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-slate-900">{stats?.states_count || 36}</span>
            <span className="text-[10px] text-slate-500 block">28 States + 8 UTs</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tourism Hubs</span>
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-slate-900">{stats?.cities_count || 24}</span>
            <span className="text-[10px] text-slate-500 block">Active City Dossiers</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Railway Hubs</span>
            <Train className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-slate-900">84</span>
            <span className="text-[10px] text-slate-500 block">Pan-India Stations</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">3D Models</span>
            <Box className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-slate-900">{stats?.three_d_models_count || 45}</span>
            <span className="text-[10px] text-slate-500 block">WebGL Interactive</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Heritage Stays</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-slate-900">15+</span>
            <span className="text-[10px] text-slate-500 block">Verified Properties</span>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Platform Intelligence Modules</span>
          </h2>
        </div>
        <FeatureCardsGrid onNavigateTab={onNavigateTab} />
      </div>

      {/* Featured Places in Current Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>
                {selectedCity.toLowerCase() === 'all india'
                  ? 'Curated Heritage Highlights Across India'
                  : `Curated Highlights in ${selectedCity}`}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified coordinates, visiting requirements, entry fees, and transit connections
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('heritage')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Heritage Sites</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayPlaces.slice(0, 8).map((p) => {
            const has3d = p.features?.['3d'] || (p as any).model_3d?.available;
            return (
              <div
                key={p.id}
                onClick={() => onSelectPlace(p.id)}
                className="group cursor-pointer rounded-xl bg-white hover:border-slate-300 border border-slate-200 overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  {p.thumbnail_url ? (
                    <img
                      src={p.thumbnail_url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <MapPin className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-70" />

                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-800 uppercase tracking-wider shadow-xs">
                    {p.category}
                  </div>

                  {has3d && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                      <Box className="w-2.5 h-2.5" />
                      <span>3D</span>
                    </div>
                  )}

                  {p.rating && (
                    <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded bg-slate-900/80 text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      <span>{p.rating}</span>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-2.5 text-white text-xs font-semibold truncate max-w-[70%]">
                    {p.city}, {p.state}
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {p.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {(p as any).visiting_hours || (p as any).timings || 'Open for Visitors'}
                    </span>
                    <span className="text-emerald-700 font-semibold group-hover:underline flex items-center gap-0.5">
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Destination States */}
      <PopularDestinations
        onSelectState={onSelectState}
        onNavigateTab={(tab) => onNavigateTab(tab as NavTab)}
      />
    </div>
  );
};
