import React, { useEffect, useState } from 'react';
import { Heart, Trash2, MapPin, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { PlaceSummary } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';

interface FavoritesPageProps {
  onSelectPlace: (id: string) => void;
  places: PlaceSummary[];
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onSelectPlace, places }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const [favoritePlaces, setFavoritePlaces] = useState<PlaceSummary[]>([]);

  useEffect(() => {
    const matched = places.filter((p) => favorites.includes(p.id));
    setFavoritePlaces(matched);
  }, [favorites, places]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-red-400" />
          <span>Curated Bookmarks</span>
        </div>
        <h1 className="text-2xl font-bold text-charcoal">Saved Destinations</h1>
        <p className="text-xs text-charcoal-light">
          Your saved monuments, temples, and heritage sites ready for route planning.
        </p>
      </div>

      {favoritePlaces.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/50 border border-parchment-300 p-8 space-y-3">
          <Heart className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-charcoal">No saved places yet</p>
          <p className="text-xs text-charcoal-light max-w-sm mx-auto">
            Click the heart icon on any monument dossier to keep track of destinations you plan to visit.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoritePlaces.map((p) => (
            <div
              key={p.id}
              className="group relative rounded-2xl bg-parchment-100/90 border border-parchment-300 hover:border-orange-500/50 overflow-hidden transition-all flex flex-col justify-between"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(p.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-red-400 hover:bg-slate-900 border border-parchment-300 transition"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-charcoal-light border border-parchment-300 capitalize">
                    {p.category}
                  </span>
                  <h3 className="text-sm font-bold text-charcoal mt-1 line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-charcoal-light mt-1 line-clamp-2">{p.summary}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-charcoal-light">{p.city}</span>
                  <button
                    onClick={() => onSelectPlace(p.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-orange-400 hover:underline"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3 h-3" />
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
