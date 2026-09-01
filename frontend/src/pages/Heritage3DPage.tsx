import React, { useState } from 'react';
import { PlaceSummary } from '../types';
import { GatewayOfIndia3D } from '../components/threed/GatewayOfIndia3D';
import { VideoExperienceModal } from '../components/threed/VideoExperienceModal';
import { Box, Sparkles, Play, Shield, Compass, Navigation } from 'lucide-react';

interface Heritage3DPageProps {
  places: PlaceSummary[];
  onSelectPlace?: (placeId: string) => void;
  onNavigateToPlace?: (placeId: string) => void;
}

export const Heritage3DPage: React.FC<Heritage3DPageProps> = ({
  places,
  onSelectPlace,
  onNavigateToPlace,
}) => {
  const [selectedPlaceId, setSelectedPlaceId] = useState('gateway-of-india');
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const placesWith3D = places.filter((p) => p.features && p.features['3d']);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold border border-emerald-500/20">
          <Box className="w-3.5 h-3.5" />
          <span>Immersive WebGL Heritage Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-['Plus_Jakarta_Sans']">
          3D Heritage Explorer & Navigation
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-light max-w-2xl">
          Interact with 3D digital twins of monumental Indian landmarks with real-time lighting simulation, architectural inspection hotspots, and turn-by-turn navigation handoff.
        </p>
      </div>

      {/* Main 3D Canvas */}
      <GatewayOfIndia3D
        onPlanVisit={() => onNavigateToPlace && onNavigateToPlace('gateway-of-india')}
        height="h-[600px]"
      />

      {/* Other 3D Landmarks Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-charcoal font-['Plus_Jakarta_Sans']">
            Available 3D Heritage Experiences
          </h2>
          <span className="text-xs text-charcoal-light">
            {placesWith3D.length} Models & Scans Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl heritage-border heritage-shadow bg-parchment-50 border border-sage bg-parchment-50/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal">Gateway of India</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta text-slate-950">
                Active in 3D
              </span>
            </div>
            <p className="text-[11px] text-charcoal-light">
              Interactive basalt arch, dome, and Apollo Bunder sea promenade.
            </p>
            <button
              onClick={() => setSelectedPlaceId('gateway-of-india')}
              className="w-full py-1.5 rounded-xl bg-terracotta/15 text-terracotta text-xs font-bold border border-emerald-500/30"
            >
              Inspecting 3D Canvas
            </button>
          </div>

          <div className="p-4 rounded-2xl heritage-border heritage-shadow bg-parchment-50 border border-parchment-300 bg-parchment-50/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal">CSMT Victorian Gothic</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                3D Video Scan
              </span>
            </div>
            <p className="text-[11px] text-charcoal-light">
              High-resolution 4K drone flythrough and Gothic gargoyle inspection.
            </p>
            <button
              onClick={() => setVideoModalOpen(true)}
              className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-charcoal text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-terracotta fill-emerald-400" />
              <span>Watch 3D Experience</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl heritage-border heritage-shadow bg-parchment-50 border border-parchment-300 bg-parchment-50/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal">Elephanta Cave 1</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                3D Video Scan
              </span>
            </div>
            <p className="text-[11px] text-charcoal-light">
              Sadashiva Trimurti rock-cut relief and monolithic pillars.
            </p>
            <button
              onClick={() => setVideoModalOpen(true)}
              className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-charcoal text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-terracotta fill-emerald-400" />
              <span>Watch 3D Experience</span>
            </button>
          </div>
        </div>
      </div>

      <VideoExperienceModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        placeName="Chhatrapati Shivaji Maharaj Terminus (CSMT)"
      />
    </div>
  );
};
