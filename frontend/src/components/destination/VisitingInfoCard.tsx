import React from 'react';
import { VisitingInfo, EntryFee, PlaceDetail } from '../../types';
import { Clock, IndianRupee, Sun, CheckCircle2, ShieldCheck } from 'lucide-react';

interface VisitingInfoCardProps {
  place?: PlaceDetail;
  visitingInfo?: VisitingInfo;
  entryFee?: EntryFee;
  visitingHours?: string;
  bestTime?: string;
}

export const VisitingInfoCard: React.FC<VisitingInfoCardProps> = ({
  place,
  visitingInfo,
  entryFee,
  visitingHours,
  bestTime,
}) => {
  const info = place?.visiting_info || visitingInfo;
  const fee = place?.entry_fee || entryFee;
  const hours = info?.visiting_hours || place?.visiting_hours || visitingHours || 'Open Daily: 06:00 AM - 10:00 PM';
  const best = info?.best_time_to_visit || place?.best_time_to_visit || bestTime || 'October to March (Pleasant Breeze)';
  const duration = info?.recommended_duration || '1 - 2 hours';
  const tips = info?.tips || [
    'Visit early morning or at sunset for scenic views and cooler weather.',
    'Keep your electronic tickets or identification handy if required.',
    'Respect local heritage preservation rules and keep the monument clean.',
  ];

  return (
    <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-6 border border-parchment-300 bg-parchment-50/90 space-y-6 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-parchment-300">
        <h3 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans'] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-terracotta" />
          <span>Visiting & Operational Guidelines</span>
        </h3>
        <span className="text-[10px] font-bold bg-terracotta/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
          Verified Curated
        </span>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Hours */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-parchment-300 space-y-1">
          <div className="flex items-center gap-1.5 text-charcoal-light text-xs">
            <Clock className="w-3.5 h-3.5 text-terracotta" />
            <span className="text-[10px] uppercase font-bold text-charcoal-light">Visiting Hours</span>
          </div>
          <div className="text-xs font-semibold text-charcoal">{hours}</div>
        </div>

        {/* Best Time */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-parchment-300 space-y-1">
          <div className="flex items-center gap-1.5 text-charcoal-light text-xs">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase font-bold text-charcoal-light">Best Time & Duration</span>
          </div>
          <div className="text-xs font-semibold text-charcoal">{duration}</div>
          <div className="text-[10px] text-charcoal-light">{best}</div>
        </div>

        {/* Entry Fee */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-parchment-300 space-y-1">
          <div className="flex items-center gap-1.5 text-charcoal-light text-xs">
            <IndianRupee className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase font-bold text-charcoal-light">Entry Ticket</span>
          </div>
          <div className="text-xs font-semibold text-charcoal">
            {fee && (fee.domestic > 0 || fee.international > 0) ? (
              <span>₹{fee.domestic} (Dom) / ₹{fee.international} (Intl)</span>
            ) : (
              <span className="text-terracotta font-bold">Free Entry</span>
            )}
          </div>
        </div>
      </div>

      {/* Practical Tips */}
      {tips.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] uppercase font-bold text-charcoal-light tracking-wider">
            Practical Visitor Tips
          </h4>
          <ul className="space-y-1.5">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-charcoal-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-terracotta flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
