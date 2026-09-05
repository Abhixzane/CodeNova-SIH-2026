import React, { useState } from 'react';
import { Compass, ArrowRight, Sparkles, MapPin, Search, Bot } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface EditorialHeroProps {
  onExploreClick: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectPlace?: (id: string) => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({
  onExploreClick,
  onNavigateTab,
  onSelectPlace,
}) => {
  const [query, setQuery] = useState('');

  const quickPicks = [
    { label: 'Taj Mahal, Agra', id: 'taj-mahal', tab: 'heritage' as NavTab },
    { label: 'Amber Palace, Jaipur', id: 'amber-palace', tab: 'heritage' as NavTab },
    { label: 'Gateway of India, Mumbai', id: 'gateway-of-india', tab: 'dashboard' as NavTab },
    { label: 'Qutub Minar, Delhi', id: 'qutub-minar', tab: 'heritage' as NavTab },
    { label: 'Varanasi Ghats', id: 'kashi-vishwanath-corridor', tab: 'heritage' as NavTab },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      onExploreClick();
      return;
    }
    const q = query.toLowerCase();
    if (q.includes('taj') || q.includes('agra')) {
      if (onSelectPlace) onSelectPlace('taj-mahal');
      else onNavigateTab('heritage');
    } else if (q.includes('gateway') || q.includes('mumbai')) {
      if (onSelectPlace) onSelectPlace('gateway-of-india');
      else onNavigateTab('dashboard');
    } else if (q.includes('amber') || q.includes('jaipur')) {
      if (onSelectPlace) onSelectPlace('amber-palace');
      else onNavigateTab('heritage');
    } else {
      onNavigateTab('heritage');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#EFE8DF] shadow-warm bg-[#FAF8F5] transition-all">
      {/* Visual Composition Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Cinematic Indian Heritage Backdrop */}
        <img
          src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=85"
          alt="Indian Heritage Architecture"
          className="w-full h-full object-cover object-center opacity-25 filter saturate-75 scale-105 transition-transform duration-1000"
          loading="eager"
        />

        {/* Sophisticated Layered Gradient Masks for Perfect Light-Theme Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/90 to-[#FAF8F5]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-[#FAF8F5]/50" />

        {/* Subtle Decorative Arch / Jaali Geometric Motif */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-jaali-pattern hidden lg:block" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 lg:py-28 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* AI Guide Welcome Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-amber-300/90 text-stone-800 text-xs font-medium mb-6 shadow-xs animate-fadeIn hover:shadow-sm transition-all">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span className="font-bold text-amber-900">AI Concierge:</span>
          <span className="hidden sm:inline">"Ready to discover India? Explore heritage, rail corridors, and living culture."</span>
          <span className="sm:hidden">"Ready to discover India?"</span>
          <button
            onClick={() => onNavigateTab('ai')}
            className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full transition ml-1 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>Ask Guide</span>
          </button>
        </div>

        {/* Main Title Typography as Specified in Concept */}
        <div className="space-y-2 mb-6">
          <p className="text-sm sm:text-base font-semibold text-amber-800 tracking-widest uppercase">
            YatraVerse
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
            Discover India. <br />
            <span className="text-amber-800 italic font-normal">Experience Its Stories.</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl font-normal leading-relaxed mb-8">
          Explore heritage monuments, living crafts, ancient corridors, and seamless multimodal journeys across India.
        </p>

        {/* Integrated Quick Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-xl mb-8 flex items-center p-1.5 rounded-2xl bg-white border border-[#EFE8DF] shadow-md shadow-stone-900/5 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-600/20 transition-all"
        >
          <div className="pl-3.5 pr-2 text-amber-700">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search monuments, cities, UNESCO sites (e.g. Taj Mahal, Jaipur, Caves)..."
            className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none py-2"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-semibold transition shrink-0 shadow-xs"
          >
            Find
          </button>
        </form>

        {/* Action Buttons as explicitly requested */}
        <div className="flex items-center justify-center gap-3.5 flex-wrap mb-8">
          <button
            onClick={onExploreClick}
            className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-md shadow-amber-900/15 flex items-center gap-2 transition hover:-translate-y-0.5"
          >
            <span>Explore India</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigateTab('itinerary')}
            className="px-6 py-3 rounded-xl bg-white hover:bg-stone-50 border border-[#EFE8DF] text-stone-800 font-semibold text-sm shadow-xs transition hover:-translate-y-0.5"
          >
            <span>Plan Your Journey</span>
          </button>

          <button
            onClick={() => onNavigateTab('ai')}
            className="px-5 py-3 rounded-xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200/80 text-amber-900 font-semibold text-sm transition flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4 text-amber-700" />
            <span>Ask YatraVerse AI</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-stone-500">
          <span className="font-semibold text-stone-400">Popular:</span>
          {quickPicks.map((pick) => (
            <button
              key={pick.id}
              onClick={() => {
                if (onSelectPlace) onSelectPlace(pick.id);
                else onNavigateTab(pick.tab);
              }}
              className="px-3 py-1 rounded-full bg-white hover:bg-amber-50 border border-[#EFE8DF] text-stone-700 hover:text-amber-900 transition shadow-xs text-[11px] font-medium"
            >
              {pick.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
