import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { AdvancedAIAssistant } from '../components/ai/AdvancedAIAssistant';

interface AIAssistantPageProps {
  onSelectPlace: (id: string) => void;
  selectedCity: string;
  initialPrompt?: string;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  onSelectPlace,
  selectedCity,
  initialPrompt,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 animate-fadeIn space-y-6">
      {/* Editorial Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Ask YatraVerse • Cultural Concierge</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Ask YatraVerse
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
          Your intelligent guide to India.
        </p>
      </div>

      <AdvancedAIAssistant
        onSelectPlace={onSelectPlace}
        selectedCity={selectedCity}
        initialPrompt={initialPrompt}
      />
    </div>
  );
};
