import React from 'react';
import { X, Play, Shield, Compass, Sparkles, Navigation } from 'lucide-react';

interface VideoExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName: string;
  videoUrl?: string;
  onNavigateToPlace?: () => void;
}

export const VideoExperienceModal: React.FC<VideoExperienceModalProps> = ({
  isOpen,
  onClose,
  placeName,
  videoUrl,
  onNavigateToPlace,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl heritage-border heritage-shadow bg-parchment-50 rounded-3xl border border-parchment-300 bg-parchment-50/98 overflow-hidden shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-parchment-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 border border-emerald-500/30 flex items-center justify-center text-terracotta">
              <Play className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans']">
                3D Video Experience: {placeName}
              </h3>
              <p className="text-xs text-charcoal-light">
                Immersive 360? virtual heritage inspection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-parchment-100 border border-parchment-300 text-charcoal-light hover:text-charcoal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Canvas / Player Area */}
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Simulated 3D Heritage Video Tour Backdrop */}
          <img
            src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80"
            alt={placeName}
            className="w-full h-full object-cover opacity-70 animate-pulse"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1427] via-transparent to-black/40" />

          {/* Central Play Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-terracotta text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 cursor-pointer hover:scale-110 transition-transform">
              <Play className="w-7 h-7 fill-slate-950 ml-1" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-charcoal">
                3D Heritage Flythrough & Architectural Scan
              </h4>
              <p className="text-xs text-charcoal-light max-w-md">
                Experience high-definition drone photogrammetry and acoustic simulation of {placeName}.
              </p>
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-terracotta/20 text-emerald-300 border border-sage backdrop-blur-md">
              4K Heritage Scan
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-parchment-300 flex items-center justify-between">
          <div className="text-xs text-charcoal-light flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-terracotta" />
            <span>Archaeological Survey of India verified landmark</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-parchment-100 text-charcoal-light hover:text-charcoal text-xs font-semibold border border-parchment-300"
            >
              Close
            </button>
            {onNavigateToPlace && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToPlace();
                }}
                className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-dark text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Route & Travel Info</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
