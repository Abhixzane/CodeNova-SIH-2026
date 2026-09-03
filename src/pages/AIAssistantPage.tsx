import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto px-4 py-6 animate-fadeIn space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <Bot className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gemini-Powered Heritage Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">AI Travel Assistant</h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Ask conversational questions about Indian heritage, logistics, photography permissions, railway stations, and optimal routes.
        </p>
      </div>

      <AdvancedAIAssistant onSelectPlace={onSelectPlace} selectedCity={selectedCity} />
    </div>
  );
};
