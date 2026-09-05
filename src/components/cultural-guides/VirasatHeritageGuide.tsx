import React from 'react';
import { GuideIllustration } from './GuideIllustrations';
import { GUIDE_CHARACTERS } from './CulturalGuideTypes';
import { Landmark, Box, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

interface VirasatHeritageGuideProps {
  monumentName?: string;
  location?: string;
  heritageStatus?: string;
  onAskHeritageAI?: (prompt: string) => void;
  onView3DModel?: () => void;
  onExploreUNESCO?: () => void;
  className?: string;
}

export const VirasatHeritageGuide: React.FC<VirasatHeritageGuideProps> = ({
  monumentName,
  location,
  heritageStatus,
  onAskHeritageAI,
  onView3DModel,
  onExploreUNESCO,
  className = '',
}) => {
  const virasat = GUIDE_CHARACTERS.virasat;

  const defaultPrompt = monumentName
    ? `Tell me the architectural secrets, historical chronicles, and cultural significance of ${monumentName}${location ? ` in ${location}` : ''}.`
    : 'Explain the significance of India’s UNESCO World Heritage sites.';

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br from-blue-50/50 via-white to-stone-50/60 p-5 sm:p-6 shadow-xs ${className}`}
      style={{ borderColor: virasat.themeColor.border }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <GuideIllustration characterId="virasat" size="lg" className="self-center sm:self-auto" />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-sm font-bold text-stone-900">
              {virasat.name} ({virasat.hindiName})
            </span>
            <span
              className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: virasat.themeColor.bgLight, color: virasat.themeColor.text }}
            >
              Heritage & Monument Specialist
            </span>
            {heritageStatus && (
              <span className="text-[11px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Landmark className="w-3 h-3" />
                {heritageStatus}
              </span>
            )}
          </div>

          <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
            {monumentName ? `Discover the Story Behind ${monumentName}` : 'Discover the Living Chronicles of India'}
          </h4>

          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
            {monumentName
              ? `Let Virasat narrate the dynastic origins, architectural geometry, and folklore that shaped ${monumentName}.`
              : virasat.defaultSpeech}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
            {onAskHeritageAI && (
              <button
                onClick={() => onAskHeritageAI(defaultPrompt)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-white shadow-xs transition hover:opacity-90 active:scale-95"
                style={{ backgroundColor: virasat.themeColor.primary }}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ask Virasat About This Site</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onView3DModel && (
              <button
                onClick={onView3DModel}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-blue-200 bg-white text-blue-900 hover:bg-blue-50 transition active:scale-95"
              >
                <Box className="w-3.5 h-3.5 text-blue-600" />
                <span>3D Architectural View</span>
              </button>
            )}

            {onExploreUNESCO && (
              <button
                onClick={onExploreUNESCO}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition active:scale-95"
              >
                <Landmark className="w-3.5 h-3.5 text-stone-500" />
                <span>Browse 45 UNESCO Sites</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
