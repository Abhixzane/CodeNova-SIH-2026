import React from 'react';
import { Compass, Shield, MapPin, Sparkles, Box, Route, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-parchment-300/80 bg-[#060a14] pt-12 pb-8 text-charcoal-light text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-terracotta/15 border border-sage flex items-center justify-center text-terracotta">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 flex items-center justify-center">
                  <div className="w-1 rounded-full bg-parchment" />
                </div>
              </div>
              <span className="font-extrabold text-xl text-charcoal font-['Plus_Jakarta_Sans']">
                Bharat<span className="text-terracotta">Yatra</span>
              </span>
            </div>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Explore India. Experience Heritage. Intelligent digital tourism platform featuring 3D heritage exploration, multi-modal travel intelligence, and grounded AI guidance.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-parchment-100 border border-parchment-300 text-[11px] text-terracotta font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Grounded Tourism Intelligence</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-charcoal font-semibold text-xs uppercase tracking-wider mb-4">
              Explore India
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-terracotta transition-colors">
                  Mumbai Heritage & Coastal Tour
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-terracotta transition-colors">
                  Interactive Geospatial Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('3d')} className="hover:text-terracotta transition-colors">
                  3D Heritage Explorer & Video
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('routes')} className="hover:text-terracotta transition-colors">
                  Route Studio & Fare Estimator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('itinerary')} className="hover:text-terracotta transition-colors">
                  Smart Itinerary Planner
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-charcoal font-semibold text-xs uppercase tracking-wider mb-4">
              Featured Destinations
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-light">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta" /> Gateway of India & CSMT (Mumbai)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta" /> Marine Drive & Worli Sea Face (Mumbai)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta" /> Elephanta & Kanheri Caves (Mumbai)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta" /> Hawa Mahal & Amber Fort (Rajasthan)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta" /> Alleppey Backwaters (Kerala)
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-charcoal font-semibold text-xs uppercase tracking-wider mb-4">
              Platform Architecture
            </h4>
            <p className="text-xs text-charcoal-light leading-relaxed mb-3">
              FastAPI backend service layer with Google Maps Directions handoff and Three.js WebGL rendering.
            </p>
            <div className="p-3 rounded-xl bg-parchment-100/90 border border-parchment-300 text-[11px] text-charcoal-light space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Navigation Handoff:</span>
                <span className="text-terracotta font-mono">Google Maps</span>
              </div>
              <div className="flex items-center justify-between">
                <span>3D Engine:</span>
                <span className="text-cyan-400 font-mono">WebGL Three.js</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Data Freshness:</span>
                <span className="text-amber-400 font-mono">Hybrid Provenance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-parchment-300/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-light">
          <p>? 2026 BharatYatra. Explore India. Experience Heritage.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>FastAPI ? React 18 ? Three.js ? Leaflet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
