import React from 'react';
import { Bot } from 'lucide-react';
import { AdvancedAIAssistant } from '../components/ai/AdvancedAIAssistant';

interface AIAssistantPageProps {
  onSelectPlace: (id: string) => void;
  selectedCity: string;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  onSelectPlace,
  selectedCity,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fadeIn space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold">
          <Bot className="w-3.5 h-3.5" />
          <span>Gemini-Powered Heritage Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-charcoal">AI Travel Assistant</h1>
        <p className="text-xs text-charcoal-light">
          Ask conversational questions about Indian heritage, logistics, photography permissions, and optimal routes.
        </p>
      </div>

      <AdvancedAIAssistant onSelectPlace={onSelectPlace} selectedCity={selectedCity} />
    </div>
  );
};
