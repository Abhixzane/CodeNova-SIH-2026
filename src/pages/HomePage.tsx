import React from 'react';
import { NavTab } from '../components/layout/Sidebar';
import { PlaceSummary } from '../types';

// Editorial Explore India Redesign Components
import { CinematicHero } from '../components/home/CinematicHero';
import { DiscoverIndiaScrollExperience } from '../components/home/DiscoverIndiaScrollExperience';
import { MoodDiscoverySection } from '../components/home/MoodDiscoverySection';
import { ThreeDHeritageShowcase } from '../components/home/ThreeDHeritageShowcase';
import { EditorialHeritageSection } from '../components/home/EditorialHeritageSection';
import { BeyondTheFamousSection } from '../components/home/BeyondTheFamousSection';
import { ExploreByRegionSection } from '../components/home/ExploreByRegionSection';
import { ThreeDRailwayExperience } from '../components/home/ThreeDRailwayExperience';
import { SimpleJourneyPlannerSection } from '../components/home/SimpleJourneyPlannerSection';
import { UnifiedExperienceSection } from '../components/home/UnifiedExperienceSection';
import { AskYatraVerseSection } from '../components/home/AskYatraVerseSection';
import { PersonalizedDiscoverySection } from '../components/home/PersonalizedDiscoverySection';
import { TravelWithPurposeSection } from '../components/home/TravelWithPurposeSection';

interface HomePageProps {
  onSearch: (query: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectPlace: (placeId: string) => void;
  onSelectState: (stateId: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  places?: PlaceSummary[];
  onPlanTripParams?: (params: {
    city: string;
    durationDays: number;
    interests: string[];
    pace: 'relaxed' | 'moderate' | 'fast';
  }) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  onNavigateTab,
  onSelectPlace,
  onSelectState,
  selectedCity = 'All India',
  onSelectCity,
  places = [],
  onOpenAIChat,
}) => {
  return (
    <div className="space-y-10 sm:space-y-14 animate-fadeIn pb-12">
      {/* 1. HERO: Cinematic Indian Tourism Gateway */}
      <CinematicHero
        onSearch={onSearch}
        onNavigateTab={onNavigateTab}
        onSelectPlace={onSelectPlace}
        onSelectCity={onSelectCity}
        selectedCity={selectedCity}
        onOpenAIChat={onOpenAIChat}
      />

      {/* 2. DISCOVER INDIA: 8 Living Perspectives Storytelling Experience */}
      <DiscoverIndiaScrollExperience
        onNavigateTab={onNavigateTab}
        onSelectCity={onSelectCity}
        selectedCity={selectedCity}
      />

      {/* 3. MOOD-BASED DISCOVERY: 6 Curated Visual Categories */}
      <MoodDiscoverySection
        onNavigateTab={onNavigateTab}
        onSelectCity={onSelectCity}
        onOpenHiddenIndia={() => {
          const el = document.getElementById('beyond-the-famous-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. 3D HERITAGE SHOWCASE & INTERACTIVE MONUMENT SIMULATOR */}
      <ThreeDHeritageShowcase
        onSelectPlace={onSelectPlace}
        onNavigateTab={onNavigateTab}
        selectedCity={selectedCity}
      />

      {/* 5. INDIA THROUGH ITS HERITAGE: Editorial Architectural Showcase (with Virasat Guide) */}
      <EditorialHeritageSection
        onSelectPlace={onSelectPlace}
        onNavigateTab={onNavigateTab}
        selectedCity={selectedCity}
      />

      {/* 6. HIDDEN INDIA: "Beyond the Famous" Signature Section (with Khoj Guide) */}
      <BeyondTheFamousSection
        onSelectPlace={onSelectPlace}
        onNavigateTab={onNavigateTab}
        onOpenAIChat={onOpenAIChat}
        selectedCity={selectedCity}
      />

      {/* 7. EXPLORE BY REGION: Interactive India Map & 36 States/UTs Gateway */}
      <ExploreByRegionSection
        onSelectPlace={onSelectPlace}
        onNavigateTab={onNavigateTab}
        onSelectCity={onSelectCity}
        onSelectState={onSelectState}
        selectedCity={selectedCity}
        places={places}
      />

      {/* 8. 3D RAILWAY & SUBURBAN TRANSIT CORRIDOR EXPERIENCE */}
      <ThreeDRailwayExperience
        onNavigateTab={onNavigateTab}
        selectedCity={selectedCity}
      />

      {/* 9. PLAN YOUR WAY AROUND INDIA: Simple Multimodal Journey Planner (with Safar Guide) */}
      <SimpleJourneyPlannerSection
        onNavigateTab={onNavigateTab}
        selectedCity={selectedCity}
      />

      {/* 7. EXPERIENCE INDIA: Unified Living Traditions & Food (with Rasika Guide) */}
      <UnifiedExperienceSection
        onNavigateTab={onNavigateTab}
        selectedCity={selectedCity}
      />

      {/* 8. ASK YATRAVERSE: Cultural AI Discovery with Grounded Prompts (with Yatri Guide) */}
      <AskYatraVerseSection
        onOpenAIChat={onOpenAIChat}
        onNavigateTab={onNavigateTab}
        selectedCity={selectedCity}
      />

      {/* 9. PERSONALIZED DISCOVERY: "Made for You" for Authenticated Travelers */}
      <PersonalizedDiscoverySection
        places={places}
        onSelectPlace={onSelectPlace}
        onNavigateTab={onNavigateTab}
      />

      {/* 10. RESPONSIBLE TRAVEL: Compact "Travel With Purpose" (with Prithvi Guide) */}
      <TravelWithPurposeSection
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};
