import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  IndianRupee,
  Sparkles,
  Navigation,
  ArrowRight,
  Bookmark,
  Check,
  Loader2,
  MapPin,
  Trash2,
  MoveUp,
  MoveDown,
  Plus,
  Compass,
  Map as MapIcon,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { ItineraryResponse, ItineraryStop } from '../types';
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
  const [city, setCity] = useState(selectedCity === 'All India' ? 'Delhi' : selectedCity);
  const [duration, setDuration] = useState(8);
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'fast'>('moderate');
  const [budget, setBudget] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [interests, setInterests] = useState<string[]>(['heritage', 'architecture']);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [stops, setStops] = useState<ItineraryStop[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync city when prop changes
  useEffect(() => {
    if (selectedCity && selectedCity !== 'All India' && selectedCity !== city) {
      setCity(selectedCity);
    }
  }, [selectedCity]);

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
      setStops(plan.stops || plan.timeline || []);
    } catch (err) {
      console.error('Failed to generate itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    const newStops = [...stops];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newStops.length) return;
    const temp = newStops[index];
    newStops[index] = newStops[targetIdx];
    newStops[targetIdx] = temp;
    setStops(newStops);
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    if (!itinerary) return;
    try {
      await api.saveTrip({
        title: itinerary.title || `${city} ${duration}-Hour Heritage Circuit`,
        city: itinerary.city || city,
        duration_hours: duration,
        estimated_cost: itinerary.estimated_total_cost || itinerary.total_cost_estimate?.moderate || 450,
        stops: stops.map((item, idx) => ({
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Topological Circuit Optimizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Smart Day Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Generate an optimized sequence of heritage monuments with calculated travel legs, arrival times, and realistic buffer intervals.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('routes')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition self-start sm:self-auto"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Go to Route Studio</span>
        </button>
      </div>

      {/* Control Panel */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Destination Hub */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Destination Hub
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Agra">Agra</option>
              <option value="Kochi">Kochi</option>
              <option value="Varanasi">Varanasi</option>
              <option value="Goa">Goa</option>
              <option value="Amritsar">Amritsar</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Time Window
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value={4}>4 Hours (Express Morning / Sunset)</option>
              <option value={6}>6 Hours (Balanced Half-Day)</option>
              <option value={8}>8 Hours (Full Day Classic)</option>
              <option value={12}>12 Hours (Comprehensive Grand Tour)</option>
            </select>
          </div>

          {/* Pace */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Travel Pace
            </label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="relaxed">Relaxed (Spacious photography)</option>
              <option value="moderate">Moderate (Standard sightseeing)</option>
              <option value="fast">Packed (Maximum monuments)</option>
            </select>
          </div>

          {/* Budget tier */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Budget Tier
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="budget">Budget (Trains, Metro & Walking)</option>
              <option value="moderate">Moderate (Auto-rickshaws & Taxis)</option>
              <option value="luxury">Comfort (AC Cabs & Guided Tours)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Optimizing Geographic Sequence for {city}...</span>
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
        <div className="space-y-6">
          {/* Plan Header Card */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">
                {itinerary.title || `${city} ${duration}-Hour Heritage Circuit`}
              </h2>
              <p className="text-xs text-slate-500">
                {itinerary.summary || `Personalized ${duration}-hour circuit through ${city} with ${stops.length} stops.`}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Est. ₹{itinerary.estimated_total_cost || itinerary.total_cost_estimate?.moderate || 450}</span>
              </div>

              <button
                onClick={() => onNavigateTab('map')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>View on Map</span>
              </button>

              <button
                onClick={handleSave}
                disabled={saveSuccess}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
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

          {/* Timeline Sequence */}
          <div className="space-y-4 relative before:absolute before:left-5 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200">
            {stops.map((item, idx) => {
              const placeName = item.name || item.place_name || `Stop ${idx + 1}`;
              const visitMins = item.recommended_duration_minutes || item.visit_minutes || 60;
              const travelMins = item.travel_time_from_previous_minutes;
              const travelDist = item.distance_from_previous_km;

              return (
                <div key={idx} className="relative flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-600 text-emerald-700 font-bold text-xs flex items-center justify-center z-10 flex-shrink-0 shadow-sm">
                    {idx + 1}
                  </div>

                  <div className="flex-1 rounded-2xl bg-white border border-slate-200 p-5 space-y-3 shadow-xs hover:border-emerald-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.start_time && item.end_time ? (
                          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {item.start_time} - {item.end_time}
                          </span>
                        ) : (
                          <span className="text-xs font-mono font-bold text-slate-700">
                            Stop #{idx + 1}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-medium">({visitMins} min visit)</span>
                      </div>

                      {/* Stop Actions: Reorder, Delete, View */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveStop(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move earlier"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveStop(idx, 'down')}
                          disabled={idx === stops.length - 1}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move later"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveStop(idx)}
                          className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                          title="Remove stop"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectPlace(item.place_id)}
                          className="text-xs text-emerald-700 hover:underline font-bold ml-2"
                        >
                          Dossier →
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {placeName}
                    </h3>

                    {(item.activity || item.visit_tips || item.tips) && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {item.activity || item.visit_tips || item.tips}
                      </p>
                    )}

                    {/* Transit leg from previous */}
                    {travelMins !== null && travelMins !== undefined && (
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                        <Navigation className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>
                          Transit from previous: <strong>{item.travel_mode_from_previous || 'Transit / Taxi'}</strong> • {travelMins} mins {travelDist ? `(${travelDist} km)` : ''}
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
