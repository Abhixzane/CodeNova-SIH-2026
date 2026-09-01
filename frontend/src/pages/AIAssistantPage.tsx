import React from 'react';
import { AdvancedAIAssistant } from '../components/ai/AdvancedAIAssistant';
import { Sparkles, Bot, Shield } from 'lucide-react';

interface AIAssistantPageProps {
  onSelectPlace?: (placeId: string) => void;
  onView3DPlace?: (placeId: string) => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  onSelectPlace,
  onView3DPlace,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Grounded Conversational Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-['Plus_Jakarta_Sans']">
          Personal AI Tourism Assistant
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-light">
          Ask questions about Indian destinations, transit hubs, railway connections, fares, and customized itineraries.
        </p>
      </div>

      <AdvancedAIAssistant
        onSelectPlace={onSelectPlace}
        onView3DPlace={onView3DPlace}
      />
    </div>
  );
};
