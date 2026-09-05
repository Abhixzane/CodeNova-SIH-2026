import React, { useState } from 'react';
import { Sparkles, Send, ArrowRight, MessageSquareQuote, Compass } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface AskYatraVerseSectionProps {
  onOpenAIChat?: (prompt?: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  selectedCity?: string;
}

export const AskYatraVerseSection: React.FC<AskYatraVerseSectionProps> = ({
  onOpenAIChat,
  onNavigateTab,
  selectedCity = 'All India',
}) => {
  const [customPrompt, setCustomPrompt] = useState('');

  // Context-aware suggested prompts as requested in prompt
  const city = selectedCity && selectedCity !== 'All India' ? selectedCity : 'Mumbai';
  const suggestedPrompts = [
    'I want a peaceful weekend',
    'Show me Mughal heritage',
    `Best food experiences in ${city}`,
    selectedCity.toLowerCase().includes('jaipur') ? 'Plan 3 days in Jaipur' : 'Plan 3 days in Jaipur',
  ];

  const handlePromptClick = (prompt: string) => {
    if (onOpenAIChat) {
      onOpenAIChat(prompt);
    } else {
      onNavigateTab('ai');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = customPrompt.trim() || `What are the best places to explore in ${selectedCity}?`;
    if (onOpenAIChat) {
      onOpenAIChat(text);
    } else {
      onNavigateTab('ai');
    }
  };

  return (
    <section className="pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FAF8F5] via-amber-50/40 to-stone-50 border border-[#EFE8DF] shadow-warm p-6 sm:p-10">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-200/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* AI Concierge Badge */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shadow-xs">
              <Compass className="w-6 h-6 text-amber-700 animate-spin-slow" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>AI Cultural Concierge</span>
            </div>
          </div>

          {/* Headings as strictly requested in prompt */}
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Not sure where to go?
            </h2>
            <p className="text-xs sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
              Tell YatraVerse what kind of experience you're looking for.
            </p>
          </div>

          {/* Simple AI Input Form */}
          <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={`Ask Yatri anything about ${selectedCity === 'All India' ? 'India' : selectedCity}...`}
                className="w-full pl-4 pr-36 py-3.5 sm:py-4 rounded-2xl bg-white border border-stone-200 text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xs transition"
              />

              {/* Primary CTA: "Ask YatraVerse" */}
              <button
                type="submit"
                className="absolute right-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5 active:scale-98"
              >
                <span>Ask YatraVerse</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Suggested Prompts Chips */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Try asking:
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-stone-200/80 hover:border-amber-300 text-stone-700 hover:text-amber-950 text-xs font-medium transition shadow-2xs flex items-center gap-1.5"
                >
                  <MessageSquareQuote className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>"{prompt}"</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-stone-500 pt-1">
            Active Context: <strong className="text-stone-800">{selectedCity}</strong> • Grounded in verified ASI archives & railway timetables
          </div>
        </div>
      </div>
    </section>
  );
};
