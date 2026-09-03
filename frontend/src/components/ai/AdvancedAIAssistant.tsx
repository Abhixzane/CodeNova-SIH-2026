import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, MapPin, Compass, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { AIChatMessage } from '../../types';

interface AdvancedAIAssistantProps {
  initialPlaceId?: string;
  initialPlaceName?: string;
  onSelectPlace?: (id: string) => void;
  selectedCity?: string;
}

export const AdvancedAIAssistant: React.FC<AdvancedAIAssistantProps> = ({
  initialPlaceId,
  initialPlaceName,
  onSelectPlace,
  selectedCity = 'Mumbai',
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'assistant',
      content: `Namaste! I am your AI Heritage & Travel Specialist for ${selectedCity} and India. How can I assist your journey today? Ask me about historical architecture, optimal train transfers, visiting hours, or custom daily plans.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQueries = [
    `Best 1-day heritage circuit in ${selectedCity}?`,
    `How to reach from railway station via auto or transit?`,
    `What are the ticket fees and opening hours?`,
    `Hidden architectural details and photography tips?`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const newMsg: AIChatMessage = { role: 'user', content: userText };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendAIChat({
        message: userText,
        city: selectedCity,
        place_id: initialPlaceId,
        place_name: initialPlaceName,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.reply || 'Here is what I found regarding your inquiry.',
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an issue connecting to the AI guide engine. Please verify the connection or try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] rounded-3xl bg-slate-950 border border-parchment-300 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-slate-900 border-b border-parchment-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-1.5">
              <span>BharatYatra AI Heritage Concierge</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-semibold">
                {selectedCity}
              </span>
            </h3>
            <p className="text-[11px] text-charcoal-light">
              Grounded in archaeological history, Indian Railways lines, and local tariffs
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs ${
                m.role === 'user'
                  ? 'bg-orange-500 text-charcoal font-bold'
                  : 'bg-slate-900 border border-parchment-300 text-orange-400'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-charcoal shadow-md'
                  : 'bg-parchment-100/90 border border-parchment-300 text-charcoal shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-parchment-300 text-orange-400 flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-parchment-100/90 border border-parchment-300 text-xs text-charcoal-light">
              Analyzing routes and heritage archives...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-parchment-300/60 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-orange-400" /> Prompts:
        </span>
        {quickQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] px-3 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-parchment-300 text-charcoal-light hover:text-charcoal whitespace-nowrap transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-900 border-t border-parchment-300">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask anything about exploring ${selectedCity}...`}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-parchment-300 text-xs text-charcoal placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-charcoal transition shadow-md shadow-orange-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
