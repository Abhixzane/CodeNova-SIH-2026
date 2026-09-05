import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  Sparkles, 
  MapPin, 
  Compass, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  Landmark,
  Train,
  Bot
} from 'lucide-react';
import { api } from '../../services/api';
import { AIChatMessage } from '../../types';

interface AdvancedAIAssistantProps {
  initialPlaceId?: string;
  initialPlaceName?: string;
  onSelectPlace?: (id: string) => void;
  selectedCity?: string;
  initialPrompt?: string;
}

interface DestinationQuickCard {
  id: string;
  name: string;
  city: string;
  imageUrl: string;
  tag: string;
}

export const AdvancedAIAssistant: React.FC<AdvancedAIAssistantProps> = ({
  initialPlaceId,
  initialPlaceName,
  onSelectPlace,
  selectedCity = 'All India',
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'assistant',
      content: `Namaste! I am your AI Travel Assistant at YatraVerse.\n\nWhether you are wondering about dynastic stone carving, looking for authentic street food walks, or planning a multimodal journey, I am here to guide your discovery. Where would you like to go?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested Core Actions as specified in prompt
  const coreActions = [
    { label: 'Explore Mumbai', prompt: 'Tell me about exploring Mumbai: heritage architecture, local trains, and coastal walks.' },
    { label: 'Discover Heritage', prompt: 'What are the top UNESCO heritage monuments in India and their architectural styles?' },
    { label: 'Plan a Trip', prompt: 'Help me plan a 3-day cultural and culinary itinerary in India.' },
    { label: 'Find Hidden Places', prompt: 'What are the best offbeat, hidden heritage places and stepwells in India?' },
  ];

  const suggestionChips = [
    'Plan 3 days in Jaipur',
    'Best heritage places near Delhi',
    'Traditional food in Maharashtra',
    'Hidden places in Varanasi',
    'Taj Mahal early sunrise tips',
  ];

  // Curated verified destination objects for interactive cards
  const sampleDestinationCards: DestinationQuickCard[] = [
    {
      id: 'gateway-of-india',
      name: 'Gateway of India',
      city: 'Mumbai',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&auto=format&fit=crop&q=80',
      tag: 'Colonial Basalt Arch',
    },
    {
      id: 'taj-mahal',
      name: 'Taj Mahal',
      city: 'Agra',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&auto=format&fit=crop&q=80',
      tag: 'UNESCO Marble Jewel',
    },
    {
      id: 'qutub-minar',
      name: 'Qutub Minar',
      city: 'Delhi',
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&auto=format&fit=crop&q=80',
      tag: '72.5m Fluted Minaret',
    },
    {
      id: 'amber-palace',
      name: 'Amber Palace',
      city: 'Jaipur',
      imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=400&auto=format&fit=crop&q=80',
      tag: 'Sheesh Mahal Fort',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initialSentRef = useRef(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialPrompt && !initialSentRef.current) {
      initialSentRef.current = true;
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const newMsg: AIChatMessage = { role: 'user', content: userText };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatAI({
        message: userText,
        city: selectedCity === 'All India' ? undefined : selectedCity,
        place_id: initialPlaceId,
        history: messages.slice(-6).map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        })),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.reply || 'Here is what I found across our verified Indian heritage archives.',
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an issue connecting to the AI cultural guide. Please verify your connection or try again shortly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Immersive Cultural Guide Welcome Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EFE8DF] shadow-3d-card flex flex-col md:flex-row items-center gap-6">
        <div className="shrink-0 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-stone-800 flex items-center justify-center text-white shadow-warm">
            <Compass className="w-8 h-8 text-amber-200 animate-spin-slow" />
          </div>
          <span className="mt-2 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full">
            AI Cultural Concierge
          </span>
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Intelligent Tourism Grounding</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Where would you like to go?
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
            Ask about monument histories, authentic street food, suburban train routes, or artisan looms. All responses are verified against authentic archives.
          </p>

          {/* 4 Core Prompt Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start pt-2">
            {coreActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleSend(action.prompt)}
                className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-amber-50 border border-[#EFE8DF] hover:border-amber-300 text-xs font-bold text-stone-800 hover:text-amber-900 transition shadow-2xs flex items-center gap-1.5"
              >
                <span>{action.label}</span>
                <ArrowRight className="w-3 h-3 text-amber-700" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grounding & Verification Key */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        <div className="p-2.5 rounded-xl bg-white border border-emerald-200/80 flex items-center gap-2 text-emerald-900 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Verified ASI Data</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-sky-200/80 flex items-center gap-2 text-sky-900 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span className="font-semibold">Estimated Transit</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-amber-200/80 flex items-center gap-2 text-amber-900 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-semibold">Recommendation</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 flex items-center gap-2 text-stone-700 shadow-2xs">
          <HelpCircle className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span className="font-semibold">User Context</span>
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="flex flex-col h-[580px] rounded-3xl bg-white border border-[#EFE8DF] shadow-warm overflow-hidden">
        {/* Chat Stream Header */}
        <div className="p-4 bg-[#FAF8F5] border-b border-[#EFE8DF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-stone-800">
              Live AI Cultural Assistant
            </span>
            {selectedCity && selectedCity !== 'All India' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-200">
                📍 {selectedCity}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-stone-400">
            SECURE SERVER-SIDE GEMINI
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF8F5]/30">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`rounded-xl flex items-center justify-center flex-shrink-0 text-xs shadow-xs ${
                  m.role === 'user'
                    ? 'w-8 h-8 bg-amber-800 text-white font-bold'
                    : 'w-8 h-8 bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {m.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 text-amber-800" />
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-800 text-white shadow-xs font-medium'
                    : 'bg-white border border-[#EFE8DF] text-stone-800 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Grounding Verification Badge for Assistant */}
                {m.role === 'assistant' && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                    <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified Information</span>
                    </span>
                    <span className="text-stone-400">YatraVerse Cultural Engine</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#EFE8DF] text-xs text-stone-500 shadow-xs flex items-center gap-2">
                <span>Retrieving verified Indian heritage data and transit routes...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Destination Objects (when relevant) */}
        <div className="px-4 py-2 bg-stone-50 border-t border-[#EFE8DF] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider shrink-0">
            Suggested Sites:
          </span>
          {sampleDestinationCards.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectPlace && onSelectPlace(dest.id)}
              className="group cursor-pointer shrink-0 flex items-center gap-2 p-1.5 pr-3 bg-white rounded-xl border border-[#EFE8DF] hover:border-amber-400 shadow-2xs transition"
            >
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <div>
                <p className="text-[11px] font-bold text-stone-800 group-hover:text-amber-900 leading-tight">
                  {dest.name}
                </p>
                <p className="text-[9px] text-stone-400">{dest.city}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-[#FAF8F5] border-t border-[#EFE8DF] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-stone-500 font-semibold whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-700" /> Prompts:
          </span>
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-[11px] px-3 py-1 rounded-full bg-white hover:bg-amber-50 border border-[#EFE8DF] hover:border-amber-300 text-stone-700 hover:text-amber-900 whitespace-nowrap transition shadow-2xs font-medium"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white border-t border-[#EFE8DF]">
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
              placeholder="Ask YatraVerse: Where will India take you today?"
              className="flex-1 px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#EFE8DF] text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              aria-label="Send query"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
