import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const OnboardingSurveyModal: React.FC = () => {
  const { isSurveyModalOpen, setSurveyModalOpen, saveSurvey, user } = useAuth();
  const [travelerType, setTravelerType] = useState('Heritage explorer');
  const [tripDuration, setTripDuration] = useState('2-3 days');
  const [budgetRange, setBudgetRange] = useState<'budget' | 'moderate' | 'premium'>('budget');
  const [preferredTransport, setPreferredTransport] = useState('mixed');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['heritage', 'coastal', 'culture']);

  if (!isSurveyModalOpen) return null;

  const travelerTypes = [
    'Heritage explorer',
    'Nature lover',
    'Beach traveller',
    'Spiritual seeker',
    'Food explorer',
    'Family traveller',
  ];

  const durations = ['1 day', '2-3 days', '4-7 days', '1+ week'];
  const transports = [
    { id: 'train', label: '🚆 Suburban Train' },
    { id: 'taxi', label: '🚕 Taxi / Cab' },
    { id: 'walk', label: '🚶 Walking' },
    { id: 'mixed', label: '🔄 Mixed / Multi-modal' },
  ];

  const interestOptions = [
    'heritage',
    'architecture',
    'caves',
    'beaches',
    'museums',
    'temples',
    'photography',
    'street food',
    'nature trails',
  ];

  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleFinish = async () => {
    await saveSurvey({
      traveler_type: travelerType,
      trip_duration: tripDuration,
      budget_range: budgetRange,
      preferred_transport: preferredTransport,
      interests: selectedInterests,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-parchment-50 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl text-charcoal">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/10 border border-emerald-500/20 text-terracotta text-xs font-semibold mb-2">
            <Sparkles size={14} /> Personalize Your BharatYatra Journey
          </div>
          <h2 className="text-2xl font-bold">What kind of traveler are you, {user?.name.split(' ')[0] || 'Friend'}?</h2>
          <p className="text-xs text-charcoal-light mt-1">Help our AI tailor monuments, routes, and budget itineraries specifically for you.</p>
        </div>

        <div className="space-y-6 text-sm">
          {/* Question 1: Traveler Type */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-light mb-2">Primary Travel Style</label>
            <div className="grid grid-cols-2 gap-2">
              {travelerTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTravelerType(type)}
                  className={`p-3 rounded-xl border text-xs font-medium transition text-left flex items-center justify-between ${
                    travelerType === type
                      ? 'bg-terracotta/20 border-emerald-500 text-emerald-300'
                      : 'bg-parchment border-parchment-300 text-charcoal-light hover:border-parchment-300'
                  }`}
                >
                  <span>{type}</span>
                  {travelerType === type && <Check size={14} className="text-terracotta" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Duration & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-light mb-2">Typical Trip Duration</label>
              <select
                value={tripDuration}
                onChange={(e) => setTripDuration(e.target.value)}
                className="w-full p-3 rounded-xl bg-parchment border border-parchment-300 text-xs text-charcoal focus:border-emerald-500 focus:outline-none"
              >
                {durations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-light mb-2">Budget Tier</label>
              <div className="flex gap-1.5">
                {(['budget', 'moderate', 'premium'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudgetRange(b)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs capitalize font-semibold transition ${
                      budgetRange === b
                        ? 'bg-terracotta/20 border-emerald-500 text-emerald-300'
                        : 'bg-parchment border-parchment-300 text-charcoal-light hover:border-parchment-300'
                    }`}
                  >
                    {b === 'budget' ? '₹ Budget' : b === 'moderate' ? '₹₹ Moderate' : '₹₹₹ Premium'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question 3: Preferred Transport */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-light mb-2">Preferred Transport Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {transports.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPreferredTransport(t.id)}
                  className={`p-3 rounded-xl border text-xs font-medium transition text-left flex items-center justify-between ${
                    preferredTransport === t.id
                      ? 'bg-terracotta/20 border-emerald-500 text-emerald-300'
                      : 'bg-parchment border-parchment-300 text-charcoal-light hover:border-parchment-300'
                  }`}
                >
                  <span>{t.label}</span>
                  {preferredTransport === t.id && <Check size={14} className="text-terracotta" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Interests */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-light mb-2">What sparks your interest? (Select multiple)</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium capitalize transition ${
                    selectedInterests.includes(item)
                      ? 'bg-terracotta/20 border-emerald-500 text-emerald-300'
                      : 'bg-parchment border-parchment-300 text-charcoal-light hover:border-parchment-300'
                  }`}
                >
                  {selectedInterests.includes(item) ? '✓ ' : '+ '}{item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => setSurveyModalOpen(false)}
            className="flex-1 py-3 rounded-xl bg-slate-800 text-charcoal-light font-semibold text-xs hover:bg-slate-700 transition"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={handleFinish}
            className="flex-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span>Save Preferences & Start Exploring</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
