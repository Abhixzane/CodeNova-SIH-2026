import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

interface AIChatWidgetProps {
  onClick: () => void;
  isOpen: boolean;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-terracotta hover:bg-emerald-400 text-slate-950 shadow-2xl shadow-emerald-500/40 transition-all duration-300 hover:scale-110 flex items-center gap-2 group font-bold font-['Plus_Jakarta_Sans'] border-2 border-white/20"
      title="Open BharatYatra AI Assistant"
    >
      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform text-slate-950" />
      <span className="hidden sm:inline text-xs font-black tracking-wide">
        AI Assistant
      </span>
      <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
    </button>
  );
};
