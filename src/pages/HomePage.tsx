import React from 'react';
import { LandingHero } from '../components/home/LandingHero';
import { FeatureCardsGrid } from '../components/home/FeatureCardsGrid';
import { PopularDestinations } from '../components/home/PopularDestinations';
import { NavTab } from '../components/layout/Sidebar';
import { PlaceSummary } from '../types';
import { MapPin, Star, Sparkles, ArrowRight } from 'lucide-react';

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
  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <LandingHero
        onSearch={onSearch}
        onNavigateTab={onNavigateTab}
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
      />

      {/* Feature Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Core Intelligence Capabilities</span>
          </h2>
        </div>
        <FeatureCardsGrid onNavigateTab={onNavigateTab} />
      </div>

      {/* Featured Places in Current Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Curated Highlights in {selectedCity}</span>
            </h2>
            <p className="text-xs text-charcoal-light mt-0.5">
              Verified coordinates, entry requirements, and transit connections
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {places.slice(0, 8).map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPlace(p.id)}
              className="group cursor-pointer rounded-2xl bg-parchment-100/90 hover:bg-slate-800 border border-parchment-300 hover:border-orange-500/50 overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-lg"
            >
              <div className="relative h-44 overflow-hidden bg-slate-950">
                {p.thumbnail_url ? (
                  <img
                    src={p.thumbnail_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-400">
                    <MapPin className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-parchment-300 text-[10px] font-bold text-charcoal uppercase tracking-wider">
                  {p.category}
                </div>
                {p.rating && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-parchment-300 text-[11px] font-bold text-amber-400 flex items-center gap-1">
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
                  <span>{p.city}, {p.state}</span>
                  <span className="text-orange-400 font-semibold group-hover:underline">
                    View Dossier →
                  </span>
                </div>
              </div>
            </div>
          ))}
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
