import React from 'react';
import { FareStatus } from '../../types';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface FareBadgeProps {
  status: FareStatus;
  fare?: number | null;
  currency?: string;
  size?: 'sm' | 'md';
}

export const FareBadge: React.FC<FareBadgeProps> = ({
  status,
  fare,
  currency = '?',
  size = 'md',
}) => {
  const isSm = size === 'sm';

  if (status === 'provider_confirmed') {
    return (
      <div className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-terracotta/10 border border-emerald-500/30 text-terracotta ${isSm ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
        <CheckCircle2 className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span>
          {fare !== undefined && fare !== null ? `${currency}${fare.toFixed(0)}` : 'Confirmed'}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 ml-0.5">Confirmed</span>
      </div>
    );
  }

  if (status === 'estimated') {
    return (
      <div className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 ${isSm ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
        <AlertCircle className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span>
          {fare !== undefined && fare !== null ? `~${currency}${fare.toFixed(0)}` : 'Est.'}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 ml-0.5">Estimated</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-800/80 border border-parchment-300 text-charcoal-light ${isSm ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
      <HelpCircle className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span className="text-xs">Fare N/A</span>
    </div>
  );
};
