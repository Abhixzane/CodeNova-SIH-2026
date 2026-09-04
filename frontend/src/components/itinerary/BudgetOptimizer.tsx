import React, { useState } from 'react';
import { BudgetPlanOption } from '../../types';
import { IndianRupee, Zap, Scale, Clock, Train, Car, Footprints, CheckCircle2, ArrowRight } from 'lucide-react';

interface BudgetOptimizerProps {
  onSelectPlan: (plan: BudgetPlanOption) => void;
}

export const BudgetOptimizer: React.FC<BudgetOptimizerProps> = ({ onSelectPlan }) => {
  const [budget, setBudget] = useState<number>(500);
  const [hours, setHours] = useState<number>(5);
  const [origin, setOrigin] = useState('CSMT, Mumbai');

  const plans: BudgetPlanOption[] = [
    {
      type: 'CHEAPEST',
      title: 'Cheapest Plan (Rail & Walk)',
      mode_name: 'Suburban Local Train + Walking Connections',
      transport_summary: 'Suburban Local Train + Walking Connections',
      estimated_cost: 80,
      duration_hours: 4.5,
      stops_count: 4,
      explanation: 'Maximizes your ₹500 budget by using Mumbai suburban rail network and walkable colonial avenues in South Mumbai.',
      stops: ['CSMT Railway Station', 'Gateway of India', 'CSMVS Museum', 'Marine Drive Promenade'],
    },
    {
      type: 'FASTEST',
      title: 'Fastest Plan (Direct Cab)',
      mode_name: 'Point-to-Point Premier AC Taxi / Auto',
      transport_summary: 'Point-to-Point Premier AC Taxi / Auto',
      estimated_cost: 420,
      duration_hours: 3.2,
      stops_count: 4,
      explanation: 'Minimizes transit wait times with direct point-to-point road travel, leaving maximum time to explore each monument.',
      stops: ['CSMT Railway Station', 'Gateway of India', 'Marine Drive', 'Worli Sea Face'],
    },
    {
      type: 'BALANCED',
      title: 'Balanced Plan (Smart Hybrid)',
      mode_name: 'Suburban Train + Local Taxi for last-mile',
      transport_summary: 'Suburban Train for long haul + Local Taxi for last-mile',
      estimated_cost: 180,
      duration_hours: 3.8,
      stops_count: 4,
      explanation: 'Optimal blend of cost savings and speed, utilizing the Western Line to Churchgate and short taxi rides for monuments.',
      stops: ['CSMT Railway Station', 'Gateway of India', 'Kala Ghoda Art Precinct', 'Marine Drive'],
    },
  ];

  return (
    <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-6 border border-parchment-300 bg-parchment-50/90 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans']">
              Smart Budget Optimizer
            </h3>
            <p className="text-xs text-charcoal-light">
              Compare transit costs, travel speeds, and tailored multi-stop tour feasibility
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          Triple Feasibility Matrix
        </span>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-parchment-300 text-xs">
        <div>
          <label className="text-[11px] font-bold text-charcoal-light uppercase block mb-1.5">
            Total Budget (INR)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-500 font-bold">₹</span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-parchment-100 border border-parchment-300 rounded-xl pl-7 pr-3 py-2 text-charcoal font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-charcoal-light uppercase block mb-1.5">
            Available Time (Hours)
          </label>
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full bg-parchment-100 border border-parchment-300 rounded-xl px-3 py-2 text-charcoal font-medium"
          >
            <option value={3}>3 Hours</option>
            <option value={5}>5 Hours</option>
            <option value={8}>8 Hours</option>
            <option value={12}>12 Hours (Full Day)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-charcoal-light uppercase block mb-1.5">
            Start Location
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full bg-parchment-100 border border-parchment-300 rounded-xl px-3 py-2 text-charcoal font-medium"
          />
        </div>
      </div>

      {/* 3 Feasibility Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isCheapest = plan.type === 'CHEAPEST';
          const isFastest = plan.type === 'FASTEST';
          const isBalanced = plan.type === 'BALANCED';

          return (
            <div
              key={plan.type}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isBalanced
                  ? 'bg-gradient-to-b from-[#0e1b38] to-[#0c1427] border-sage shadow-lg shadow-emerald-500/10'
                  : 'bg-parchment-100/90 border-parchment-300 hover:border-parchment-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isCheapest
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : isFastest
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-terracotta text-slate-950 font-extrabold'
                    }`}
                  >
                    {plan.type}
                  </span>
                  {isBalanced && (
                    <span className="text-[10px] font-bold text-terracotta">★ Recommended</span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans']">
                    {plan.title}
                  </h4>
                  <p className="text-[11px] text-charcoal-light mt-1">
                    {plan.transport_summary}
                  </p>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-parchment-300/80">
                  <div>
                    <span className="text-xs text-charcoal-light block">Est. Cost</span>
                    <span className="text-xl font-black text-charcoal font-mono">
                      ₹{plan.estimated_cost}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-charcoal-light block">Tour Time</span>
                    <span className="text-sm font-bold text-terracotta font-mono">
                      {plan.duration_hours}h
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-charcoal-light leading-relaxed">
                  {plan.explanation}
                </p>

                {/* Stops Preview */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Stops:</span>
                  {plan.stops.map((st, sIdx) => (
                    <div key={sIdx} className="text-[11px] text-charcoal-light flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isBalanced
                    ? 'bg-terracotta hover:bg-terracotta-dark text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-charcoal border border-parchment-300'
                }`}
              >
                <span>Select {plan.type} Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
