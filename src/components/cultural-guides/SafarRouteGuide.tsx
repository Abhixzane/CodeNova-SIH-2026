import React from 'react';
import { GuideIllustration } from './GuideIllustrations';
import { GUIDE_CHARACTERS } from './CulturalGuideTypes';
import { Train, Navigation, IndianRupee, Clock, ArrowRight } from 'lucide-react';

interface SafarRouteGuideProps {
  origin?: string;
  destination?: string;
  cityContext?: string;
  estimatedTime?: string;
  estimatedFare?: string;
  onOpenRoutePlanner?: () => void;
  onOpenRailTransit?: () => void;
  className?: string;
}

export const SafarRouteGuide: React.FC<SafarRouteGuideProps> = ({
  origin,
  destination,
  cityContext,
  estimatedTime,
  estimatedFare,
  onOpenRoutePlanner,
  onOpenRailTransit,
  className = '',
}) => {
  const safar = GUIDE_CHARACTERS.safar;

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br from-emerald-50/50 via-white to-stone-50/60 p-5 sm:p-6 shadow-xs ${className}`}
      style={{ borderColor: safar.themeColor.border }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <GuideIllustration characterId="safar" size="lg" className="self-center sm:self-auto" />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-sm font-bold text-stone-900">
              {safar.name} ({safar.hindiName})
            </span>
            <span
              className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: safar.themeColor.bgLight, color: safar.themeColor.text }}
            >
              Journey & Transit Specialist
            </span>
            {cityContext && cityContext !== 'All India' && (
              <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                📍 {cityContext} Transit
              </span>
            )}
          </div>

          <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
            {origin && destination
              ? `Fastest Connection: ${origin} ➔ ${destination}`
              : "Let's Find the Easiest Way to Reach Your Destination"}
          </h4>

          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
            {safar.defaultSpeech}
          </p>

          {(estimatedTime || estimatedFare) && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2.5">
              {estimatedTime && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Est. Time: {estimatedTime}</span>
                </div>
              )}
              {estimatedFare && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Fare: {estimatedFare}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
            {onOpenRoutePlanner && (
              <button
                onClick={onOpenRoutePlanner}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-white shadow-xs transition hover:opacity-90 active:scale-95"
                style={{ backgroundColor: safar.themeColor.primary }}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Calculate Best Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onOpenRailTransit && (
              <button
                onClick={onOpenRailTransit}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50 transition active:scale-95"
              >
                <Train className="w-3.5 h-3.5 text-emerald-600" />
                <span>Suburban & Railway Lines</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
