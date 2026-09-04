import React from 'react';
import { X, Sparkles, Box, Info } from 'lucide-react';
import { GatewayOfIndia3D } from './GatewayOfIndia3D';

interface ThreeDViewerModalProps {
  placeName: string;
  onClose: () => void;
}

export const ThreeDViewerModal: React.FC<ThreeDViewerModalProps> = ({
  placeName,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 border border-parchment-300 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-parchment-300">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal">{placeName}</h3>
              <p className="text-[11px] text-charcoal-light">3D WebGL Architectural Exploration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-light hover:text-charcoal hover:bg-slate-900 border border-transparent hover:border-parchment-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <GatewayOfIndia3D placeName={placeName} />

        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-parchment-300/60 flex items-start gap-3 text-xs text-charcoal-light">
          <Info className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Rotate with mouse or touch. Toggle wireframe to inspect architectural polyhedra and structural arch proportions.
          </p>
        </div>
      </div>
    </div>
  );
};
