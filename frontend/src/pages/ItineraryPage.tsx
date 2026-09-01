import React, { useState } from 'react';
import { ItineraryResponse, BudgetPlanOption } from '../types';
import { api } from '../services/api';
import { ItineraryForm } from '../components/itinerary/ItineraryForm';
import { ItineraryTimeline } from '../components/itinerary/ItineraryTimeline';
import { BudgetOptimizer } from '../components/itinerary/BudgetOptimizer';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { CalendarDays, Sparkles, IndianRupee, SlidersHorizontal } from 'lucide-react';

export const ItineraryPage: React.FC = () => {
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'planner' | 'budget'>('planner');

  const handleGenerate = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.generateItinerary(params);
      setItinerary(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBudgetPlan = (plan: BudgetPlanOption) => {
    handleGenerate({
      city: 'Mumbai',
      duration_hours: plan.duration_hours,
      budget_level: plan.type.toLowerCase(),
      interests: ['heritage', 'coastal'],
    });
    setActiveTab('planner');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold border border-emerald-500/20">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>AI Tour Synthesizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-['Plus_Jakarta_Sans']">
            Smart Day-Trip Itinerary Planner
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-light">
            Generate sequenced heritage tours with visiting duration, inter-stop transit times, and budget controls.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-parchment-100 border border-parchment-300 self-start">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'planner'
                ? 'bg-terracotta text-slate-950 shadow-md'
                : 'text-charcoal-light hover:text-charcoal'
            }`}
          >
            Custom Planner
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'budget'
                ? 'bg-terracotta text-slate-950 shadow-md'
                : 'text-charcoal-light hover:text-charcoal'
            }`}
          >
            <IndianRupee className="w-3 h-3" />
            <span>Budget Optimizer</span>
          </button>
        </div>
      </div>

      {activeTab === 'budget' && (
        <BudgetOptimizer onSelectPlan={handleSelectBudgetPlan} />
      )}

      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <ItineraryForm onGenerate={handleGenerate} loading={loading} />
          </div>

          <div className="lg:col-span-7">
            {loading ? (
              <div className="min-h-[400px] flex items-center justify-center heritage-border heritage-shadow bg-parchment-50 rounded-3xl border border-parchment-300 bg-parchment-50/80">
                <LoadingSpinner message="Synthesizing feasible sequential tour with travel times..." />
              </div>
            ) : error ? (
              <ErrorMessage message={error} onRetry={() => {}} />
            ) : itinerary ? (
              <ItineraryTimeline itinerary={itinerary} />
            ) : (
              <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center heritage-border heritage-shadow bg-parchment-50 rounded-3xl border border-parchment-300 bg-parchment-50/80 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-terracotta/15 text-terracotta flex items-center justify-center">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-charcoal">Your Itinerary Will Appear Here</h3>
                <p className="text-xs text-charcoal-light max-w-sm">
                  Select your available time budget and interests on the left to generate an optimized Mumbai itinerary.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
