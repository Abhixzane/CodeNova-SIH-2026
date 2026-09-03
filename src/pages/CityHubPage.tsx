import React, { useEffect, useState } from 'react';
import { PlaceSummary, CityWeather } from '../types';
import { api } from '../services/api';
import { MapPin, CloudSun, Train, Star, Sparkles, Filter, Navigation, ArrowRight } from 'lucide-react';
import { NavTab } from '../components/layout/Sidebar';

interface CityHubPageProps {
  onSelectPlace: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const CityHubPage: React.FC<CityHubPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  selectedCity,
  onSelectCity,
}) => {
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [weather, setWeather] = useState<CityWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const cities = ['Mumbai', 'Delhi', 'Jaipur', 'Kochi', 'Goa', 'Agra', 'Varanasi'];

  useEffect(() => {
    const loadCityData = async () => {
      setLoading(true);
      try {
        const [placesRes, weatherRes] = await Promise.allSettled([
          api.getPlaces({ city: selectedCity, limit: 50 }),
          api.getWeather(selectedCity),
        ]);

        if (placesRes.status === 'fulfilled') {
          setPlaces(placesRes.value.data);
        }
        if (weatherRes.status === 'fulfilled') {
          setWeather(weatherRes.value);
        }
      } catch (err) {
        console.error('Failed to load city data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCityData();
  }, [selectedCity]);

  const filteredPlaces = places.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6 animate-fadeIn">
      {/* Hub Header & Weather */}
      <div className="rounded-3xl bg-slate-900/60 border border-parchment-300 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Destination Hub:</span>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => onSelectCity(c)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedCity.toLowerCase() === c.toLowerCase()
                    ? 'bg-orange-500 text-charcoal border border-orange-400'
                    : 'bg-slate-950 text-charcoal-light hover:text-charcoal border border-parchment-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
            {selectedCity} Tourism & Heritage Hub
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-light max-w-xl">
            Gateway to monuments, British colonial architecture, sea fortresses, and suburban connectivity.
          </p>
        </div>

        {/* Live Weather Card */}
        {weather && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-parchment-300 flex items-center gap-4 min-w-[240px]">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-charcoal">{weather.temperature_c}°C</span>
                <span className="text-xs text-charcoal-light font-medium">{weather.condition}</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
                {weather.advisory || 'Ideal for morning & sunset exploration'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'heritage', 'museum', 'coastal', 'nature'].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                activeCategory === c
                  ? 'bg-orange-500 text-charcoal shadow-sm'
                  : 'bg-slate-900 text-charcoal-light hover:text-charcoal border border-parchment-300'
              }`}
            >
              {c === 'all' ? 'All Catalog' : c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('routes')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-parchment-300 text-xs font-semibold text-charcoal flex items-center gap-1.5 transition"
          >
            <Navigation className="w-3.5 h-3.5 text-orange-400" />
            <span>Open Route Studio</span>
          </button>
        </div>
      </div>

      {/* Places Grid */}
      {loading ? (
        <div className="text-center py-16 text-xs text-orange-400 font-semibold animate-pulse">
          Loading {selectedCity} destinations...
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-slate-900/50 border border-parchment-300 p-8">
          <p className="text-sm font-bold text-charcoal">No destinations in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlaces.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPlace(p.id)}
              className="group cursor-pointer rounded-2xl bg-parchment-100/90 hover:bg-slate-800 border border-parchment-300 hover:border-orange-500/50 overflow-hidden transition-all flex flex-col justify-between shadow-sm"
            >
              <div className="relative h-44 overflow-hidden bg-slate-950">
                {p.thumbnail_url ? (
                  <img
                    src={p.thumbnail_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-400">
                    <MapPin className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-parchment-300 text-[10px] font-bold text-charcoal uppercase">
                  {p.category}
                </div>
                {p.rating && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-parchment-300 text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{p.rating}</span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-charcoal group-hover:text-orange-400 transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-charcoal-light mt-1 line-clamp-2 leading-relaxed">
                    {p.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-charcoal-light">
                  <span>{p.city}</span>
                  <span className="text-orange-400 font-semibold group-hover:underline">
                    Dossier →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
