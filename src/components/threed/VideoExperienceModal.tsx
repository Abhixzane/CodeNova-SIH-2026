import React from 'react';
import { X, Play, Video, ExternalLink, Sparkles } from 'lucide-react';

interface VideoExperienceModalProps {
  placeName: string;
  onClose: () => void;
  videoUrl?: string;
}

export const VideoExperienceModal: React.FC<VideoExperienceModalProps> = ({
  placeName,
  onClose,
  videoUrl,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-950 border border-parchment-300 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-parchment-300">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal">{placeName}</h3>
              <p className="text-[11px] text-charcoal-light">Virtual Walkthrough & Documentary Video</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-light hover:text-charcoal hover:bg-slate-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex flex-col items-center justify-center border border-parchment-300 p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/40">
            <Play className="w-8 h-8 ml-1" />
          </div>
          <div className="max-w-md">
            <h4 className="text-sm font-bold text-charcoal">{placeName} Cinematic Walkthrough</h4>
            <p className="text-xs text-charcoal-light mt-1">
              Immerse yourself in authentic archival photography, architectural commentary, and aerial views of {placeName}.
            </p>
          </div>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(placeName + ' heritage virtual walk')}&tbm=vid`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-charcoal text-xs font-bold transition shadow-md shadow-orange-500/20"
          >
            <span>Watch Virtual Video Tour on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
