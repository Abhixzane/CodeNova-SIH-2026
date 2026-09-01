import React, { useState } from 'react';
import { ItineraryRequest } from '../../types';
import { CalendarDays, Clock, MapPin, Sparkles, Check } from 'lucide-react';

interface ItineraryFormProps {
  onGenerate: (data: ItineraryRequest) => void;
  loading: boolean;
}

export const ItineraryForm: React.FC<ItineraryFormProps> = ({ onGenerate, loading }) => {
  const [city, setCity] = useState<string>('Mumbai');
  const [origin, setOrigin] = useState<string>('gateway-of-india');
  const [durationHours, setDurationHours] = useState<number>(6);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['heritage', 'coastal']);

  const availableInterests = [
    { id: 'heritage', label: '??? Heritage & Monuments' },
    { id: 'coastal', label: '?? Coastal & Beaches' },
    { id: 'nature', label: '?? Nature & Parks' },
    { id: 'spiritual', label: '?? Spiritual Temples' },
    { id: 'museum', label: '?? Art & Museums' },
    { id: 'shopping', label: '??? Markets & Culture' },
  ];

  const originsList = [
    { id: 'gateway-of-india', name: 'Gateway of India (South Mumbai)' },
    { id: 'csmt', name: 'CSMT Station (Central Hub)' },
    { id: 'marine-drive', name: 'Marine Drive (Promenade)' },
    { id: 'bandra-fort', name: 'Bandra Fort (West Suburbs)' },
    { id: 'sanjay-gandhi-national-park', name: 'Sanjay Gandhi National Park (North)' },
  ];

  const durationOptions = [
    { hours: 2, label: '2 Hours (Quick Tour)' },
    { hours: 4, label: '4 Hours (Half Day)' },
    { hours: 6, label: '6 Hours (Recommended Day Trip)' },
    { hours: 8, label: '8 Hours (Full Day Exploration)' },
    { hours: 12, label: '12 Hours (Comprehensive Odyssey)' },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      city,
      origin,
      duration_hours: durationHours,
      interests: selectedInterests,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-6 sm:p-8 border border-parchment-300 bg-parchment-100/70 space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-parchment-300">
        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-charcoal font-['Plus_Jakarta_Sans']">
            Configure Your Day-Trip Tour
          </h3>
          <p className="text-xs text-charcoal-light">
            Intelligent time-budgeted itinerary matching your pace and interests
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City & Starting Origin */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-1.5">
              Pilot City:
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-950 border border-parchment-300 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-orange-500"
            >
              <option value="Mumbai">Mumbai (Maharashtra Pilot)</option>
              <option value="Rajasthan">Jaipur (Rajasthan)</option>
              <option value="Kerala">Alleppey (Kerala)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-1.5">
              Starting Hub / First Attraction:
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-950 border border-parchment-300 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-orange-500"
            >
              {originsList.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Budget */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-1.5">
            Available Time Budget:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {durationOptions.map((opt) => {
              const isSelected = durationHours === opt.hours;
              return (
                <button
                  key={opt.hours}
                  type="button"
                  onClick={() => setDurationHours(opt.hours)}
                  className={`p-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-orange-500/15 border-orange-500 text-charcoal font-semibold shadow-sm'
                      : 'bg-slate-950/60 border-parchment-300 text-charcoal-light hover:text-charcoal hover:bg-parchment-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-orange-400" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interests Multi-Select */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-2">
          Select Your Travel Interests:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {availableInterests.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleInterest(interest.id)}
                className={`p-3 rounded-xl text-xs font-medium transition-all text-left flex items-center justify-between border ${
                  isSelected
                    ? 'bg-orange-500 text-charcoal font-semibold border-orange-400 shadow-md shadow-orange-500/20'
                    : 'bg-slate-950/60 border-parchment-300 text-charcoal-light hover:bg-parchment-100'
                }`}
              >
                <span>{interest.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-charcoal" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-charcoal font-bold text-sm transition-all shadow-lg shadow-orange-500/25 active:scale-[0.99] disabled:opacity-50"
      >
        <Sparkles className="w-4 h-4" />
        <span>{loading ? 'Generating Smart Itinerary...' : 'Generate Day-Trip Tour Itinerary'}</span>
      </button>
    </form>
  );
};
