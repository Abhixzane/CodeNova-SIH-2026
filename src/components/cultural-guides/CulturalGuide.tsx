import React, { useState } from 'react';
import { GuideCharacterId, GUIDE_CHARACTERS } from './CulturalGuideTypes';
import { GuideIllustration } from './GuideIllustrations';
import { GuideSpeechBubble } from './GuideSpeechBubble';
import { Sparkles, MessageCircle, ArrowRight, Compass, ShieldCheck, X } from 'lucide-react';

export interface GuideActionItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  primary?: boolean;
}

export interface CulturalGuideProps {
  characterId: GuideCharacterId;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  title?: string;
  tagline?: string;
  message: string;
  actions?: GuideActionItem[];
  orientation?: 'horizontal' | 'vertical' | 'floating-bottom-right';
  popIn?: boolean;
  popDirection?: 'right' | 'left' | 'bottom';
  className?: string;
  onClose?: () => void;
  showDismiss?: boolean;
}

export const CulturalGuide: React.FC<CulturalGuideProps> = ({
  characterId,
  size = 'md',
  title,
  tagline,
  message,
  actions = [],
  orientation = 'horizontal',
  popIn = true,
  popDirection = 'right',
  className = '',
  onClose,
  showDismiss = false,
}) => {
  const guide = GUIDE_CHARACTERS[characterId] || GUIDE_CHARACTERS.yatri;
  const [isHovered, setIsHovered] = useState(false);

  const displayTitle = title || guide.name;
  const displayTagline = tagline || guide.role;

  // Floating bottom-right corner widget style
  if (orientation === 'floating-bottom-right') {
    return (
      <aside
        aria-label={`Guide advice from ${guide.name}`}
        className={`fixed bottom-6 right-6 z-40 max-w-sm sm:max-w-md ${
          popIn ? 'animate-guide-pop-bottom' : ''
        } ${className}`}
      >
        <div className="relative flex items-end gap-3">
          <div
            className="shrink-0 -mb-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <GuideIllustration
              characterId={characterId}
              size={size === 'md' ? 'sm' : size}
              animated={true}
              interactive={true}
            />
          </div>

          <GuideSpeechBubble
            characterId={characterId}
            greeting={guide.greeting}
            speechText={message}
            orientation="right"
            nonBlocking={true}
            dismissible={showDismiss}
            onDismiss={onClose}
            quickActions={actions}
          />
        </div>
      </aside>
    );
  }

  // Vertical Card Layout (e.g. for sidebar banners or spotlights)
  if (orientation === 'vertical') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-white border border-stone-200/80 p-5 shadow-warm text-center flex flex-col items-center ${
          popIn ? 'animate-guide-pop-bottom' : ''
        } ${className}`}
      >
        {showDismiss && (
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            aria-label="Dismiss guide"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="my-1">
          <GuideIllustration
            characterId={characterId}
            size={size === 'md' ? 'lg' : size}
            animated={true}
          />
        </div>

        <div className="mt-2 w-full">
          <span
            className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5"
            style={{
              backgroundColor: guide.themeColor.bgLight,
              color: guide.themeColor.primary,
            }}
          >
            {guide.hindiName} • {guide.name}
          </span>
          <h4 className="text-base font-serif font-bold text-stone-900 tracking-tight">
            {displayTitle}
          </h4>
          <p className="text-xs text-stone-500 mb-3">{displayTagline}</p>

          {/* Speech Bubble Card */}
          <div className="relative bg-stone-50/90 rounded-xl p-3 border border-stone-200/60 mb-4 text-left">
            <p className="text-xs text-stone-700 leading-relaxed font-sans italic">
              "{message}"
            </p>
          </div>

          {actions.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              {actions.map((act, i) => (
                <button
                  key={i}
                  onClick={act.onClick}
                  className={`w-full inline-flex items-center justify-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition active:scale-95 ${
                    act.primary
                      ? 'text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                  style={act.primary ? { backgroundColor: guide.themeColor.primary } : {}}
                >
                  {act.icon}
                  <span>{act.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default Horizontal Banner / Spotlight Layout
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-white via-white to-stone-50/80 border border-stone-200/80 p-5 sm:p-6 shadow-warm flex flex-col sm:flex-row items-center sm:items-start gap-5 ${
        popIn ? (popDirection === 'left' ? 'animate-guide-pop-left' : 'animate-guide-pop-right') : ''
      } ${className}`}
    >
      {showDismiss && (
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          aria-label="Dismiss guide"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Full-Body Character Display */}
      <div className="shrink-0 flex justify-center">
        <GuideIllustration
          characterId={characterId}
          size={size}
          animated={true}
          interactive={true}
        />
      </div>

      {/* Speech & Action Section */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
            style={{
              backgroundColor: guide.themeColor.bgLight,
              color: guide.themeColor.primary,
            }}
          >
            {guide.hindiName} • {guide.name}
          </span>
          <span className="text-xs text-stone-500 font-medium">{displayTagline}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 tracking-tight mb-2">
          {displayTitle}
        </h3>

        {/* Speech Bubble */}
        <div className="relative bg-stone-50/90 rounded-2xl p-4 border border-stone-200/70 mb-4 inline-block text-left">
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
            "{message}"
          </p>
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            {actions.map((act, i) => (
              <button
                key={i}
                onClick={act.onClick}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition active:scale-95 ${
                  act.primary
                    ? 'text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
                style={act.primary ? { backgroundColor: guide.themeColor.primary } : {}}
              >
                {act.icon}
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
