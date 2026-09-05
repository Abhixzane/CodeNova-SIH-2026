import React from 'react';
import { Compass, Landmark, Navigation, Heart, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { NavTab } from './Sidebar';

interface SimpleFooterProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectCity?: (city: string) => void;
}

export const SimpleFooter: React.FC<SimpleFooterProps> = ({
  onNavigateTab,
  onSelectCity,
}) => {
  return (
    <footer className="mt-20 border-t border-[#EFE8DF] bg-white text-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigateTab('home')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 flex items-center justify-center text-amber-200 shadow-md">
                <Compass className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                  Yatra<span className="text-amber-700">Verse</span>
                </span>
                <span className="ml-2 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  SIH 2026
                </span>
              </div>
            </button>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm">
              Discover India. Experience its stories. An authentic, human-designed national tourism platform connecting heritage monuments, verified transit, living arts, and intelligent exploration.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] text-xs text-stone-600 italic">
              "वसुधैव कुटुम्बकम् — The World is One Family. Exploring India with reverence for history and sustainable travel."
            </div>
          </div>

          {/* Quick Discover Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Discover
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('home')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Explore India
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Destinations & City Hubs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('heritage')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  45 UNESCO Heritage Sites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('culture-artisans')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Master Crafts & Cuisine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('3d')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  3D WebGL Museum
                </button>
              </li>
            </ul>
          </div>

          {/* Planning & Transit Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Journey Planning
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('itinerary')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Day Circuit Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('routes')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Multimodal Route Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('mumbai-local')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Mumbai Suburban Rail
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('map')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Interactive GIS Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('ai')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Ask YatraVerse AI Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Intelligence & Trust Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Verification & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('facilities-accessibility')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Accessibility & Facilities Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('intelligence')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Tourism Intelligence & Metrics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('reports')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Citizen Condition Reports
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('trips')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Saved Trips & Circuits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('profile')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  My Travel Profile
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Credits */}
        <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © 2026 YatraVerse. Developed for Smart India Hackathon 2026. Archaeological Survey of India & Ministry of Tourism data alignment.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Human-Crafted Indian Tourism Design
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
