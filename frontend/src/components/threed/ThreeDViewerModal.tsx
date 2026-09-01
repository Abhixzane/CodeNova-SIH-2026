import React from 'react';
import { GatewayOfIndia3D } from './GatewayOfIndia3D';
import { X, Box, Sparkles, Navigation } from 'lucide-react';

interface ThreeDViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName?: string;
  placeId?: string;
  onNavigateToPlace?: () => void;
}

export const ThreeDViewerModal: React.FC<ThreeDViewerModalProps> = ({
  isOpen,
  onClose,
  placeName = 'Gateway of India, Mumbai',
  placeId,
  onNavigateToPlace,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl heritage-border heritage-shadow bg-parchment-50 rounded-3xl border border-parchment-300 bg-parchment/98 overflow-hidden shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-parchment-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 border border-emerald-500/30 flex items-center justify-center text-terracotta">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans']">
                3D Heritage Explorer: {placeName}
              </h3>
              <p className="text-xs text-charcoal-light">
                Interactive real-time WebGL architectural simulation
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

        {/* 3D Canvas */}
        <div className="p-4">
          <GatewayOfIndia3D
            onPlanVisit={onNavigateToPlace}
            height="h-[520px]"
          />
        </div>
      </div>
    </div>
  );
};
