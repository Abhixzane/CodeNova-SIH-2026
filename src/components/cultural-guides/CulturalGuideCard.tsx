import React from 'react';
import { GuideCharacterId, GUIDE_CHARACTERS } from './CulturalGuideTypes';
import { GuideIllustration } from './GuideIllustrations';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CulturalGuideCardProps {
  characterId: GuideCharacterId;
  title?: string;
  subtitle?: string;
  quote?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  cityContext?: string;
  variant?: 'banner' | 'card' | 'compact' | 'hero-badge';
  className?: string;
}

export const CulturalGuideCard: React.FC<CulturalGuideCardProps> = ({
  characterId,
  title,
  subtitle,
  quote,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  cityContext,
  variant = 'card',
  className = '',
}) => {
  const guide = GUIDE_CHARACTERS[characterId];
  const displayTitle = title || `${guide.greeting} I am ${guide.name}`;
  const displaySubtitle = subtitle || guide.title;
  const displayQuote = quote || guide.defaultSpeech;
  const displayAction = actionLabel || guide.quickActions[0]?.label || 'Explore With Guide';

  if (variant === 'hero-badge') {
    return (
      <div
        className={`inline-flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-full pl-2 pr-4 py-1.5 border shadow-xs hover:shadow-md transition-all duration-300 ${className}`}
        style={{ borderColor: guide.themeColor.border }}
      >
        <GuideIllustration characterId={characterId} size="sm" />
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-900">{guide.name}</span>
            <span className="text-[10px] text-stone-500">({guide.hindiName})</span>
            <span
              className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded-full"
              style={{ backgroundColor: guide.themeColor.bgLight, color: guide.themeColor.text }}
            >
              {guide.title.split('&')[0].trim()}
            </span>
          </div>
          <p className="text-[11px] text-stone-600 line-clamp-1">{displayQuote}</p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="ml-1 text-xs font-semibold px-2.5 py-1 rounded-full text-white transition hover:opacity-90 active:scale-95 shrink-0 flex items-center gap-1"
            style={{ backgroundColor: guide.themeColor.primary }}
          >
            <span>{displayAction}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-xl border bg-white/90 shadow-2xs transition-all hover:shadow-xs ${className}`}
        style={{ borderColor: guide.themeColor.border }}
      >
        <GuideIllustration characterId={characterId} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-900">{guide.name}</span>
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: guide.themeColor.bgLight, color: guide.themeColor.text }}
            >
              {guide.role.split('.')[0]}
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-0.5 line-clamp-1">{displayQuote}</p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition hover:opacity-95 shrink-0 flex items-center gap-1"
            style={{ backgroundColor: guide.themeColor.primary }}
          >
            <span>{displayAction}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border p-4 sm:p-6 bg-gradient-to-r from-white via-white to-stone-50 shadow-xs transition-all ${className}`}
        style={{ borderColor: guide.themeColor.border }}
      >
        {/* Subtle Decorative Jaali Corner */}
        <div
          className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: guide.themeColor.primary }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <GuideIllustration characterId={characterId} size="lg" className="self-center sm:self-auto" />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-sm font-bold text-stone-900">{guide.name} ({guide.hindiName})</span>
              <span
                className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ backgroundColor: guide.themeColor.bgLight, color: guide.themeColor.text }}
              >
                {displaySubtitle}
              </span>
              {cityContext && cityContext !== 'All India' && (
                <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  📍 {cityContext} Specialist
                </span>
              )}
            </div>

            <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
              {displayTitle}
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              "{displayQuote}"
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3.5">
              {onAction && (
                <button
                  onClick={onAction}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-white shadow-xs transition hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: guide.themeColor.primary }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{displayAction}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {secondaryActionLabel && onSecondaryAction && (
                <button
                  onClick={onSecondaryAction}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 transition hover:bg-stone-50 active:scale-95"
                >
                  <span>{secondaryActionLabel}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default 'card' layout
  return (
    <div
      className={`rounded-2xl border p-5 bg-white shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${className}`}
      style={{ borderColor: guide.themeColor.border }}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <GuideIllustration characterId={characterId} size="md" />
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-right"
            style={{ backgroundColor: guide.themeColor.bgLight, color: guide.themeColor.text }}
          >
            {guide.name} • {guide.title.split(' ')[0]}
          </span>
        </div>

        <h4 className="font-serif font-bold text-base text-stone-900">
          {displayTitle}
        </h4>
        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
          "{displayQuote}"
        </p>

        {cityContext && cityContext !== 'All India' && (
          <div className="mt-3 text-[11px] font-medium text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-100 flex items-center gap-1.5">
            <span>📍 Active City:</span>
            <span className="font-semibold text-stone-800">{cityContext}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <button
          onClick={onAction}
          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl text-white shadow-2xs transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: guide.themeColor.primary }}
        >
          <span>{displayAction}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
