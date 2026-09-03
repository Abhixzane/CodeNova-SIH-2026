import React from 'react';
import { Navigation, Box, Calendar, Train, Landmark, Bot, ArrowRight, ShieldCheck } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface FeatureCardsGridProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const FeatureCardsGrid: React.FC<FeatureCardsGridProps> = ({ onNavigateTab }) => {
  const cards = [
    {
      tab: 'heritage' as NavTab,
      title: '42 Heritage Sites Database',
      desc: 'Explore India’s UNESCO monuments with verified architectural style, entry fees, and transit.',
      icon: Landmark,
      color: 'text-amber-600',
      badge: '42 Verified Sites',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      tab: 'mumbai-local' as NavTab,
      title: 'Mumbai Suburban Rail Navigator',
      desc: 'Western, Central, and Harbour lines with authentic track km, Dadar interchange, and fare slabs.',
      icon: Train,
      color: 'text-sky-600',
      badge: '65+ Stations',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      tab: 'routes' as NavTab,
      title: 'Multimodal Transit Engine',
      desc: 'Compare driving, suburban railways, autos, and walking with real-time fare estimates.',
      icon: Navigation,
      color: 'text-emerald-600',
      badge: 'Haversine & Road',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      tab: '3d' as NavTab,
      title: 'WebGL 3D Heritage Experiences',
      desc: 'Inspect iconic Indian monuments in full 3D with interactive lighting and spatial geometry.',
      icon: Box,
      color: 'text-indigo-600',
      badge: 'WebGL Real-time',
      badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
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
            className="group cursor-pointer rounded-xl bg-white border border-slate-200 p-5 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md hover:border-slate-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <Icon className={`w-5 h-5 ${c.color}`} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badgeClass}`}>
                  {c.badge}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors pt-3 border-t border-slate-100">
              <span>Open Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
