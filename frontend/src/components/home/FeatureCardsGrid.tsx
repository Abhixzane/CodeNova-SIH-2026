import React from 'react';
import { Box, Route, CalendarDays, IndianRupee, ArrowRight, ShieldCheck, MapPin, Sparkles, Navigation, Layers } from 'lucide-react';

interface FeatureCardsGridProps {
  onNavigateTab: (tab: string) => void;
}

export const FeatureCardsGrid: React.FC<FeatureCardsGridProps> = ({ onNavigateTab }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* 4 Feature Cards matching Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: 3D Map Explorer */}
        <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-6 border border-parchment-300 bg-parchment-50/90 relative overflow-hidden flex flex-col justify-between h-64 group hover:border-sage transition-all">
          <div className="absolute right-0 bottom-0 w-36 h-36 opacity-30 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&auto=format&fit=crop&q=80"
              alt="3D Gateway"
              className="w-full h-full object-cover rounded-tl-full"
            />
          </div>
          <div className="space-y-2 relative z-10">
            <h3 className="text-base font-bold text-charcoal font-['Plus_Jakarta_Sans']">
              3D Map Explorer
            </h3>
            <p className="text-xs text-charcoal-light">
              Explore monuments in WebGL 3D with interactive camera views, lighting presets, and architectural hotspots.
            </p>
          </div>
          <div className="relative z-10 pt-4">
            <button
              onClick={() => onNavigateTab('3d')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-dark text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Launch 3D Explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Live Road Updates matching Image 1 */}
        <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-6 border border-parchment-300 bg-parchment-50/90 flex flex-col justify-between h-64 group hover:border-sage transition-all">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-charcoal font-['Plus_Jakarta_Sans']">
              Multi-Modal Routes
            </h3>
            <p className="text-xs text-charcoal-light">
              Geodesic road calculations with suburban trains, taxis, buses, and walking.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-parchment-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal">CSMT → Gateway</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta/20 text-terracotta border border-emerald-500/30">
                Calculated
              </span>
            </div>
            <div className="text-[11px] text-charcoal-light flex items-center justify-between">
              <span>2.8 km • 4 Modes</span>
              <span className="text-terracotta font-semibold">₹10–₹160</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
              <div className="w-2/3 bg-terracotta" />
              <div className="w-1/3 bg-teal-500" />
            </div>
          </div>
        </div>

        {/* Card 3: Trip Planner matching Image 1 */}
        <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-6 border border-parchment-300 bg-parchment-50/90 flex flex-col justify-between h-64 group hover:border-sage transition-all">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-charcoal font-['Plus_Jakarta_Sans']">
              Smart Trip Planner
            </h3>
            <p className="text-xs text-charcoal-light">
              Plan custom day-trips with budget optimization (Cheapest vs Fastest vs Balanced).
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-charcoal-light">
              <span className="flex items-center gap-1">🗓️ 1-3 Days</span>
              <span className="flex items-center gap-1">📍 Multi-Stop</span>
              <span className="flex items-center gap-1">₹ Budget Feasible</span>
            </div>
            <button
              onClick={() => onNavigateTab('itinerary')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-charcoal text-xs font-bold transition-colors border border-parchment-300 flex items-center justify-center gap-1.5"
            >
              <span>Open Itinerary Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-terracotta" />
            </button>
          </div>
        </div>

        {/* Card 4: Fare & Cost Estimator matching Image 1 */}
        <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-6 border border-parchment-300 bg-parchment-50/90 flex flex-col justify-between h-64 group hover:border-sage transition-all">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-charcoal font-['Plus_Jakarta_Sans']">
              Fare & Cost Estimator
            </h3>
            <p className="text-xs text-charcoal-light">
              Transparent travel budgets with provenance indicators.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-parchment-300 space-y-1.5">
            <div className="text-[11px] text-charcoal-light">Mumbai → Jaipur Transit</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-terracotta font-['Plus_Jakarta_Sans']">
                ₹1,250
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-terracotta/15 text-emerald-300 border border-emerald-500/30">
                Estimated Fare
              </span>
            </div>
            {/* SVG Sparkline Graph */}
            <svg className="w-full h-8 text-terracotta" viewBox="0 0 100 25" fill="none">
              <path
                d="M0,20 Q25,5 50,15 T100,8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="15" r="2.5" fill="#10b981" />
              <circle cx="100" cy="8" r="2.5" fill="#34d399" />
            </svg>
          </div>
        </div>
      </div>

      {/* Meaningful Platform Capabilities Strip */}
      <div className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-4 border border-parchment-300 bg-parchment-50/80">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
          <div className="flex items-center justify-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-parchment-100 text-terracotta border border-parchment-300">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-charcoal font-['Plus_Jakarta_Sans']">Pan-India</div>
              <div className="text-[10px] text-charcoal-light">Multi-State Catalog</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-parchment-100 text-terracotta border border-parchment-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-charcoal font-['Plus_Jakarta_Sans']">Verified</div>
              <div className="text-[10px] text-charcoal-light">Curated Heritage</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-parchment-100 text-terracotta border border-parchment-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-charcoal font-['Plus_Jakarta_Sans']">Grounded AI</div>
              <div className="text-[10px] text-charcoal-light">Multi-Turn Context</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-parchment-100 text-terracotta border border-parchment-300">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-charcoal font-['Plus_Jakarta_Sans']">Google Maps</div>
              <div className="text-[10px] text-charcoal-light">Universal Handoff</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-parchment-100 text-terracotta border border-parchment-300">
              <Box className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-charcoal font-['Plus_Jakarta_Sans']">3D WebGL</div>
              <div className="text-[10px] text-charcoal-light">Procedural Lighting</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
