import React from 'react';
import { IndianRupee } from 'lucide-react';

interface FareBadgeProps {
  amount?: number;
  status?: 'fixed' | 'estimated' | 'metered' | 'free' | string;
  currency?: string;
  className?: string;
}

export const FareBadge: React.FC<FareBadgeProps> = ({
  amount,
  status,
  currency = 'INR',
  className = '',
}) => {
  if (status) {
    const isFree = status === 'free';
    const isMetered = status === 'metered';
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          isFree
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            : isMetered
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
        } ${className}`}
      >
        {status}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs font-bold ${className}`}
    >
      <IndianRupee className="w-3 h-3" />
      <span>{amount ?? 0}</span>
    </span>
  );
};
