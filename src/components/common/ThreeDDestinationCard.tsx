import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, MapPin, Sparkles, Compass } from 'lucide-react';

interface ThreeDDestinationCardProps {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  tagline?: string;
  onClick: () => void;
  className?: string;
  featured?: boolean;
  culturalMotif?: 'lotus' | 'mandala' | 'arch' | 'fort';
}

export const ThreeDDestinationCard: React.FC<ThreeDDestinationCardProps> = ({
  id,
  title,
  subtitle,
  badge,
  imageUrl,
  tagline,
  onClick,
  className = '',
  featured = false,
  culturalMotif = 'lotus',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate normalized position between -1 and 1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Subtle, professional tilt angles (max 7 degrees)
    setRotation({
      x: -normY * 6.5,
      y: normX * 6.5,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`perspective-1000 group cursor-pointer select-none ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Explore ${title}, ${subtitle}`}
    >
      <div
        className={`relative w-full rounded-3xl overflow-hidden bg-white border border-[#EFE8DF] transition-all duration-300 preserve-3d ${
          isHovered ? 'shadow-3d-card-hover' : 'shadow-3d-card'
        } ${featured ? 'min-h-[380px]' : 'min-h-[320px]'}`}
        style={{
          transform: !reducedMotion
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(${isHovered ? '-6px' : '0px'})`
            : undefined,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Layer 1: Parallax Background Image */}
        <div className="absolute inset-0 overflow-hidden bg-stone-100">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out filter saturate-95 group-hover:saturate-105 group-hover:scale-108"
            style={{
              transform: !reducedMotion
                ? `scale(${isHovered ? 1.08 : 1.02}) translate3d(${rotation.y * 1.2}px, ${-rotation.x * 1.2}px, 0)`
                : undefined,
            }}
          />

          {/* Layer 2: Editorial Dual-Gradient Light Mask for Pristine Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/65 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Layer 3: Floating Cultural Motif & Depth Accents */}
        <div
          className="absolute top-4 right-4 z-10 transition-transform duration-500 ease-out"
          style={{
            transform: !reducedMotion ? 'translateZ(35px)' : undefined,
          }}
        >
          {badge ? (
            <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-amber-300/80 text-[11px] font-bold text-amber-900 shadow-warm flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>{badge}</span>
            </span>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#EFE8DF] flex items-center justify-center text-amber-800 shadow-2xs">
              <Compass className="w-4 h-4 text-amber-700" />
            </div>
          )}
        </div>

        {/* Layer 4: Floating Foreground Content with translateZ for real optical depth */}
        <div
          className="relative z-10 p-6 sm:p-7 flex flex-col justify-end h-full min-h-[320px] transition-transform duration-300"
          style={{
            transform: !reducedMotion ? 'translateZ(25px)' : undefined,
          }}
        >
          {/* Subtitle / Region pin */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5 drop-shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>{subtitle}</span>
          </div>

          {/* Destination Title */}
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-tight group-hover:text-amber-950 transition-colors">
            {title}
          </h3>

          {/* Tagline / Curated Summary */}
          {tagline && (
            <p className="text-xs sm:text-sm text-stone-700 mt-2 line-clamp-2 leading-relaxed font-normal">
              {tagline}
            </p>
          )}

          {/* Explore Action Button */}
          <div className="mt-5 pt-3 border-t border-stone-200/70 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 group-hover:text-amber-950 flex items-center gap-2">
              <span>Explore Destination</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-amber-800">
                <ArrowRight className="w-4 h-4" />
              </span>
            </span>
            <span className="text-[10px] font-semibold text-stone-500 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#EFE8DF]">
              3D & Audio Tour
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
