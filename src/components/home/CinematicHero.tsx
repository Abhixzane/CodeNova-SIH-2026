import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, MapPin, ArrowRight, Compass, Landmark, Train, Eye } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface CinematicHeroProps {
  onSearch: (query: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectPlace?: (placeId: string) => void;
  onSelectCity?: (city: string) => void;
  selectedCity?: string;
  onOpenAIChat?: (prompt?: string) => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onSearch,
  onNavigateTab,
  onSelectPlace,
  onSelectCity,
  selectedCity = 'All India',
  onOpenAIChat,
}) => {
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    setOffset({ x: x * 16, y: y * 12 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  // Curated, verified destination chips respecting the active city context
  const getCityQuickPicks = () => {
    const city = selectedCity.toLowerCase();
    if (city.includes('mumbai')) {
      return [
        { label: 'Gateway of India', id: 'gateway-of-india', tab: 'dashboard' as NavTab },
        { label: 'Elephanta Caves', id: 'elephanta-caves', tab: 'heritage' as NavTab },
        { label: 'Marine Drive', id: 'marine-drive', tab: 'dashboard' as NavTab },
        { label: 'CSMT Victorian Terminus', id: 'csmt', tab: 'heritage' as NavTab },
      ];
    }
    if (city.includes('delhi')) {
      return [
        { label: 'Qutub Minar', id: 'qutub-minar', tab: 'heritage' as NavTab },
        { label: 'Humayun’s Tomb', id: 'humayuns-tomb', tab: 'heritage' as NavTab },
        { label: 'Red Fort', id: 'red-fort', tab: 'heritage' as NavTab },
        { label: 'India Gate', id: 'india-gate', tab: 'dashboard' as NavTab },
      ];
    }
    if (city.includes('jaipur')) {
      return [
        { label: 'Amber Palace', id: 'amber-palace', tab: 'heritage' as NavTab },
        { label: 'Hawa Mahal', id: 'hawa-mahal', tab: 'heritage' as NavTab },
        { label: 'Jantar Mantar', id: 'jantar-mantar', tab: 'heritage' as NavTab },
        { label: 'City Palace', id: 'city-palace-jaipur', tab: 'dashboard' as NavTab },
      ];
    }
    if (city.includes('agra')) {
      return [
        { label: 'Taj Mahal', id: 'taj-mahal', tab: 'heritage' as NavTab },
        { label: 'Agra Fort', id: 'agra-fort', tab: 'heritage' as NavTab },
        { label: 'Fatehpur Sikri', id: 'fatehpur-sikri', tab: 'heritage' as NavTab },
      ];
    }
    if (city.includes('varanasi')) {
      return [
        { label: 'Kashi Vishwanath', id: 'kashi-vishwanath', tab: 'heritage' as NavTab },
        { label: 'Dashashwamedh Ghat', id: 'dashashwamedh-ghat', tab: 'dashboard' as NavTab },
        { label: 'Sarnath Lion Capital', id: 'sarnath', tab: 'heritage' as NavTab },
      ];
    }
    return [
      { label: 'Taj Mahal', id: 'taj-mahal', tab: 'heritage' as NavTab },
      { label: 'Gateway of India', id: 'gateway-of-india', tab: 'dashboard' as NavTab },
      { label: 'Amber Palace', id: 'amber-palace', tab: 'heritage' as NavTab },
      { label: 'Qutub Minar', id: 'qutub-minar', tab: 'heritage' as NavTab },
      { label: 'Meenakshi Temple', id: 'meenakshi-temple', tab: 'heritage' as NavTab },
    ];
  };

  const quickPicks = getCityQuickPicks();

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFFDF9] to-[#F5EFE6] border border-[#EFE8DF] shadow-3d-card p-6 sm:p-10 lg:p-12 transition-all"
    >
      {/* Subtle Background Layer: Topographical Contour Watermark */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#92400e_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* LEFT COLUMN: Narrative, Headline, Search & Context */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Context Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EFE8DF] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
            <span className="text-xs font-semibold text-stone-700">
              {selectedCity === 'All India' ? 'Pan-India Cultural Discovery' : `Exploring ${selectedCity}`}
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-[11px] text-amber-900 font-bold">YatraVerse 3D</span>
          </div>

          {/* Core Headline Required by Prompt */}
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.12]">
              Where will India take you today?
            </h1>
            <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed font-normal">
              Discover heritage, culture, hidden places and unforgettable journeys across verified monuments, multimodal transit lines, and dynastic architecture.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl group">
            <div className="flex items-center rounded-2xl bg-white border border-[#EFE8DF] group-focus-within:border-amber-700 group-focus-within:ring-2 group-focus-within:ring-amber-700/20 shadow-warm transition-all p-1.5">
              <div className="pl-3.5 pr-2 text-stone-400 group-focus-within:text-amber-800 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search monuments, stepwells, railway lines, dishes or cities..."
                className="w-full py-2.5 px-2 text-xs sm:text-sm text-stone-900 placeholder-stone-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0 active:scale-98"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick-Pick Trending Monument Chips */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Curated Destinations in {selectedCity}:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {quickPicks.map((pick) => (
                <button
                  key={pick.id}
                  onClick={() => {
                    if (onSelectPlace) onSelectPlace(pick.id);
                    else onNavigateTab(pick.tab);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-amber-50 border border-[#EFE8DF] hover:border-amber-300 text-stone-700 hover:text-amber-900 transition shadow-2xs flex items-center gap-1.5 active:scale-95"
                >
                  <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
                  <span>{pick.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Mode Launchers */}
          <div className="flex items-center gap-3 pt-2 flex-wrap text-xs font-semibold">
            <button
              onClick={() => onNavigateTab('heritage')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition active:scale-98"
            >
              <Landmark className="w-3.5 h-3.5 text-amber-700" />
              <span>3D Heritage Explorer</span>
            </button>

            <button
              onClick={() => onNavigateTab(selectedCity.toLowerCase().includes('mumbai') ? 'mumbai-local' : 'routes')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition active:scale-98"
            >
              <Train className="w-3.5 h-3.5 text-stone-700" />
              <span>Transit & Routes</span>
            </button>

            <button
              onClick={() => {
                if (onOpenAIChat) onOpenAIChat();
                else onNavigateTab('ai');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 border border-[#EFE8DF] transition active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>AI Trip Planner</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D / 2.5D Layered Indian Monument Showcase */}
        <div className="lg:col-span-5 relative flex justify-center items-center select-none">
          <div
            onClick={() => onNavigateTab('heritage')}
            className="cursor-pointer relative w-full max-w-sm sm:max-w-md rounded-3xl bg-gradient-to-t from-stone-900 via-stone-850 to-stone-900 border border-[#EFE8DF] p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-3d-card group text-white"
          >
            {/* Layer 1: Background Monument Photography with Parallax Depth */}
            <div
              className="absolute inset-0 bg-cover bg-center filter saturate-90 scale-105 group-hover:scale-110 transition-transform duration-700 ease-out pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80')`,
                transform: !reducedMotion
                  ? `scale(1.08) translate3d(${offset.x * -0.6}px, ${offset.y * -0.6}px, 0)`
                  : undefined,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-900/40" />

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white border border-white/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>3D Interactive Architecture</span>
              </span>
              <span className="text-[10px] font-mono text-amber-300 font-bold bg-stone-900/80 px-2 py-0.5 rounded-md">
                UNESCO #252
              </span>
            </div>

            {/* Middle Spatial Depth Elements */}
            <div className="relative z-10 py-12 text-center">
              <div
                className="inline-block p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg group-hover:scale-105 transition-transform"
                style={{
                  transform: !reducedMotion
                    ? `translate3d(${offset.x * 0.8}px, ${offset.y * 0.8}px, 0)`
                    : undefined,
                }}
              >
                <Landmark className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-xs font-bold text-white mt-1">Explore Monuments in 3D</p>
                <p className="text-[10px] text-stone-300">WebGL Orbit & Dynastic Models</p>
              </div>
            </div>

            {/* Bottom Info Dossier */}
            <div className="relative z-10 p-4 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-white">
                  Taj Mahal & Mughal Corridors
                </h3>
                <span className="text-xs font-mono text-stone-400">Agra, UP</span>
              </div>
              <p className="text-[11px] text-stone-300 line-clamp-1">
                Makrana marble symmetry & riverside Mughal gardens
              </p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-amber-400 font-semibold border-t border-white/10">
                <span className="flex items-center gap-1">
                  <Compass className="w-3 h-3 animate-spin-slow" />
                  <span>27.1751° N, 78.0421° E</span>
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-white">
                  <span>Open 3D Model</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
