import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

interface BrandSplashScreenProps {
  onFinished?: () => void;
  minDurationMs?: number;
  forceShow?: boolean;
}

const SPLASH_STORAGE_KEY = 'yatraverse_splash_session_seen';

export const BrandSplashScreen: React.FC<BrandSplashScreenProps> = ({
  onFinished,
  minDurationMs = 2400,
  forceShow = false,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (forceShow) return true;
    try {
      if (typeof window !== 'undefined' && window.location.search.includes('splash')) {
        return true;
      }
      // Show on first visit in this browser session
      const alreadySeen = sessionStorage.getItem(SPLASH_STORAGE_KEY);
      return !alreadySeen;
    } catch {
      return true;
    }
  });

  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    if (!isVisible) {
      if (onFinished) onFinished();
      return;
    }

    // Set session storage key so page/tab navigation does not replay it
    try {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, 'true');
    } catch {
      // Local/session storage disabled or unavailable
    }

    // Timer for initial display
    const exitTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, minDurationMs);

    // Timer for complete unmount after smooth fade/scale transition (500ms)
    const unmountTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinished) onFinished();
    }, minDurationMs + 500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [isVisible, minDurationMs, onFinished]);

  const handleDismissEarly = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onFinished) onFinished();
    }, 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="yatraverse-brand-splash"
      role="status"
      aria-label="Welcome to YatraVerse"
      onClick={handleDismissEarly}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5] overflow-hidden select-none cursor-default transition-all duration-500 ease-out ${
        isFadingOut
          ? 'opacity-0 scale-[1.02] pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Indian Tourism Ambient Geometry */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        {/* Subtle radial warmth */}
        <div className="w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-tr from-amber-200/20 via-emerald-100/30 to-amber-100/10 blur-3xl" />
        
        {/* Subtle heritage decorative rings */}
        <svg
          className="absolute w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] text-stone-400/20 pointer-events-none"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 4" />
          <circle cx="100" cy="100" r="48" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg w-full">
        {/* YatraVerse Logo Emblem with Warm Golden Shine */}
        <div className="relative mb-5 sm:mb-6">
          {/* Subtle warm golden ambient backdrop glow */}
          <div className="absolute -inset-2 sm:-inset-3 rounded-3xl bg-amber-400/20 blur-xl transition-opacity" />

          {/* Logo Card Container */}
          <div
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-xl shadow-emerald-800/20 border border-emerald-500/40 overflow-hidden"
            aria-hidden="true"
          >
            {/* The Authentic YatraVerse Compass Emblem */}
            <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-white stroke-[1.8] drop-shadow-xs" />

            {/* Subtle inner gold rim */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-amber-300/30 pointer-events-none" />

            {/* Sophisticated Animated Golden Shine Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl">
              <div className="shine-beam absolute top-0 left-0 w-[65%] h-[220%] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Yatra<span className="text-emerald-600">Verse</span>
          </h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 tracking-wider uppercase">
            SIH 2026
          </span>
        </div>

        {/* Required Primary Slogan */}
        <p className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight mt-1 mb-1">
          Discover India. Experience Its Stories.
        </p>

        {/* Required Supporting Line */}
        <p className="text-xs sm:text-sm font-medium text-slate-500 tracking-wider uppercase text-center mb-7">
          Heritage • Culture • Journeys • Experiences
        </p>

        {/* Small, Elegant Loading Indicator */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div
            className="w-32 sm:w-36 h-1 bg-stone-200/80 rounded-full overflow-hidden relative shadow-inner"
            aria-hidden="true"
          >
            <div className="splash-progress-bar h-full rounded-full bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600" />
          </div>
          <span className="text-[11px] text-stone-400 font-medium tracking-wide">
            Preparing your travel experience...
          </span>
        </div>
      </div>

      {/* Screen reader only announcement */}
      <span className="sr-only">
        YatraVerse: Discover India. Experience Its Stories. Loading platform.
      </span>

      {/* Subtle Skip control in bottom right corner */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDismissEarly();
          }}
          className="text-xs text-stone-400 hover:text-stone-600 px-2.5 py-1 rounded-md bg-stone-100/80 hover:bg-stone-200/80 transition font-medium"
        >
          Skip
        </button>
      </div>
    </div>
  );
};
