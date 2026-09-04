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
  selectedCity = 'All India',
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'assistant',
      content: `Namaste! I am your AI Heritage & Travel Specialist for India. How can I assist your journey today? Ask me about historical architecture, optimal train transfers, visiting hours, or custom daily plans.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQueries = [
    `Best 1-day heritage circuit in ${selectedCity === 'All India' ? 'Delhi' : selectedCity}?`,
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
        history: messages.slice(-10),
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
    <div className="flex flex-col h-[650px] rounded-2xl bg-white border border-stone-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <span>YatraVerse AI Heritage Concierge</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                {selectedCity}
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Grounded in archaeological history, Indian Railways lines, and local tariffs
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/40">
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
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-white border border-stone-200 text-emerald-700 shadow-xs'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white shadow-xs font-medium'
                  : 'bg-white border border-stone-200 text-stone-800 shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs text-stone-500 shadow-xs">
              Analyzing routes, tariffs, and heritage archives...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries */}
      <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-stone-500 font-semibold whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" /> Prompts:
        </span>
        {quickQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] px-3 py-1 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 whitespace-nowrap transition shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-stone-200">
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
            placeholder={`Ask anything about exploring ${selectedCity === 'All India' ? 'India' : selectedCity}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
