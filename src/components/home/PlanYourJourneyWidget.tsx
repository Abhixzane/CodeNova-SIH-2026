import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, ArrowRight, Heart, SlidersHorizontal, Train } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { GuideIllustration } from '../cultural-guides/GuideIllustrations';

interface PlanYourJourneyWidgetProps {
  onPlanTrip: (params: {
    city: string;
    durationDays: number;
    interests: string[];
    pace: 'relaxed' | 'moderate' | 'fast';
  }) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const PlanYourJourneyWidget: React.FC<PlanYourJourneyWidgetProps> = ({
  onPlanTrip,
  onNavigateTab,
}) => {
  const [city, setCity] = useState('Mumbai');
  const [duration, setDuration] = useState('1'); // days
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['heritage', 'culture']);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'fast'>('moderate');

  const destinationOptions = [
    'Mumbai',
    'Delhi',
    'Jaipur',
    'Agra',
    'Varanasi',
    'Kochi',
    'Goa',
    'Bengaluru',
  ];

  const interestOptions = [
    { id: 'heritage', label: 'Heritage', icon: '🏛️' },
    { id: 'culture', label: 'Culture', icon: '🎨' },
    { id: 'food', label: 'Food', icon: '🍲' },
    { id: 'nature', label: 'Nature', icon: '🌿' },
  ];

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((i) => i !== id) : prev) : [...prev, id]
    );
  };

  const handleCreateJourney = (e: React.FormEvent) => {
    e.preventDefault();
    onPlanTrip({
      city,
      durationDays: parseInt(duration, 10) || 1,
      interests: selectedInterests,
      pace,
    });
    onNavigateTab('itinerary');
  };

  return (
    <section className="pt-6">
      <div className="rounded-3xl bg-white border border-[#EFE8DF] shadow-warm p-6 sm:p-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 tracking-wider uppercase">
            <Calendar className="w-3.5 h-3.5" />
            <span>Intelligent Trip Crafter</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Plan Your Journey
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Design a personalized Indian exploration circuit in seconds.
          </p>
        </div>

        {/* Safar Guide Companion Banner */}
        <div className="mb-8 flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-white to-stone-50 border border-emerald-200/80 shadow-2xs">
          <GuideIllustration characterId="safar" size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-950">Safar (सफ़र)</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                Transit Specialist
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">
              "Let's find the easiest way to reach your destination. Connecting stations, suburban locals, and multimodal routes with verified timing and fares."
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('routes')}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white transition shrink-0 hidden sm:inline-flex items-center gap-1"
          >
            <Train className="w-3.5 h-3.5" />
            <span>Transit Routes</span>
          </button>
        </div>

        {/* Simplified Planning Form */}
        <form onSubmit={handleCreateJourney} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Where are you going? */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Where are you going?</span>
              </label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-[#EFE8DF] text-stone-900 text-sm font-semibold focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition appearance-none cursor-pointer"
                >
                  {destinationOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* When? */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>When & Duration?</span>
              </label>
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-[#EFE8DF] text-stone-900 text-sm font-semibold focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition appearance-none cursor-pointer"
                >
                  <option value="1">1 Day (Highlight Circuit)</option>
                  <option value="2">2 Days (Weekend Exploration)</option>
                  <option value="3">3 Days (Deep Heritage)</option>
                  <option value="5">5 Days (Regional Grand Tour)</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="space-y-2 flex flex-col justify-end">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md shadow-amber-900/15 flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
              >
                <span>Create My Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* What do you enjoy? */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              What do you enjoy?
            </label>
            <div className="flex flex-wrap gap-2.5">
              {interestOptions.map((opt) => {
                const isSelected = selectedInterests.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                      isSelected
                        ? 'bg-amber-100 text-amber-900 border-2 border-amber-600 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-[#EFE8DF]'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 border border-dashed border-stone-300 hover:border-stone-400 transition flex items-center gap-1.5 ml-auto"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Fewer Options' : 'Preferences'}</span>
              </button>
            </div>
          </div>

          {/* Progressive Disclosure: Advanced Preferences */}
          {showAdvanced && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-[#EFE8DF] flex items-center gap-4 flex-wrap animate-fadeIn">
              <span className="text-xs font-semibold text-stone-700">Exploration Pace:</span>
              {(['relaxed', 'moderate', 'fast'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPace(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                    pace === p
                      ? 'bg-amber-800 text-white'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
