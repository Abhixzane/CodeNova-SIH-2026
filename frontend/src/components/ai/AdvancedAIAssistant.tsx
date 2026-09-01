import React, { useState, useEffect, useRef } from 'react';
import { 
  AIChatResponse, 
  AISuggestedPlace, 
  UserPreferences, 
  RouteOption,
  RailwayStationInfo
} from '../../types';
import { api } from '../../services/api';
import { getNearbyStationsForPlace } from '../../services/railwayStations';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  MapPin, 
  Route, 
  Navigation, 
  Box, 
  IndianRupee, 
  Train, 
  CheckCircle2, 
  ExternalLink,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  suggestedPlaces?: AISuggestedPlace[];
  suggestedRoutes?: RouteOption[];
  recommendedStations?: RailwayStationInfo[];
  whyReasons?: string[];
  mapsUrl?: string;
  timestamp: string;
}

interface AdvancedAIAssistantProps {
  initialPlaceId?: string;
  initialPlaceName?: string;
  initialMessage?: string;
  onSelectPlace?: (placeId: string) => void;
  onView3DPlace?: (placeId: string) => void;
  onGenerateItinerary?: (params: any) => void;
}

export const AdvancedAIAssistant: React.FC<AdvancedAIAssistantProps> = ({
  initialPlaceId,
  initialPlaceName,
  initialMessage,
  onSelectPlace,
  onView3DPlace,
  onGenerateItinerary,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('bharat-session-' + Date.now());
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  
  // User Session Preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    interests: ['heritage', 'coastal'],
    budget: 'budget',
    transport: 'mixed',
    pace: 'moderate',
    available_hours: 5,
    current_location: 'CSMT, Mumbai',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Initial greeting matching requirements
  useEffect(() => {
    if (messages.length === 0) {
      if (initialMessage) {
        handleSendMessage(initialMessage);
      } else {
        const welcomeText = initialPlaceName
          ? `Hi! I'm your BharatYatra travel assistant ??\n\nI'm ready to help you explore **${initialPlaceName}**, calculate multi-modal routes, find nearby railway stations, or build a personalized itinerary. How can I help you today?`
          : `Hi! I'm your BharatYatra travel assistant ??\n\nHow are you today? What would you like to explore? I can suggest heritage landmarks, optimize your trip budget, or build a custom Mumbai tour.`;

        setMessages([
          {
            id: 'msg-welcome',
            sender: 'assistant',
            text: welcomeText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }
  }, [initialPlaceId, initialPlaceName]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const resp: AIChatResponse = await api.chatAI({
        message: query,
        conversation_id: conversationId,
        place_id: initialPlaceId,
        city: 'Mumbai',
        preferences: preferences,
      });

      // Augment response with railway station knowledge and explainability reasons
      let stations: RailwayStationInfo[] = [];
      let whyReasons: string[] = [];

      if (resp.suggested_places && resp.suggested_places.length > 0) {
        const topPlaceId = resp.suggested_places[0].id;
        stations = getNearbyStationsForPlace(topPlaceId);
        whyReasons = [
          `Matches your interest in ${preferences.interests.join(' & ')}`,
          `Easily accessible from ${preferences.current_location || 'South Mumbai transit hub'}`,
          `Fits your ${preferences.available_hours || 5}-hour tour budget`,
          topPlaceId === 'gateway-of-india' ? 'Includes interactive 3D Heritage Experience' : 'Top rated cultural landmark in Mumbai',
        ];
      }

      const assistantMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'assistant',
        text: resp.reply,
        suggestedPlaces: resp.suggested_places,
        recommendedStations: stations.slice(0, 2),
        whyReasons: whyReasons.length > 0 ? whyReasons : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          text: `I'm having a little trouble connecting to the network right now, but you can explore Mumbai's top destinations like Gateway of India, Marine Drive, and CSMT directly in the catalog!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'I am near CSMT, have ?500 and 5 hours. What should I visit?',
    'What are the best heritage places in Mumbai?',
    'How do I reach Gateway of India from Churchgate?',
    'Show me railway stations near Marine Drive',
  ];

  return (
    <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl border border-parchment-300 bg-parchment-50/95 shadow-2xl flex flex-col h-[700px] overflow-hidden">
      {/* Assistant Header */}
      <div className="p-4 sm:p-5 border-b border-parchment-300 flex items-center justify-between bg-parchment/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-terracotta/15 border border-emerald-500/30 flex items-center justify-center text-terracotta shadow-md shadow-emerald-500/10">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans']">
                BharatYatra Travel Assistant
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-[11px] text-charcoal-light">
              Grounded multi-turn intelligence ? Factual tourism memory
            </p>
          </div>
        </div>

        {/* Preferences Toggle */}
        <button
          onClick={() => setPreferencesOpen(!preferencesOpen)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            preferencesOpen
              ? 'bg-terracotta text-slate-950 border-emerald-400'
              : 'bg-parchment-100 text-charcoal-light border-parchment-300 hover:text-charcoal'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Preferences</span>
        </button>
      </div>

      {/* Preferences Panel Dropdown */}
      {preferencesOpen && (
        <div className="p-4 border-b border-parchment-300 bg-slate-950/90 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between font-bold text-charcoal-light">
            <span>Trip Preferences & Context:</span>
            <span className="text-[11px] text-terracotta font-mono">Saved in Session</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Budget</span>
              <select
                value={preferences.budget}
                onChange={(e) => setPreferences({ ...preferences, budget: e.target.value as any })}
                className="w-full bg-parchment-100 border border-parchment-300 rounded-lg px-2 py-1.5 text-charcoal"
              >
                <option value="budget">Budget (?500)</option>
                <option value="moderate">Moderate (?1,500)</option>
                <option value="premium">Premium (?3,000+)</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Available Time</span>
              <select
                value={preferences.available_hours}
                onChange={(e) => setPreferences({ ...preferences, available_hours: Number(e.target.value) })}
                className="w-full bg-parchment-100 border border-parchment-300 rounded-lg px-2 py-1.5 text-charcoal"
              >
                <option value={3}>3 Hours (Express)</option>
                <option value={5}>5 Hours (Half Day)</option>
                <option value={8}>8 Hours (Full Day)</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Transport</span>
              <select
                value={preferences.transport}
                onChange={(e) => setPreferences({ ...preferences, transport: e.target.value as any })}
                className="w-full bg-parchment-100 border border-parchment-300 rounded-lg px-2 py-1.5 text-charcoal"
              >
                <option value="train">Train / Suburban</option>
                <option value="taxi">Taxi / Cab</option>
                <option value="mixed">Mixed (Train + Taxi)</option>
                <option value="walking">Walking</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-terracotta text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-terracotta border border-parchment-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble & Cards */}
            <div
              className={`space-y-3 max-w-[85%] sm:max-w-[75%] ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Text Bubble */}
              <div
                className={`p-4 rounded-3xl text-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-terracotta text-slate-950 font-medium rounded-tr-none shadow-md shadow-emerald-500/15'
                    : 'bg-parchment-100/90 text-charcoal border border-parchment-300 rounded-tl-none shadow-lg'
                }`}
              >
                {msg.text}
              </div>

              {/* Explainable Recommendations Card ("Why we recommended this") */}
              {msg.whyReasons && msg.whyReasons.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-parchment border border-parchment-300 text-[11px] text-charcoal-light space-y-1.5 shadow-md">
                  <div className="font-bold text-terracotta flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Why we recommended this for you:</span>
                  </div>
                  <div className="space-y-1 pl-1">
                    {msg.whyReasons.map((reason, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-1.5 text-charcoal-light">
                        <span className="text-terracotta">?</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Places Cards */}
              {msg.suggestedPlaces && msg.suggestedPlaces.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-light block">
                    Recommended Destinations:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {msg.suggestedPlaces.map((place) => (
                      <div
                        key={place.id}
                        className="p-3 rounded-2xl bg-parchment-100 border border-parchment-300 hover:border-sage transition-all flex flex-col justify-between space-y-2"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-charcoal truncate">
                              {place.name}
                            </h4>
                            <span className="text-[10px] font-semibold text-terracotta uppercase">
                              {place.category}
                            </span>
                          </div>
                          <span className="text-[10px] text-charcoal-light">
                            ?? {place.city}, Maharashtra
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          {onSelectPlace && (
                            <button
                              onClick={() => onSelectPlace(place.id)}
                              className="flex-1 py-1 px-2 rounded-lg bg-terracotta/15 hover:bg-terracotta text-terracotta hover:text-slate-950 text-[11px] font-bold transition-colors text-center"
                            >
                              Explore
                            </button>
                          )}
                          {place.id === 'gateway-of-india' && onView3DPlace && (
                            <button
                              onClick={() => onView3DPlace(place.id)}
                              className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-charcoal-light text-[11px] font-bold transition-colors flex items-center gap-1"
                            >
                              <Box className="w-3 h-3 text-terracotta" />
                              <span>3D</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Nearby Railway Stations */}
              {msg.recommendedStations && msg.recommendedStations.length > 0 && (
                <div className="p-3 rounded-2xl bg-parchment border border-cyan-500/20 text-[11px] space-y-2">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Train className="w-3.5 h-3.5" />
                    <span>Nearby Railway Connections:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.recommendedStations.map((st) => (
                      <div key={st.id} className="p-2 rounded-xl bg-parchment-100 border border-parchment-300">
                        <div className="font-bold text-charcoal text-xs">{st.name}</div>
                        <div className="text-[10px] text-charcoal-light">{st.line} ? {st.distance_km} km away</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span className="text-[10px] text-slate-500 block px-1">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-terracotta border border-parchment-300 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-3xl bg-parchment-100 border border-parchment-300 text-xs text-charcoal-light flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Thinking and grounding response with verified tourism data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Action Area */}
      <div className="p-4 border-t border-parchment-300 bg-parchment/90 space-y-3">
        {/* Quick prompt suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-full bg-parchment-100 hover:bg-slate-800 text-charcoal-light hover:text-terracotta text-[11px] font-medium whitespace-nowrap border border-parchment-300 transition-colors flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about Mumbai, heritage, routes, fares, or itineraries..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            className="w-full bg-slate-950 border border-parchment-300 rounded-2xl px-4 py-3 text-xs text-charcoal placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-12 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="absolute right-2 p-2 rounded-xl bg-terracotta hover:bg-terracotta-dark disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4 text-slate-950" />
          </button>
        </form>
      </div>
    </div>
  );
};
