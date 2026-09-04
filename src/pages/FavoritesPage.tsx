import React, { useEffect, useState } from 'react';
import { Heart, Trash2, MapPin, ArrowRight, Navigation, Sparkles, Compass } from 'lucide-react';
import { api } from '../services/api';
import { PlaceSummary } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { NavTab } from '../components/layout/Sidebar';

interface FavoritesPageProps {
  onSelectPlace: (id: string) => void;
  places: PlaceSummary[];
  onNavigateTab?: (tab: NavTab) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onSelectPlace,
  places,
  onNavigateTab,
}) => {
  const { favorites, toggleFavorite } = useFavorites();
  const [favoritePlaces, setFavoritePlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const resolveFavorites = async () => {
      setLoading(true);
      try {
        const heritageRes = await api.getHeritage({ limit: 100 });
        const allCombined = [...places, ...(heritageRes.data || [])];
        
        // Deduplicate by id
        const map = new Map<string, any>();
        allCombined.forEach((p) => {
          if (p && p.id && !map.has(p.id)) {
            map.set(p.id, p);
          }
        });

        const matched = favorites.map((id) => map.get(id)).filter(Boolean);
        if (isMounted) {
          setFavoritePlaces(matched);
        }
      } catch (err) {
        console.error('Failed to resolve favorites:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    resolveFavorites();
    return () => {
      isMounted = false;
    };
  }, [favorites, places]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>Curated Travel Wishlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Saved Heritage & Destinations</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Your personal collection of bookmarked monuments, rock-cut caves, temples, and coastal landmarks across India.
          </p>
        </div>

        {onNavigateTab && favoritePlaces.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onNavigateTab('itinerary')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plan Trip from Saved</span>
            </button>
            <button
              onClick={() => onNavigateTab('map')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>View Map</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-emerald-700 font-semibold animate-pulse">
          Loading your saved destinations...
        </div>
      ) : favoritePlaces.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-white border border-slate-200 p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-slate-800">No saved destinations yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Click the heart bookmark icon on any heritage site or destination dossier to build your personalized travel circuit.
          </p>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('heritage')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm mt-2"
            >
              Explore 45 Heritage Sites
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoritePlaces.map((p) => (
            <div
              key={p.id}
              className="group relative rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 overflow-hidden transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                {p.thumbnail_url || (p.images && p.images[0]) ? (
                  <img
                    src={p.thumbnail_url || (p.images && p.images[0])}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <MapPin className="w-8 h-8" />
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(p.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-2xl bg-white/90 backdrop-blur-md text-rose-600 hover:bg-white border border-slate-200 transition shadow-xs"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white">
                    {p.city || 'India'}
                  </span>
                  {p.state && (
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white backdrop-blur-md">
                      {p.state}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-1">
                    {p.category || 'Heritage Landmark'}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {p.summary || p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    {p.entry_fee?.domestic !== undefined
                      ? p.entry_fee.domestic === 0
                        ? 'Free Entry'
                        : `₹${p.entry_fee.domestic}`
                      : 'Free Entry'}
                  </span>
                  <button
                    onClick={() => onSelectPlace(p.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
