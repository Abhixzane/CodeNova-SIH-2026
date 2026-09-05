import React, { useState, useEffect, useRef } from 'react';
import { GuideCharacterId, GUIDE_CHARACTERS } from './CulturalGuideTypes';
import { GuideIllustration } from './GuideIllustrations';
import { NavTab } from '../layout/Sidebar';
import {
  SpeechBubbleLifecycleState,
  SPEECH_BUBBLE_LIFECYCLE_CONFIG,
  getSpeechBubbleAnimationClass,
} from './animations';
import {
  Sparkles,
  ArrowRight,
  X,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Info,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export type SpeechBubbleOrientation = 'top' | 'bottom' | 'left' | 'right' | 'none';
export type BubbleContextMode =
  | 'heritage'
  | 'transit'
  | 'handloom'
  | 'stepwells'
  | 'sustainability'
  | 'food'
  | 'general'
  | 'city';

export interface GuideQuickAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  primary?: boolean;
}

export interface GuideSpeechBubbleProps {
  characterId: GuideCharacterId;
  greeting?: string;
  speechText?: string;
  contextTag?: string;
  contextMode?: BubbleContextMode;
  cityContext?: string;
  selectedCity?: string;
  activeTab?: NavTab;
  quickActions?: GuideQuickAction[];
  onDismiss?: () => void;
  dismissible?: boolean;
  orientation?: SpeechBubbleOrientation;
  className?: string;
  compact?: boolean;
  nonBlocking?: boolean;
  autoDismissMs?: number;
  showAvatarPreview?: boolean;
  allowAudioRead?: boolean;
  initialMinimized?: boolean;
  ariaLive?: 'polite' | 'assertive' | 'off';
  idleAnimation?: boolean;
}

/**
 * Context-aware speech generator mapping combinations of selectedCity, activeTab,
 * and character persona to authentic, culturally grounded travel guidance.
 */
export function getContextualSpeech(
  characterId: GuideCharacterId,
  selectedCity?: string,
  activeTab?: NavTab,
  customGreeting?: string,
  customText?: string,
  customTag?: string,
  contextMode?: BubbleContextMode
): { greeting: string; text: string; tag: string } {
  const guide = GUIDE_CHARACTERS[characterId] || GUIDE_CHARACTERS.yatri;
  const defaultGreeting = customGreeting || guide.greeting;

  // Explicit speechText takes highest priority
  if (customText) {
    return {
      greeting: defaultGreeting,
      text: customText,
      tag: customTag || guide.role.split('.')[0],
    };
  }

  const city = selectedCity && selectedCity !== 'All India' ? selectedCity : null;

  // 1. Heritage & 3D Architectural Sanctuary Tab
  if (activeTab === 'heritage' || activeTab === '3d' || contextMode === 'heritage') {
    if (city === 'Jaipur') {
      return {
        greeting: defaultGreeting,
        text: 'In Jaipur, Virasat recommends examining the astronomical stone instruments of Jantar Mantar and the Rajput-Mughal courtyards of Amer Fort.',
        tag: customTag || 'Jaipur UNESCO Circuit',
      };
    }
    if (city === 'Mumbai') {
      return {
        greeting: defaultGreeting,
        text: 'In Mumbai, Virasat highlights the Victorian Gothic and Art Deco Ensembles alongside the 5th-century rock-cut Shiva caves on Elephanta Island.',
        tag: customTag || 'Mumbai Heritage Ensembles',
      };
    }
    if (city === 'Delhi') {
      return {
        greeting: defaultGreeting,
        text: 'In Delhi, explore 800 years of dynastic masonry at Qutub Minar, Humayun’s symmetrical garden tomb, and the red sandstone ramparts of Lal Qila.',
        tag: customTag || 'Delhi Sultanate & Mughal Sites',
      };
    }
    if (city === 'Agra') {
      return {
        greeting: defaultGreeting,
        text: 'In Agra, admire the Pietra Dura marble inlay of the Taj Mahal and the royal red sandstone palace pavilions of Fatehpur Sikri.',
        tag: customTag || 'Mughal Imperial Architecture',
      };
    }
    if (city === 'Varanasi') {
      return {
        greeting: defaultGreeting,
        text: 'Along Varanasi’s ancient waterfront, Virasat traces centuries-old ghat architecture, riverside havelis, and sacred temple shikharas.',
        tag: customTag || 'Kashi Heritage Waterfront',
      };
    }
    if (city === 'Kochi') {
      return {
        greeting: defaultGreeting,
        text: 'In Kochi, discover the blend of Portuguese, Dutch, and traditional Kerala woodwork at Mattancherry Palace and Fort Kochi.',
        tag: customTag || 'Malabar Colonial Architecture',
      };
    }
    if (city === 'Goa') {
      return {
        greeting: defaultGreeting,
        text: 'In Old Goa, Virasat points out the Manueline and Baroque laterite stone facades of the Basilica of Bom Jesus and Se Cathedral.',
        tag: customTag || 'Goa Baroque Sanctuaries',
      };
    }
    if (city === 'Bengaluru') {
      return {
        greeting: defaultGreeting,
        text: 'In Bengaluru, explore the Tudor-style Bengaluru Palace and the 18th-century carved teakwood summer palace of Tipu Sultan.',
        tag: customTag || 'Deccan & Mysore Architecture',
      };
    }
    if (city) {
      return {
        greeting: defaultGreeting,
        text: `In ${city}, Virasat highlights living heritage sanctuaries, dynastic stone carvings, and protected archaeological monuments.`,
        tag: customTag || `${city} Heritage Secrets`,
      };
    }
    return {
      greeting: defaultGreeting,
      text: "Virasat curates India's 45 UNESCO World Heritage sites, from ancient rock-cut Ajanta-Ellora caves to towering Dravidian temple vimanas.",
      tag: customTag || '45 UNESCO World Heritage Sites',
    };
  }

  // 2. Multimodal Transit & Railway Routes Tab
  if (activeTab === 'routes' || activeTab === 'mumbai-local' || contextMode === 'transit') {
    if (city === 'Mumbai' || activeTab === 'mumbai-local') {
      return {
        greeting: defaultGreeting,
        text: 'Safar tracks Western, Central, and Harbour suburban lines—check peak hour fast vs slow services and verified auto-rickshaw meter zones.',
        tag: customTag || 'Mumbai Suburban Rail & Metro',
      };
    }
    if (city === 'Delhi') {
      return {
        greeting: defaultGreeting,
        text: 'Safar recommends using the Delhi Metro Airport Express and interchange junctions like Kashmere Gate and Rajiv Chowk for quick monument hops.',
        tag: customTag || 'Delhi Metro Corridors',
      };
    }
    if (city === 'Jaipur') {
      return {
        greeting: defaultGreeting,
        text: 'Inside Jaipur’s walled pink city gates, Safar maps verified e-rickshaw corridors and metro access to navigate market bazaars comfortably.',
        tag: customTag || 'Pink City Transit',
      };
    }
    if (city === 'Kochi') {
      return {
        greeting: defaultGreeting,
        text: 'In Kochi, board the innovative Kochi Water Metro electric ferries connecting backwater islands directly to mainland transit terminals.',
        tag: customTag || 'Kochi Water Metro Transit',
      };
    }
    if (city) {
      return {
        greeting: defaultGreeting,
        text: `Navigating ${city}? Safar has compiled verified railway timetables, express transit links, and verified prepaid taxi counters.`,
        tag: customTag || `${city} Smart Transit`,
      };
    }
    return {
      greeting: defaultGreeting,
      text: 'Safar tracks verified Indian Railway routes, suburban trains, and multimodal connections to help you travel comfortably and on time.',
      tag: customTag || 'Multimodal Transit Specialist',
    };
  }

  // 3. Culture, Handlooms & Artisans Tab
  if (activeTab === 'culture-artisans' || contextMode === 'handloom' || contextMode === 'food') {
    if (city === 'Jaipur') {
      return {
        greeting: defaultGreeting,
        text: 'Rasika invites you to explore Sanganeri hand-block print studios, authentic blue pottery kilns, and Johari Bazaar silversmiths.',
        tag: customTag || 'Jaipur GI Crafts & Bazaars',
      };
    }
    if (city === 'Varanasi') {
      return {
        greeting: defaultGreeting,
        text: 'Rasika highlights master weavers crafting GI-tagged Banarasi Katan silk brocades and savoring authentic malaiyo and kachori-jalebi.',
        tag: customTag || 'Banarasi Silk Guilds & Flavors',
      };
    }
    if (city === 'Mumbai') {
      return {
        greeting: defaultGreeting,
        text: 'Taste authentic coastal Malvani seafood, classic Irani chai cafes, and discover Worli Koliwada fisherfolk cultural heritage with Rasika.',
        tag: customTag || 'Mumbai Culinary & Folk Art',
      };
    }
    if (city === 'Delhi') {
      return {
        greeting: defaultGreeting,
        text: 'Sample Chandni Chowk’s historic street food lanes and discover traditional zardozi embroidery and attar perfumers with Rasika.',
        tag: customTag || 'Old Delhi Culinary & Crafts',
      };
    }
    if (city === 'Kochi') {
      return {
        greeting: defaultGreeting,
        text: 'Discover Kerala Kasavu gold-bordered handlooms, Kathakali face-mask woodcarving, and fragrant Malabar spice trading heritage.',
        tag: customTag || 'Kerala Handlooms & Spices',
      };
    }
    if (city === 'Agra') {
      return {
        greeting: defaultGreeting,
        text: 'In Agra, visit 17th-generation Pietra Dura marble inlay master artisans and taste authentic saffron petha sweet confection.',
        tag: customTag || 'Agra Inlay & Sweets',
      };
    }
    if (city) {
      return {
        greeting: defaultGreeting,
        text: `Discover ${city}’s authentic GI-certified handlooms, regional craft clusters, and indigenous culinary recipes with Rasika.`,
        tag: customTag || `${city} Culture & Crafts`,
      };
    }
    return {
      greeting: defaultGreeting,
      text: 'Rasika curates GI-certified handloom weaving clusters, generational handicraft guilds, and authentic regional culinary dishes across India.',
      tag: customTag || 'GI Crafts & Regional Culinary',
    };
  }

  // 4. Facilities, Accessibility & Mindful Travel Tab
  if (activeTab === 'facilities-accessibility' || contextMode === 'sustainability') {
    if (city) {
      return {
        greeting: defaultGreeting,
        text: `In ${city}, Prithvi maps wheelchair-accessible monument pathways, verified clean RO drinking water points, and quiet shaded rest stops.`,
        tag: customTag || `${city} Accessible & Mindful Travel`,
      };
    }
    return {
      greeting: defaultGreeting,
      text: 'Prithvi advocates mindful footsteps: carry reusable hydration bottles, support village craft cooperatives directly, and respect sanctum boundaries.',
      tag: customTag || 'Responsible & Accessible Travel',
    };
  }

  // 5. Itinerary Planning & Saved Trips Tab
  if (activeTab === 'itinerary' || activeTab === 'trips') {
    if (city) {
      return {
        greeting: defaultGreeting,
        text: `Pacing your ${city} itinerary? Schedule outdoor monument visits between 6:30–9:00 AM for gentle lighting and serene temperatures.`,
        tag: customTag || `${city} Itinerary Pacing`,
      };
    }
    return {
      greeting: defaultGreeting,
      text: 'Smart itinerary tip: Schedule 2 major heritage complexes per day with cultural tea pauses and midday indoor gallery visits to avoid fatigue.',
      tag: customTag || 'Itinerary Optimization',
    };
  }

  // 6. Interactive GIS Map Tab
  if (activeTab === 'map') {
    if (city) {
      return {
        greeting: defaultGreeting,
        text: `Interactive GIS Map for ${city}: Tap any monument marker to view verified entry fees, dress codes, and nearest transit junctions.`,
        tag: customTag || `${city} Geospatial Guide`,
      };
    }
    return {
      greeting: defaultGreeting,
      text: 'Interactive GIS Map: Pan across 28 states & 8 UTs to inspect UNESCO sites, regional artisan clusters, and suburban rail networks.',
      tag: customTag || 'Geospatial Exploration',
    };
  }

  // 7. AI Assistant Concierge Tab
  if (activeTab === 'ai') {
    if (city) {
      return {
        greeting: defaultGreeting,
        text: `Ask our AI Concierge about hidden photography spots, local festival dates, or custom heritage walking trails in ${city}!`,
        tag: customTag || `${city} AI Concierge`,
      };
    }
    return {
      greeting: defaultGreeting,
      text: 'Ask our AI Concierge about customized cultural itineraries, regional festival calendars, train connectivity, or monument photography rules.',
      tag: customTag || 'AI Cultural Concierge',
    };
  }

  // 8. Bookmarked Favorites Tab
  if (activeTab === 'favorites') {
    return {
      greeting: defaultGreeting,
      text: 'Here are your bookmarked monuments and artisan studios. You can easily sync them with your custom travel itinerary planner.',
      tag: customTag || 'Saved Travel Wishlist',
    };
  }

  // City-specific fallback for home / dashboard / general
  if (city) {
    switch (characterId) {
      case 'virasat':
        return {
          greeting: defaultGreeting,
          text: `In ${city}, dynastic stone-carving traditions and architectural secrets reveal centuries of living history.`,
          tag: customTag || `${city} Heritage`,
        };
      case 'safar':
        return {
          greeting: defaultGreeting,
          text: `Exploring ${city}? I've mapped verified transit interchanges, rail connections, and reliable local transit corridors.`,
          tag: customTag || `${city} Routes`,
        };
      case 'rasika':
        return {
          greeting: defaultGreeting,
          text: `Discover ${city}'s authentic GI-certified handlooms and culinary specialties crafted by generational artisan families.`,
          tag: customTag || `${city} Culture`,
        };
      case 'khoj':
        return {
          greeting: defaultGreeting,
          text: `Found quiet, secluded stepwells and lesser-known historical courtyards tucked away in ${city}.`,
          tag: customTag || `${city} Hidden Gems`,
        };
      case 'prithvi':
        return {
          greeting: defaultGreeting,
          text: `When journeying through ${city}, remember to carry reusable water gear and honor sacred community sanctuaries.`,
          tag: customTag || `${city} Mindful Travel`,
        };
      default:
        return {
          greeting: defaultGreeting,
          text: `Planning your discovery of ${city}? Ask me for the best cultural circuits, sunrise spots, and local tips!`,
          tag: customTag || `${city} Travel Companion`,
        };
    }
  }

  // Context mode fallback
  if (contextMode === 'stepwells') {
    return {
      greeting: defaultGreeting,
      text: 'Ancient baolis (stepwells) were architectural climate refuges cooling communities during dry seasons through geometric stone channels.',
      tag: customTag || 'Baoli Architecture',
    };
  }

  // General fallback
  return {
    greeting: defaultGreeting,
    text: guide.defaultSpeech,
    tag: customTag || guide.title.split('&')[0].trim(),
  };
}

export const GuideSpeechBubble: React.FC<GuideSpeechBubbleProps> = ({
  characterId,
  greeting,
  speechText,
  contextTag,
  contextMode,
  cityContext,
  selectedCity,
  activeTab,
  quickActions = [],
  onDismiss,
  dismissible = true,
  orientation = 'right',
  className = '',
  compact = false,
  nonBlocking = true,
  autoDismissMs,
  showAvatarPreview = false,
  allowAudioRead = true,
  initialMinimized = false,
  ariaLive = 'polite',
  idleAnimation = true,
}) => {
  const guide = GUIDE_CHARACTERS[characterId] || GUIDE_CHARACTERS.yatri;
  const activeCity = selectedCity || cityContext;

  const [isMinimized, setIsMinimized] = useState(initialMinimized);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progressPercent, setProgressPercent] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lifecycle, setLifecycle] = useState<SpeechBubbleLifecycleState>('entering');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derive context-aware speech based on characterId, selectedCity, and activeTab
  const content = getContextualSpeech(
    characterId,
    activeCity,
    activeTab,
    greeting,
    speechText,
    contextTag,
    contextMode
  );

  // Manage speech bubble lifecycle: pop-in entrance, then transition to idle breathing fade
  useEffect(() => {
    setLifecycle('entering');
    const enterTimer = setTimeout(() => {
      setLifecycle('idle');
    }, SPEECH_BUBBLE_LIFECYCLE_CONFIG.enterDurationMs);

    return () => clearTimeout(enterTimer);
  }, [characterId, activeTab, activeCity, speechText]);

  // Graceful exit handler
  const handleDismiss = () => {
    setLifecycle('exiting');
    setTimeout(() => {
      if (onDismiss) {
        onDismiss();
      } else {
        setIsDismissed(true);
      }
    }, SPEECH_BUBBLE_LIFECYCLE_CONFIG.exitDurationMs);
  };

  // Auto-dismiss countdown timer with pause on hover
  useEffect(() => {
    if (!autoDismissMs || isDismissed || isMinimized || isPaused || isHovered) return;

    const startTime = Date.now();
    const endTime = startTime + autoDismissMs;

    intervalRef.current = setInterval(() => {
      const remaining = endTime - Date.now();
      const percent = Math.max(0, (remaining / autoDismissMs) * 100);
      setProgressPercent(percent);

      if (remaining <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        handleDismiss();
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoDismissMs, isDismissed, isMinimized, isPaused, isHovered, onDismiss]);

  // Audio Speech synthesis support
  const handleToggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${content.greeting}. ${content.text}`);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Prefer Indian English voice if available
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(
        (v) =>
          v.lang.includes('en-IN') ||
          v.name.includes('India') ||
          v.name.includes('Hindi') ||
          v.lang.includes('hi-IN')
      );
      if (indianVoice) utterance.voice = indianVoice;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  if (isDismissed || lifecycle === 'hidden') return null;

  // Active animation class based on lifecycle state and interaction
  const activeAnimationClass = getSpeechBubbleAnimationClass(
    isMinimized ? 'minimized' : lifecycle,
    isHovered || isPaused,
    idleAnimation
  );

  // Minimized "Non-blocking Pill" Mode
  if (isMinimized && nonBlocking) {
    return (
      <div
        className={`inline-flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full pl-2 pr-3 py-1.5 shadow-warm border transition-all duration-200 hover:scale-[1.02] cursor-pointer text-stone-800 ${className}`}
        style={{ borderColor: guide.themeColor.border }}
        onClick={() => {
          setIsMinimized(false);
          setLifecycle('entering');
          setTimeout(() => setLifecycle('idle'), SPEECH_BUBBLE_LIFECYCLE_CONFIG.enterDurationMs);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsMinimized(false);
          }
        }}
        aria-label={`Expand tip from ${guide.name}`}
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
          style={{ backgroundColor: guide.themeColor.primary }}
        />
        <span className="text-xs font-bold text-stone-900 font-serif">
          {guide.name}
        </span>
        <span className="text-[11px] text-stone-500 font-medium truncate max-w-[140px] sm:max-w-[200px]">
          "{content.text.substring(0, 32)}..."
        </span>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white shrink-0 ml-1"
          style={{ backgroundColor: guide.themeColor.primary }}
        >
          View Tip
        </span>
      </div>
    );
  }

  // Pointer Tail Arrows depending on orientation
  const renderTail = () => {
    if (orientation === 'none') return null;

    if (orientation === 'right') {
      // Tail points LEFT towards character standing on the left
      return (
        <div
          className="absolute -left-2 top-4 w-3.5 h-3.5 bg-white border-l border-b transform rotate-45 pointer-events-none shadow-2xs"
          style={{ borderColor: guide.themeColor.border }}
        />
      );
    }
    if (orientation === 'left') {
      // Tail points RIGHT towards character standing on the right
      return (
        <div
          className="absolute -right-2 top-4 w-3.5 h-3.5 bg-white border-r border-t transform rotate-45 pointer-events-none shadow-2xs"
          style={{ borderColor: guide.themeColor.border }}
        />
      );
    }
    if (orientation === 'bottom') {
      // Tail points UP towards character standing above
      return (
        <div
          className="absolute -top-2 left-6 w-3.5 h-3.5 bg-white border-l border-t transform rotate-45 pointer-events-none shadow-2xs"
          style={{ borderColor: guide.themeColor.border }}
        />
      );
    }
    if (orientation === 'top') {
      // Tail points DOWN towards character standing below
      return (
        <div
          className="absolute -bottom-2 left-6 w-3.5 h-3.5 bg-white border-r border-b transform rotate-45 pointer-events-none shadow-2xs"
          style={{ borderColor: guide.themeColor.border }}
        />
      );
    }
    return null;
  };

  return (
    <div
      role="region"
      aria-live={ariaLive}
      aria-label={`Guide insight from ${guide.name}`}
      onMouseEnter={() => {
        setIsPaused(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsHovered(false);
      }}
      className={`relative bg-white/95 backdrop-blur-md rounded-2xl border shadow-warm transition-all duration-300 max-w-sm sm:max-w-md ${
        compact ? 'p-3' : 'p-4'
      } ${activeAnimationClass} ${className}`}
      style={{ borderColor: guide.themeColor.border }}
    >
      {renderTail()}

      {/* Header with identity, context badge, audio read, minimize, and dismiss */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-stone-100">
        <div className="flex items-center gap-2 min-w-0">
          {showAvatarPreview && (
            <div className="shrink-0 -my-1">
              <GuideIllustration
                characterId={characterId}
                size="xs"
                interactive={false}
              />
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white shrink-0"
              style={{ backgroundColor: guide.themeColor.primary }}
            >
              {guide.hindiName} • {guide.name}
            </span>

            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 truncate max-w-[140px]"
              style={{
                backgroundColor: guide.themeColor.bgLight,
                color: guide.themeColor.text,
              }}
            >
              {content.tag}
            </span>
          </div>
        </div>

        {/* Action icons: Audio Read, Minimize, Dismiss */}
        <div className="flex items-center gap-1 shrink-0">
          {allowAudioRead && 'speechSynthesis' in window && (
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? 'Stop speaking' : 'Read aloud with guide voice'}
              aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud with guide voice'}
              className={`p-1 rounded-lg transition ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-900 animate-pulse'
                  : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
              }`}
            >
              {isSpeaking ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {nonBlocking && (
            <button
              onClick={() => setIsMinimized(true)}
              title="Minimize to pill to unblock view"
              aria-label="Minimize guide bubble to unblock view"
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          )}

          {dismissible && (
            <button
              onClick={handleDismiss}
              title="Dismiss tip"
              aria-label="Dismiss guide tip"
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Greeting & Speech Content */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xs sm:text-sm font-serif font-bold text-stone-900">
            {content.greeting}
          </span>
          <span className="text-[11px] text-stone-500 font-medium italic">
            — {guide.tagline}
          </span>
        </div>

        <p className="text-xs text-stone-700 leading-relaxed font-sans">
          {content.text}
        </p>
      </div>

      {/* Quick Action Chips */}
      {quickActions.length > 0 && (
        <div
          className={`flex flex-wrap items-center gap-1.5 ${
            compact ? 'mt-2 pt-1.5' : 'mt-3 pt-2.5'
          } border-t border-stone-100`}
        >
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition active:scale-95 shadow-2xs ${
                action.primary
                  ? 'text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
              style={
                action.primary
                  ? { backgroundColor: guide.themeColor.primary }
                  : undefined
              }
            >
              {action.icon || <Sparkles className="w-3 h-3 opacity-80" />}
              <span>{action.label}</span>
              <ArrowRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>
      )}

      {/* Auto-Dismiss Progress Bar (pauses when hovered) */}
      {autoDismissMs && !isDismissed && !isPaused && !isHovered && (
        <div className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-100 ease-linear rounded-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: guide.themeColor.primary,
            }}
          />
        </div>
      )}
    </div>
  );
};
