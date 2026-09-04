import React, { useState } from 'react';
import { Calendar, Clock, IndianRupee, Sparkles, Navigation, ArrowRight, Bookmark, Check, Loader2, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { ItineraryResponse } from '../types';
import { NavTab } from '../components/layout/Sidebar';

interface ItineraryPageProps {
  onSelectPlace: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  selectedCity: string;
}

export const ItineraryPage: React.FC<ItineraryPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  selectedCity = 'Mumbai',
}) => {
  const [city, setCity] = useState(selectedCity);
  const [duration, setDuration] = useState(8);
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'fast'>('moderate');
  const [budget, setBudget] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [interests, setInterests] = useState<string[]>(['heritage', 'architecture']);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setSaveSuccess(false);
    try {
      const plan = await api.generateItinerary({
        city,
        duration_hours: duration,
        pace,
        budget_level: budget,
        interests,
      });
      setItinerary(plan);
    } catch (err) {
      console.error('Failed to generate itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!itinerary) return;
    try {
      const stopsList = itinerary.stops || itinerary.timeline || [];
      await api.saveTrip({
        title: itinerary.title || `${city} ${duration}-Hour Heritage Circuit`,
        city: itinerary.city || city,
        duration_hours: duration,
        estimated_cost: itinerary.estimated_total_cost || itinerary.total_cost_estimate?.moderate || 450,
        stops: stopsList.map((item, idx) => ({
          place_id: item.place_id,
          place_name: item.name || item.place_name || `Stop ${idx + 1}`,
          order: idx + 1,
          visit_minutes: item.recommended_duration_minutes || item.visit_minutes || 60,
        })),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save trip:', err);
    }
  };

  const stopsList = itinerary?.stops || itinerary?.timeline || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-6 animate-fadeIn">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Topological Circuit Optimizer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">Smart Day Planner</h1>
        <p className="text-xs sm:text-sm text-charcoal-light max-w-2xl leading-relaxed">
          Generate an optimized sequence of heritage monuments with calculated travel legs, arrival times, and realistic buffer intervals.
        </p>
      </div>

      {/* Control Panel */}
      <div className="rounded-3xl bg-slate-900/60 border border-parchment-300 p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Destination Hub */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal">Destination Hub</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-parchment-300 text-xs text-charcoal focus:outline-none focus:border-orange-500"
            >
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Kochi">Kochi</option>
              <option value="Goa">Goa</option>
              <option value="Agra">Agra</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal">Time Window</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-parchment-300 text-xs text-charcoal focus:outline-none focus:border-orange-500"
            >
              <option value={4}>4 Hours (Express Morning / Sunset)</option>
              <option value={6}>6 Hours (Balanced Heritage Half-Day)</option>
              <option value={8}>8 Hours (Full Day Classic)</option>
              <option value={12}>12 Hours (Comprehensive Grand Tour)</option>
            </select>
          </div>

          {/* Pace */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal">Travel Pace</label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-parchment-300 text-xs text-charcoal focus:outline-none focus:border-orange-500"
            >
              <option value="relaxed">Relaxed (Spacious photography)</option>
              <option value="moderate">Moderate (Standard sightseeing)</option>
              <option value="fast">Packed (Maximum monuments)</option>
            </select>
          </div>

          {/* Budget tier */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal">Budget Tier</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-parchment-300 text-xs text-charcoal focus:outline-none focus:border-orange-500"
            >
              <option value="budget">Budget (Suburban Trains & Walking)</option>
              <option value="moderate">Moderate (Auto-rickshaws & Taxis)</option>
              <option value="luxury">Comfort (AC Cabs & Guided Tours)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Optimizing Geographic Sequence...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Optimized Itinerary</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Plan View */}
      {itinerary && (
        <div className="space-y-6 animate-fadeIn">
          {/* Plan Header Card */}
          <div className="rounded-3xl bg-parchment-100/90 border border-parchment-300 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-charcoal">
                {itinerary.title || `${city} ${duration}-Hour Heritage Circuit`}
              </h2>
              <p className="text-xs text-charcoal-light">
                {itinerary.summary || `Personalized ${duration}-hour circuit through ${city}`}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-parchment-300 text-xs font-semibold text-emerald-400">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Est. ₹{itinerary.estimated_total_cost || itinerary.total_cost_estimate?.moderate || 450}</span>
              </div>

              <button
                onClick={handleSave}
                disabled={saveSuccess}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-md"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Saved to My Trips!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
            {stopsList.map((item, idx) => {
              const placeName = item.name || item.place_name || `Stop ${idx + 1}`;
              const visitMins = item.recommended_duration_minutes || item.visit_minutes || 60;
              const travelMins = item.travel_time_from_previous_minutes;
              const travelDist = item.distance_from_previous_km;

              return (
                <div key={idx} className="relative flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-orange-500 text-orange-400 font-bold text-xs flex items-center justify-center z-10 flex-shrink-0 group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>

                  <div className="flex-1 rounded-2xl bg-parchment-100/90 border border-parchment-300 p-4 sm:p-5 space-y-2 group-hover:border-orange-500/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        {item.start_time && item.end_time ? (
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {item.start_time} - {item.end_time}
                          </span>
                        ) : (
                          <span className="text-xs font-mono font-bold text-amber-400">
                            Stop #{idx + 1}
                          </span>
                        )}
                        <span className="text-[11px] text-charcoal-light">({visitMins} min visit)</span>
                      </div>

                      <button
                        onClick={() => onSelectPlace(item.place_id)}
                        className="text-xs text-orange-400 hover:underline font-semibold self-start sm:self-auto"
                      >
                        View Details →
                      </button>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-charcoal">
                      {placeName}
                    </h3>

                    {(item.activity || item.visit_tips || item.tips) && (
                      <p className="text-xs text-charcoal-light leading-relaxed">
                        {item.activity || item.visit_tips || item.tips}
                      </p>
                    )}

                    {/* Travel leg from previous */}
                    {travelMins !== null && travelMins !== undefined && (
                      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-cyan-400">
                        <Navigation className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>
                          Transit from previous: {item.travel_mode_from_previous || 'Transit / Taxi'} • {travelMins} mins {travelDist ? `(${travelDist} km)` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
