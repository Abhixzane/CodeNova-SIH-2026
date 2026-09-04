import React, { useEffect, useState } from 'react';
import { PlaceSummary, CityWeather } from '../types';
import { api } from '../services/api';
import { MapPin, CloudSun, Train, Star, Sparkles, Filter, Navigation, ArrowRight, Box, Landmark, ChevronRight } from 'lucide-react';
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

  const cities = ['Mumbai', 'Delhi', 'Jaipur', 'Kochi', 'Goa', 'Agra', 'Varanasi', 'Bengaluru'];

  useEffect(() => {
    const loadCityData = async () => {
      setLoading(true);
      try {
        const [placesRes, weatherRes] = await Promise.allSettled([
          api.getPlaces({ city: selectedCity, limit: 50 }),
          api.getWeather(selectedCity),
        ]);

        if (placesRes.status === 'fulfilled') {
          setPlaces(placesRes.value.data || []);
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
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Hub Header & Weather */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Destination Hub:</span>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => onSelectCity(c)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedCity.toLowerCase() === c.toLowerCase()
                    ? 'bg-emerald-600 text-white border border-emerald-600 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {selectedCity} Tourism & Heritage Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Verified architectural monuments, British colonial heritage, sea forts, local transit connections, and GPS coordinates.
          </p>
        </div>

        {/* Live Weather Card */}
        {weather && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4 min-w-[240px]">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">{weather.temperature_c}°C</span>
                <span className="text-xs text-slate-600 font-medium">{weather.condition}</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                {weather.advisory || 'Ideal for morning & sunset exploration'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs & Quick Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'heritage', 'museum', 'coastal', 'nature'].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                activeCategory === c
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c === 'all' ? 'All Sites' : c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('mumbai-local')}
            className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-semibold text-sky-800 flex items-center gap-1.5 transition"
          >
            <Train className="w-3.5 h-3.5 text-sky-600" />
            <span>Local Rail</span>
          </button>
          <button
            onClick={() => onNavigateTab('routes')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5 transition"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multimodal Route Engine</span>
          </button>
        </div>
      </div>

      {/* Places Grid */}
      {loading ? (
        <div className="text-center py-16 text-xs text-emerald-700 font-semibold animate-pulse">
          Loading {selectedCity} destinations...
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="text-center py-16 rounded-xl bg-white border border-slate-200 p-8 shadow-xs">
          <p className="text-sm font-bold text-slate-700">No destinations found in this category</p>
          <button
            onClick={() => setActiveCategory('all')}
            className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlaces.map((p) => {
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60" />

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
                    <span>{p.city}</span>
                    <span className="text-emerald-700 font-semibold group-hover:underline flex items-center gap-0.5">
                      <span>Dossier</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
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
