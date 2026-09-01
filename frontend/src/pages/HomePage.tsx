import React from 'react';
import { PlaceSummary, StateItem } from '../types';
import { LandingHero } from '../components/home/LandingHero';
import { PopularDestinations } from '../components/home/PopularDestinations';
import { FeatureCardsGrid } from '../components/home/FeatureCardsGrid';

interface HomePageProps {
  places: PlaceSummary[];
  states: StateItem[];
  onSelectPlace: (placeId: string) => void;
  onSearchSubmit: (query: string, city?: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAIChatWithMessage?: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  places,
  states,
  onSelectPlace,
  onSearchSubmit,
  onNavigateTab,
  onOpenAIChatWithMessage,
}) => {
  return (
    <div className="space-y-16 pb-16 animate-fadeIn">
      {/* 1. Cinematic Hero Section matching Image 1 */}
      <LandingHero
        onSearchSubmit={onSearchSubmit}
        onNavigateTab={onNavigateTab}
        onOpenAIChatWithMessage={onOpenAIChatWithMessage}
      />

      {/* 2. Popular Destinations Carousel matching Image 1 */}
      <PopularDestinations
        onSelectState={(stateId) => onNavigateTab('explore')}
        onNavigateTab={onNavigateTab}
      />

      {/* 3. 4 Feature Banners & Bottom Stats Strip matching Image 1 */}
      <FeatureCardsGrid onNavigateTab={onNavigateTab} />
    </div>
  );
};
