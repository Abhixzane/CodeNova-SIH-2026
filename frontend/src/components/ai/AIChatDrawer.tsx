import React from 'react';
import { AdvancedAIAssistant } from './AdvancedAIAssistant';
import { X, Sparkles } from 'lucide-react';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlaceId?: string;
  initialPlaceName?: string;
  initialMessage?: string;
  onSelectPlace?: (placeId: string) => void;
  onView3DPlace?: (placeId: string) => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  initialPlaceId,
  initialPlaceName,
  initialMessage,
  onSelectPlace,
  onView3DPlace,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn flex justify-end">
      <div className="relative w-full max-w-lg bg-parchment border-l border-parchment-300 h-full flex flex-col shadow-2xl">
        <div className="p-3 border-b border-parchment-300 flex items-center justify-between bg-parchment-50">
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal">
            <Sparkles className="w-4 h-4 text-terracotta" />
            <span>BharatYatra AI Travel Assistant</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-parchment-100 border border-parchment-300 text-charcoal-light hover:text-charcoal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <AdvancedAIAssistant
            initialPlaceId={initialPlaceId}
            initialPlaceName={initialPlaceName}
            initialMessage={initialMessage}
            onSelectPlace={(id) => {
              onClose();
              if (onSelectPlace) onSelectPlace(id);
            }}
            onView3DPlace={(id) => {
              onClose();
              if (onView3DPlace) onView3DPlace(id);
            }}
          />
        </div>
      </div>
    </div>
  );
};
