import React from 'react';
import { Heart, MapPin, Trash2, ArrowRight, Compass } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';

interface FavoritesPageProps {
  onSelectPlace: (placeId: string) => void;
  onNavigateToExplore: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onSelectPlace, onNavigateToExplore }) => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="min-h-screen bg-parchment text-charcoal p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-parchment-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
              <Heart size={14} className="fill-rose-400" /> Saved Destinations
            </div>
            <h1 className="text-3xl font-extrabold text-charcoal">Your Travel Wishlist</h1>
            <p className="text-sm text-charcoal-light mt-1">
              Curated heritage monuments and places you have bookmarked for your Indian journeys.
            </p>
          </div>
          <button
            onClick={onNavigateToExplore}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta text-slate-950 font-bold text-xs hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
          >
            <Compass size={16} /> Explore More Places
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-parchment-50 border border-parchment-300/80 rounded-3xl p-8">
            <Heart size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-charcoal mb-2">No Saved Places Yet</h3>
            <p className="text-sm text-charcoal-light max-w-md mx-auto mb-6">
              Browse destinations across Mumbai, Rajasthan, Delhi, or Kerala and tap the heart icon to save them to your wishlist.
            </p>
            <button
              onClick={onNavigateToExplore}
              className="px-6 py-3 rounded-xl bg-terracotta text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
            >
              Start Exploring India
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="group relative bg-parchment-50 border border-parchment-300 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-parchment-100">
                  <img
                    src={fav.thumbnail_url || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80'}
                    alt={fav.place_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1427] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-terracotta border border-emerald-500/30">
                    {fav.category}
                  </span>
                  <button
                    onClick={() => toggleFavorite(fav.place_id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-rose-500/20 text-rose-400 transition"
                    title="Remove from favorites"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-charcoal-light mb-1">
                      <MapPin size={14} className="text-terracotta" />
                      <span>{fav.city}</span>
                    </div>
                    <h3 className="text-lg font-bold text-charcoal group-hover:text-terracotta transition">
                      {fav.place_name}
                    </h3>
                  </div>

                  <div className="mt-5 pt-4 border-t border-parchment-300/80 flex items-center justify-between">
                    <button
                      onClick={() => onSelectPlace(fav.place_id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:text-emerald-300 transition"
                    >
                      <span>View Dossier & Route</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
