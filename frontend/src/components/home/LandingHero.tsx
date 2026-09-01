import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Box, 
  Route, 
  CalendarDays, 
  Sun, 
  IndianRupee,
  Send
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LandingHeroProps {
  onSearchSubmit: (query: string, city?: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAIChatWithMessage?: (msg: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSearchSubmit,
  onNavigateTab,
  onOpenAIChatWithMessage,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Anywhere');
  const [aiInput, setAiInput] = useState('');

  const quickPrompts = [
    'Best heritage places in Mumbai',
    '2 day itinerary for Jaipur',
    'Budget trip to Kerala',
    'Caves near Sanjay Gandhi National Park',
  ];

  const featureItems = [
    { id: '3d', title: '3D Navigation', subtitle: 'Immersive 3D views', icon: Box, tab: '3d' },
    { id: 'traffic', title: 'Live Routes', subtitle: 'Multi-modal transit', icon: Route, tab: 'routes' },
    { id: 'ai', title: 'AI Assistant', subtitle: 'Contextual Memory', icon: Sparkles, tab: 'ai' },
    { id: 'itinerary', title: 'Smart Itinerary', subtitle: 'Budget Optimizer', icon: CalendarDays, tab: 'itinerary' },
    { id: 'updates', title: 'Live Weather', subtitle: 'Coastal & City feeds', icon: Sun, tab: 'explore' },
    { id: 'fare', title: 'Fare Estimator', subtitle: 'Transparent ₹ Rates', icon: IndianRupee, tab: 'routes' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim(), selectedLocation === 'Anywhere' ? undefined : selectedLocation);
    }
  };

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiInput.trim() && onOpenAIChatWithMessage) {
      onOpenAIChatWithMessage(aiInput.trim());
      setAiInput('');
    } else {
      onNavigateTab('ai');
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12">
      {/* Cinematic Hero Backdrop */}
      <div className="absolute inset-0 h-[620px] w-full overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&auto=format&fit=crop&q=80"
          alt="Incredible India Heritage"
          className="w-full h-full object-cover object-center opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d19] via-[#080d19]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080d19] via-[#080d19]/60 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-12">
        {/* Top Grid: Hero Left Content + Floating AI Assistant Card on Right (Matching Image 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Heading & Search */}
          <div className="lg:col-span-7 space-y-6 pt-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/10 border border-emerald-500/30 text-terracotta text-xs font-semibold backdrop-blur-md shadow-md shadow-emerald-500/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Incredible India, Endless Experiences</span>
            </div>

            {/* Main Title matching Image 1: "Discover India Like Never Before" */}
            <h1 className="text-4xl sm:text-6xl font-black text-charcoal tracking-tight font-['Plus_Jakarta_Sans'] leading-[1.12]">
              Discover India <br />
              Like <span className="text-gradient-terracotta">Never Before</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-charcoal-light max-w-xl leading-relaxed">
              AI-powered travel assistant, 3D navigation, live routes, and transparent fare estimates — all in one unified platform.
            </p>

            {/* Hero Search Bar with Location selector matching Image 1 */}
            <form onSubmit={handleSearch} className="max-w-xl">
              <div className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-2 border border-parchment-300/80 bg-parchment-50/95 shadow-2xl flex items-center gap-2 focus-within:border-terracotta transition-colors">
                <input
                  type="text"
                  placeholder="Search destinations, places, experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-charcoal placeholder-slate-400 focus:outline-none px-3 py-2"
                />

                {/* Location Dropdown */}
                <div className="h-6 w-px bg-slate-800" />
                <div className="flex items-center gap-1.5 px-2 text-xs text-charcoal-light">
                  <MapPin className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-transparent text-xs text-charcoal-light focus:outline-none cursor-pointer pr-2 font-medium"
                  >
                    <option value="Anywhere" className="bg-parchment-100 text-charcoal">Anywhere</option>
                    <option value="Mumbai" className="bg-parchment-100 text-charcoal">Mumbai, MH</option>
                    <option value="Jaipur" className="bg-parchment-100 text-charcoal">Jaipur, RJ</option>
                    <option value="New Delhi" className="bg-parchment-100 text-charcoal">Delhi (NCT)</option>
                    <option value="Kochi" className="bg-parchment-100 text-charcoal">Kerala</option>
                    <option value="Panaji" className="bg-parchment-100 text-charcoal">Goa</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="p-3 bg-terracotta hover:bg-terracotta-dark text-slate-950 rounded-xl transition-all shadow-md shadow-emerald-500/25 flex-shrink-0 font-bold"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Interactive Floating AI Assistant Card matching Image 1 */}
          <div className="lg:col-span-5 pt-2">
            <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-6 border border-parchment-300/80 bg-parchment-50/95 shadow-2xl backdrop-blur-2xl space-y-4">
              {/* Header with Online status */}
              <div className="flex items-center justify-between pb-3 border-b border-parchment-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-terracotta/15 border border-emerald-500/30 flex items-center justify-center text-terracotta">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans']">
                      AI Travel Assistant
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-terracotta font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online</span>
                </div>
              </div>

              {/* Message bubble */}
              <div className="text-xs text-charcoal-light leading-relaxed">
                {user ? `Namaste, ${user.name.split(' ')[0]}! 🙏` : `Namaste! 🙏 I'm your BharatYatra assistant.`} <br />
                {user?.survey?.interests ? `Tailoring recommendations for ${user.survey.interests.slice(0, 3).join(', ')}.` : 'How can I help you plan your journey across India today?'}
              </div>

              {/* Try asking prompt pills matching Image 1 */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-charcoal-light">
                  Try asking me:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (onOpenAIChatWithMessage) {
                          onOpenAIChatWithMessage(prompt);
                        } else {
                          onNavigateTab('ai');
                        }
                      }}
                      className="p-2 rounded-xl bg-parchment-100/90 hover:bg-slate-800 text-charcoal-light hover:text-terracotta text-[11px] font-medium text-left border border-parchment-300 transition-colors truncate"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mini Prompt Input matching Image 1 */}
              <form onSubmit={handleAISubmit} className="pt-1">
                <div className="relative rounded-2xl bg-slate-950 border border-parchment-300 p-1.5 flex items-center gap-2 focus-within:border-terracotta">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="w-full bg-transparent px-3 py-1.5 text-xs text-charcoal placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-terracotta hover:bg-terracotta-dark text-slate-950 font-bold transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Feature Horizontal Strip matching Image 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-parchment-300/80">
          {featureItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigateTab(item.tab)}
                className="heritage-border heritage-shadow bg-parchment-50 hover:shadow-md transition-shadow rounded-2xl p-4 border border-parchment-300/80 bg-parchment-50/80 cursor-pointer flex flex-col items-start space-y-2 group"
              >
                <div className="p-2 rounded-xl bg-parchment-100 text-terracotta border border-parchment-300 group-hover:border-sage group-hover:bg-terracotta/10 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal group-hover:text-terracotta transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-charcoal-light mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
