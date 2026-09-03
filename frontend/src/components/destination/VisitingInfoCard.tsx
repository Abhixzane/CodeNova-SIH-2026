import React from 'react';
import { PlaceDetail } from '../../types';
import { 
  Clock, 
  IndianRupee, 
  Camera, 
  Calendar, 
  Check, 
  X, 
  Car, 
  Accessibility, 
  Sparkles 
} from 'lucide-react';

interface VisitingInfoCardProps {
  place: PlaceDetail;
}

export const VisitingInfoCard: React.FC<VisitingInfoCardProps> = ({ place }) => {
  const info = place.visiting_info;
  const entry = place.entry_fee;

  return (
    <div className="rounded-2xl bg-parchment-100/90 border border-parchment-300 p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2 border-b border-parchment-300 pb-3">
        <Clock className="w-5 h-5 text-orange-500" />
        <h3 className="text-sm font-bold text-charcoal">Practical Visitor Guide</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Timings */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-parchment-300/60 space-y-1">
          <div className="flex items-center gap-1.5 text-charcoal-light font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Visiting Hours</span>
          </div>
          <p className="font-semibold text-charcoal">
            {place.visiting_hours || (info?.opening_time ? `${info.opening_time} - ${info.closing_time}` : '09:00 AM - 06:00 PM')}
          </p>
          {info?.weekly_closed_day && (
            <p className="text-[11px] text-red-400">Closed on {info.weekly_closed_day}</p>
          )}
        </div>

        {/* Entry Fee */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-parchment-300/60 space-y-1">
          <div className="flex items-center gap-1.5 text-charcoal-light font-medium">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            <span>Entry Tickets</span>
          </div>
          <p className="font-semibold text-charcoal">
            {entry ? (entry.domestic === 0 ? 'Free Entry' : `Domestic: ₹${entry.domestic} | Foreign: ₹${entry.international}`) : 'Free Public Entry'}
          </p>
          <p className="text-[11px] text-charcoal-light">Online & counter booking</p>
        </div>

        {/* Best Time */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-parchment-300/60 space-y-1">
          <div className="flex items-center gap-1.5 text-charcoal-light font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Best Season / Time</span>
          </div>
          <p className="font-semibold text-charcoal">
            {place.best_time_to_visit || 'October to March (Pleasant weather)'}
          </p>
          <p className="text-[11px] text-charcoal-light">Recommended: 1-2 hours visit</p>
        </div>

        {/* Photography & Access */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-parchment-300/60 space-y-1">
          <div className="flex items-center gap-1.5 text-charcoal-light font-medium">
            <Camera className="w-3.5 h-3.5 text-purple-400" />
            <span>Amenities & Rules</span>
          </div>
          <div className="flex items-center gap-3 pt-1 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <Check className="w-3 h-3" /> Photography
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <Accessibility className="w-3 h-3" /> Accessible
            </span>
          </div>
        </div>
      </div>

      {place.heritage_status && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>Recognition: <strong>{place.heritage_status}</strong></span>
        </div>
      )}
    </div>
  );
};
