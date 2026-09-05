import React, { useEffect } from 'react';
import { GuideCharacterId, GUIDE_CHARACTERS } from './CulturalGuideTypes';
import { GuideIllustration } from './GuideIllustrations';
import { GuideActionItem } from './CulturalGuide';
import { X, Sparkles } from 'lucide-react';

export interface CulturalGuidePopupProps {
  isOpen: boolean;
  onClose: () => void;
  characterId: GuideCharacterId;
  title?: string;
  subtitle?: string;
  message: string;
  culturalFact?: string;
  actions?: GuideActionItem[];
}

export const CulturalGuidePopup: React.FC<CulturalGuidePopupProps> = ({
  isOpen,
  onClose,
  characterId,
  title,
  subtitle,
  message,
  culturalFact,
  actions = [],
}) => {
  const guide = GUIDE_CHARACTERS[characterId] || GUIDE_CHARACTERS.yatri;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden p-6 sm:p-8 animate-speech-bubble-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition z-10"
          aria-label="Close guide recommendation"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content grid */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Full-Body Character */}
          <div className="shrink-0 flex justify-center -mb-4 sm:mb-0">
            <GuideIllustration
              characterId={characterId}
              size="lg"
              animated={true}
              interactive={true}
              popIn={true}
              popDirection="left"
            />
          </div>

          {/* Guide Message & Actions */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-white"
                style={{ backgroundColor: guide.themeColor.primary }}
              >
                {guide.hindiName} • {guide.name}
              </span>
              <span className="text-xs text-stone-500 font-medium">{subtitle || guide.role}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight mb-2">
              {title || `Insights from Guide ${guide.name}`}
            </h3>

            <div className="relative bg-stone-50 rounded-2xl p-4 border border-stone-200/70 mb-4 text-left">
              <p className="text-sm text-stone-700 leading-relaxed font-sans">
                "{message}"
              </p>

              {culturalFact && (
                <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-900 leading-normal font-sans">
                    <strong className="font-semibold">Cultural Note:</strong> {culturalFact}
                  </p>
                </div>
              )}
            </div>

            {actions.length > 0 && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                {actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      act.onClick();
                      onClose();
                    }}
                    className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition active:scale-95 ${
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
      </div>
    </div>
  );
};
