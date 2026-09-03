import React from 'react';
import { Navigation, Box, Calendar, Train, ArrowRight } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface FeatureCardsGridProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const FeatureCardsGrid: React.FC<FeatureCardsGridProps> = ({ onNavigateTab }) => {
  const cards = [
    {
      tab: 'routes' as NavTab,
      title: 'Multi-Modal Route Engine',
      desc: 'Compare driving, suburban railways, autos, and walking with real-time fare estimates.',
      icon: Navigation,
      color: 'text-cyan-400',
      badge: 'Tariff Matrix',
      bgGlow: 'hover:border-cyan-500/50',
    },
    {
      tab: 'itinerary' as NavTab,
      title: 'Topological Day Planner',
      desc: 'Optimized travel legs, custom pace, budget levels, and sequence duration constraints.',
      icon: Calendar,
      color: 'text-orange-400',
      badge: 'Time-Budgeted',
      bgGlow: 'hover:border-orange-500/50',
    },
    {
      tab: '3d' as NavTab,
      title: 'WebGL 3D Architectural Simulation',
      desc: 'Inspect iconic Indian monuments in full 3D with interactive lighting and wireframes.',
      icon: Box,
      color: 'text-amber-400',
      badge: 'Three.js Engine',
      bgGlow: 'hover:border-amber-500/50',
    },
    {
      tab: 'dashboard' as NavTab,
      title: 'Indian Railways & Transit Hubs',
      desc: 'Proximity detection to key suburban stations, junctions, line colors, and walking times.',
      icon: Train,
      color: 'text-emerald-400',
      badge: 'Station Radii',
      bgGlow: 'hover:border-emerald-500/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.tab}
            onClick={() => onNavigateTab(c.tab)}
            className={`group cursor-pointer rounded-2xl bg-parchment-100/90 border border-parchment-300 p-5 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${c.bgGlow}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl bg-slate-900 border border-parchment-300 ${c.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-charcoal-light border border-parchment-300">
                  {c.badge}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-charcoal group-hover:text-orange-400 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-charcoal-light mt-1 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-charcoal-light group-hover:text-orange-400 transition-colors pt-2 border-t border-slate-800/60">
              <span>Open Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
