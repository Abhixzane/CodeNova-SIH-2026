import React, { useEffect, useState } from 'react';
import { PlaceSummary, CityWeather } from '../types';
import { api } from '../services/api';
import { MapPin, CloudSun, Train, Star, Sparkles, Filter, Navigation, ArrowRight, Box, Landmark, ChevronRight } from 'lucide-react';
import { NavTab } from '../components/layout/Sidebar';
import { CityImmersionHeader } from '../components/destination/CityImmersionHeader';
import { ThreeDDestinationCard } from '../components/common/ThreeDDestinationCard';

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
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn pb-8">
      {/* 3D City Immersion Header with Layered Background & Guide */}
      <CityImmersionHeader
        cityName={selectedCity}
        weather={weather}
        cities={cities}
        onSelectCity={onSelectCity}
        onExploreHeritage={() => onNavigateTab('heritage')}
        onExploreTransit={() => onNavigateTab(selectedCity.toLowerCase().includes('mumbai') ? 'mumbai-local' : 'routes')}
      />

      {/* Filter Tabs & Quick Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 bg-white rounded-2xl border border-[#EFE8DF] shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'heritage', 'museum', 'coastal', 'nature'].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                activeCategory === c
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-[#EFE8DF]'
              }`}
            >
              {c === 'all' ? 'All Sites' : c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {selectedCity.toLowerCase().includes('mumbai') && (
            <button
              onClick={() => onNavigateTab('mumbai-local')}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-1.5 transition"
            >
              <Train className="w-3.5 h-3.5 text-amber-700" />
              <span>Mumbai Local Rail</span>
            </button>
          )}
          <button
            onClick={() => onNavigateTab('routes')}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-bold text-stone-800 flex items-center gap-1.5 transition"
          >
            <Navigation className="w-3.5 h-3.5 text-stone-700" />
            <span>Multimodal Transit Engine</span>
          </button>
        </div>
      </div>

      {/* Places Grid with 3D Depth Cards */}
      {loading ? (
        <div className="text-center py-16 text-xs text-amber-800 font-bold animate-pulse">
          Loading verified {selectedCity} destinations...
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-[#EFE8DF] p-8 shadow-xs">
          <p className="text-sm font-bold text-stone-800">No destinations found in this category</p>
          <button
            onClick={() => setActiveCategory('all')}
            className="mt-3 px-5 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlaces.map((p) => {
            const has3d = p.features?.['3d'] || (p as any).model_3d?.available;
            return (
              <ThreeDDestinationCard
                key={p.id}
                id={p.id}
                title={p.name}
                subtitle={`${p.city}, ${p.state}`}
                badge={has3d ? '3D Available' : p.category}
                imageUrl={
                  p.thumbnail_url ||
                  'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80'
                }
                tagline={p.summary}
                onClick={() => onSelectPlace(p.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
