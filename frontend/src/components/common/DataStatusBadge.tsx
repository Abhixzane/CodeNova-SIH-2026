import React from 'react';
import { ShieldCheck, Activity, Database, CheckCircle2 } from 'lucide-react';

export const DataStatusBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-parchment-100/90 border border-parchment-300 text-[11px] text-charcoal-light backdrop-blur-md shadow-lg">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-terracotta">Places:</span>
        <span className="text-charcoal-light">Verified</span>
      </div>
      <span className="text-slate-700">?</span>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400" />
        <span className="font-semibold text-cyan-400">Routes:</span>
        <span className="text-charcoal-light">Multi-Modal</span>
      </div>
      <span className="text-slate-700">?</span>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="font-semibold text-amber-400">Fares:</span>
        <span className="text-charcoal-light">Estimated</span>
      </div>
      <span className="text-slate-700">?</span>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-indigo-400" />
        <span className="font-semibold text-indigo-400">Heritage:</span>
        <span className="text-charcoal-light">Curated</span>
      </div>
    </div>
  );
};
