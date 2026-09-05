import React from 'react';
import { Sparkles, Heart, Compass, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { PlaceSummary } from '../../types';
import { NavTab } from '../layout/Sidebar';

interface PersonalizedDiscoverySectionProps {
  places?: PlaceSummary[];
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const PersonalizedDiscoverySection: React.FC<PersonalizedDiscoverySectionProps> = ({
  places = [],
  onSelectPlace,
  onNavigateTab,
}) => {
  const { user, setIsAuthModalOpen, setIsOnboardingModalOpen } = useAuth();
  const { favorites } = useFavorites();

  // If user is not logged in, we do not show or fabricate fake personalization
  if (!user) {
    return null;
  }

  // Determine if sufficient data exists: favorites or survey interests
  const userInterests: string[] = user.interests || user.survey?.interests || [];
  const favoritePlaces = places.filter((p) => favorites.includes(p.id));

  // Find places that match user interests
  const interestMatchingPlaces = places.filter((p) => {
    if (userInterests.length === 0) return false;
    const cat = (p.category || '').toLowerCase();
    const tags = (p.tags || []).map((t) => t.toLowerCase());
    return userInterests.some((interest: string) => {
      const i = interest.toLowerCase();
      return cat.includes(i) || tags.includes(i);
    });
  });

  const recommendedPlaces = Array.from(new Set([...favoritePlaces, ...interestMatchingPlaces])).slice(0, 4);
  const hasSufficientData = recommendedPlaces.length > 0;

  return (
    <section className="space-y-6 pt-6 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Welcome back, {user.name}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Made for You
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1">
            Curated according to your verified bookmarks, travel style, and architectural interests.
          </p>
        </div>

        {hasSufficientData && (
          <button
            onClick={() => onNavigateTab('itinerary')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl border border-amber-200 transition self-start sm:self-auto"
          >
            <span>Generate Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
          </button>
        )}
      </div>

      {hasSufficientData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place.id)}
              className="group cursor-pointer rounded-2xl bg-white border border-[#EFE8DF] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-40 overflow-hidden bg-stone-100">
                <img
                  src={place.thumbnail_url || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80'}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent" />
                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-rose-600 shadow-xs">
                  <Heart className={`w-3.5 h-3.5 ${favorites.includes(place.id) ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="text-[10px] text-amber-200 uppercase font-semibold block">
                    {place.city} • {place.category}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-white truncate group-hover:text-amber-100 transition-colors">
                    {place.name}
                  </h4>
                </div>
              </div>

              <div className="p-3 bg-white flex items-center justify-between border-t border-stone-100 text-xs font-semibold text-amber-800">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Prompt requirement: "If insufficient data exists: 'Start exploring to personalize your YatraVerse.'" */
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#EFE8DF] shadow-warm text-center max-w-xl mx-auto space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Start exploring to personalize your YatraVerse.
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Bookmark your favorite heritage temples, stepwells, and street food corridors to train your personalized discovery feed.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              className="text-xs font-semibold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl transition"
            >
              Select Travel Interests (1 min) →
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
