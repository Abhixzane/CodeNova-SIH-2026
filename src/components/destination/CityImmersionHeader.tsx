import React, { useState, useRef, useEffect } from 'react';
import { MapPin, CloudSun, Sparkles, Compass, ArrowRight, ShieldCheck, Landmark, Train } from 'lucide-react';
import { CityWeather } from '../../types';
import { GuideIllustration } from '../cultural-guides/GuideIllustrations';

interface CityImmersionHeaderProps {
  cityName: string;
  weather: CityWeather | null;
  cities: string[];
  onSelectCity: (city: string) => void;
  onExploreHeritage?: () => void;
  onExploreTransit?: () => void;
}

interface CityLayerConfig {
  tagline: string;
  subtext: string;
  backdropImage: string;
  accentBadge: string;
  heritageSymbol: string;
  guideQuote: string;
  guideCharacter: 'virasat' | 'safar' | 'rasika' | 'khoj' | 'prithvi';
  dominantPalette: string;
}

export const CityImmersionHeader: React.FC<CityImmersionHeaderProps> = ({
  cityName,
  weather,
  cities,
  onSelectCity,
  onExploreHeritage,
  onExploreTransit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: x * 12, y: y * 8 });
  };

  const getCityConfig = (city: string): CityLayerConfig => {
    const c = city.toLowerCase();
    if (c.includes('mumbai')) {
      return {
        tagline: 'Where heritage meets the rhythm of the city.',
        subtext: 'Victorian Gothic UNESCO landmarks, Arabian Sea coastlines, Art Deco boulevards and the relentless heartbeat of suburban local trains.',
        backdropImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&auto=format&fit=crop&q=85',
        accentBadge: 'Port Metropolis & Gateway',
        heritageSymbol: 'Gateway of India • CSMT Victorian Terminus',
        guideQuote: 'From Churchgate to Elephanta, Mumbai is a city of seven islands bound together by stone and transit.',
        guideCharacter: 'safar',
        dominantPalette: 'from-amber-900/40 via-stone-900/30 to-[#FAF8F5]',
      };
    }
    if (c.includes('jaipur')) {
      return {
        tagline: 'The Pink City of royal citadels and gemstone craft.',
        subtext: 'Pink terracotta facades, astronomical sun dials at Jantar Mantar, hilltop fortress ramparts, and living blue pottery craft guilds.',
        backdropImage: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=1600&auto=format&fit=crop&q=85',
        accentBadge: 'UNESCO Heritage City',
        heritageSymbol: 'Hawa Mahal • Amber Palace • Jantar Mantar',
        guideQuote: 'Notice how the morning sun strikes the Sheesh Mahal mirrors—a single lamp creates a thousand stars.',
        guideCharacter: 'virasat',
        dominantPalette: 'from-rose-900/40 via-stone-900/30 to-[#FAF8F5]',
      };
    }
    if (c.includes('delhi')) {
      return {
        tagline: 'Seven millennia of imperial capitals carved in red sandstone.',
        subtext: 'Sultanate minarets, grand Mughal garden tombs, Nizamuddin sufi shrines, and sprawling Lutyens boulevards.',
        backdropImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&auto=format&fit=crop&q=85',
        accentBadge: 'National Capital Territory',
        heritageSymbol: 'Qutub Minar • Humayun’s Tomb • Red Fort',
        guideQuote: 'Walk through Mehrauli at dawn to feel how layer upon layer of history rests upon this soil.',
        guideCharacter: 'virasat',
        dominantPalette: 'from-red-950/40 via-stone-900/30 to-[#FAF8F5]',
      };
    }
    if (c.includes('agra')) {
      return {
        tagline: 'The Mughal capital of marble symmetry and imperial devotion.',
        subtext: 'Makrana white marble riverside monuments, sprawling red sandstone fort bastions, and Mehtab Bagh reflection gardens.',
        backdropImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=85',
        accentBadge: 'World Wonder Destination',
        heritageSymbol: 'Taj Mahal • Agra Fort • Fatehpur Sikri',
        guideQuote: 'Observe the floral pietra dura inlays—each petal carved from carnelian, jade and lapis lazuli.',
        guideCharacter: 'virasat',
        dominantPalette: 'from-amber-950/40 via-stone-900/30 to-[#FAF8F5]',
      };
    }
    if (c.includes('varanasi')) {
      return {
        tagline: 'The timeless sacred city of Ganga ghats and eternal light.',
        subtext: '84 stone steps meeting the sacred river, ringing temple bells, ancient Banarasi silk handlooms, and timeless evening aartis.',
        backdropImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1600&auto=format&fit=crop&q=85',
        accentBadge: 'Oldest Living City',
        heritageSymbol: 'Kashi Vishwanath • Dashashwamedh • Sarnath',
        guideQuote: 'At sunrise, take a wooden rowing boat from Assi to Manikarnika as the morning ragas drift across the water.',
        guideCharacter: 'rasika',
        dominantPalette: 'from-orange-950/40 via-stone-900/30 to-[#FAF8F5]',
      };
    }
    if (c.includes('kochi')) {
      return {
        tagline: 'Queen of the Arabian Sea, spice quays and colonial enclaves.',
        subtext: 'Centuries-old cantilevered Chinese fishing nets, 16th-century Mattancherry palaces, Paradesi synagogues, and lush backwaters.',
        backdropImage: 'https://images.unsplash.com/photo-1600100397608-f010f443a9e1?w=1600&auto=format&fit=crop&q=85',
        accentBadge: 'Spice Coast & Port',
        heritageSymbol: 'Chinese Fishing Nets • Mattancherry • Fort Kochi',
        guideQuote: 'The fragrance of black pepper, cardamom and ginger still wafts through the ancient warehouse alleys of Jew Town.',
        guideCharacter: 'khoj',
        dominantPalette: 'from-emerald-950/40 via-stone-900/30 to-[#FAF8F5]',
      };
    }
    // Default Pan-India / Regional City
    return {
      tagline: `Discover the architectural, cultural and culinary soul of ${city}.`,
      subtext: 'Verified monuments, authentic artisan craft traditions, local transport connections, and GPS coordinates.',
      backdropImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&auto=format&fit=crop&q=85',
      accentBadge: 'Indian Heritage Hub',
      heritageSymbol: 'State Monuments & Verified Coordinates',
      guideQuote: `Welcome to ${city}! Let's discover its historic quarters and local transit connections together.`,
      guideCharacter: 'virasat',
      dominantPalette: 'from-stone-900/30 via-stone-900/20 to-[#FAF8F5]',
    };
  };

  const config = getCityConfig(cityName);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#EFE8DF] shadow-3d-card transition-all"
    >
      {/* 2.5D Layer 1: Parallax Heritage Landscape Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={config.backdropImage}
          alt={cityName}
          className="w-full h-full object-cover object-center filter saturate-90 scale-105 transition-transform duration-700 ease-out"
          style={{
            transform: !reducedMotion
              ? `scale(1.06) translate3d(${offset.x * -1}px, ${offset.y * -1}px, 0)`
              : undefined,
          }}
        />

        {/* 2.5D Layer 2: Dual Light-Theme Gradient Masks for Pristine Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/92 to-[#FAF8F5]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-[#FAF8F5]/30" />
        <div className="absolute -bottom-10 -right-10 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
      </div>

      {/* City Switcher Bar */}
      <div className="relative z-10 px-6 sm:px-8 pt-6 pb-2 border-b border-stone-200/60 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Explore City:
          </span>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => onSelectCity(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                cityName.toLowerCase() === c.toLowerCase()
                  ? 'bg-amber-800 text-white border-amber-800 shadow-xs scale-102'
                  : 'bg-white/90 text-stone-700 border-stone-200/80 hover:bg-white hover:text-amber-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Weather Tag */}
        {weather && (
          <div className="flex items-center gap-2.5 px-3.5 py-1 rounded-xl bg-white/95 backdrop-blur-sm border border-[#EFE8DF] shadow-2xs text-xs">
            <CloudSun className="w-4 h-4 text-amber-700" />
            <span className="font-mono font-bold text-stone-900">{weather.temperature_c}°C</span>
            <span className="text-stone-600 font-medium">{weather.condition}</span>
          </div>
        )}
      </div>

      {/* Immersion Content */}
      <div className="relative z-10 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: City Title & Poetic Narrative */}
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{config.accentBadge}</span>
          </div>

          <div>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1]">
              {cityName}
            </h1>
            <p className="font-serif text-lg sm:text-2xl text-amber-900 font-medium mt-1 leading-snug">
              "{config.tagline}"
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 max-w-2xl leading-relaxed font-normal">
            {config.subtext}
          </p>

          {/* Quick Hub Navigation Actions */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            {onExploreHeritage && (
              <button
                onClick={onExploreHeritage}
                className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-warm flex items-center gap-1.5 active:scale-98"
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>Explore {cityName} Heritage</span>
              </button>
            )}

            {onExploreTransit && (
              <button
                onClick={onExploreTransit}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <Train className="w-3.5 h-3.5 text-amber-700" />
                <span>Transit & Station Routes</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Cultural Companion Guide Card */}
        <div className="lg:col-span-4">
          <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EFE8DF] shadow-warm space-y-3">
            <div className="flex items-center gap-3">
              <GuideIllustration characterId={config.guideCharacter} size="md" animated={true} />
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  City Cultural Guide
                </span>
                <p className="font-serif text-base font-bold text-stone-900">
                  {config.guideCharacter.toUpperCase()}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 italic leading-relaxed pt-1 border-t border-stone-100">
              "{config.guideQuote}"
            </p>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-700" />
                <span>{config.heritageSymbol}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
