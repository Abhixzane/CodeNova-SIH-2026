import React, { useState } from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { ProvenanceBadge as ProvenanceType } from '../../types';

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  sourceText?: string;
  confidenceScore?: number;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  type,
  sourceText,
  confidenceScore,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getBadgeConfig = () => {
    switch (type) {
      case 'OFFICIAL':
        return {
          label: 'OFFICIAL',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: ShieldCheck,
          defaultSource: 'Archaeological Survey of India (ASI) / Ministry of Tourism / Census 2011',
          confidence: 'High Confidence (100%)',
        };
      case 'VERIFIED_SECONDARY':
        return {
          label: 'VERIFIED',
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          icon: CheckCircle2,
          defaultSource: 'State Tourism Board / OpenStreetMap / Indian Railways / GTFS Official Feeds',
          confidence: 'Audited Secondary (90%)',
        };
      case 'COMMUNITY':
        return {
          label: 'COMMUNITY',
          bg: 'bg-purple-50 text-purple-800 border-purple-300',
          icon: Info,
          defaultSource: 'Verified Field Guide / Heritage Enthusiast / Citizen Researcher Submission',
          confidence: 'Peer Reviewed (75%)',
        };
      case 'ESTIMATED':
      case 'MODELLED':
      case 'SIMULATED DEMO DATA':
        return {
          label: type === 'SIMULATED DEMO DATA' ? 'SIMULATED DEMO' : 'MODELLED',
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: Cpu,
          defaultSource: 'Statistical projection derived from transit frequency and seasonal visitor capacity algorithms.',
          confidence: 'Analytical Projection (Modelled)',
        };
      case 'UNVERIFIED':
      default:
        return {
          label: 'UNVERIFIED',
          bg: 'bg-stone-100 text-stone-700 border-stone-300',
          icon: AlertTriangle,
          defaultSource: 'Pending field inspection or administrative verification.',
          confidence: 'Provisional (50%)',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border tracking-wide transition-colors cursor-help ${config.bg} ${className}`}
        aria-label={`Provenance info: ${config.label}`}
      >
        <Icon className="w-3 h-3 flex-shrink-0" />
        <span>{config.label}</span>
      </button>

      {showTooltip && (
        <div
          role="tooltip"
          className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-white text-stone-800 rounded-lg shadow-xl border border-stone-200 z-50 text-xs font-normal pointer-events-none transition-all"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-1.5 mb-1.5">
            <span className="font-bold text-[11px] text-stone-900 tracking-wider">DATA PROVENANCE</span>
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {config.confidence}
            </span>
          </div>
          <p className="text-stone-600 leading-relaxed text-[11px]">
            {sourceText || config.defaultSource}
          </p>
          {confidenceScore !== undefined && (
            <div className="mt-2 text-[10px] text-stone-500 font-medium">
              Verified Confidence Score: {confidenceScore}%
            </div>
          )}
        </div>
      )}
    </div>
  );
};
