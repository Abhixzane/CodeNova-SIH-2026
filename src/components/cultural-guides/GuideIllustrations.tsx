import React from 'react';
import { GuideCharacterId } from './CulturalGuideTypes';

export interface GuideIllustrationProps {
  characterId: GuideCharacterId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'full';
  className?: string;
  showAura?: boolean;
  animated?: boolean;
  popIn?: boolean;
  popDirection?: 'right' | 'left' | 'bottom';
  interactive?: boolean;
  onClick?: () => void;
}

const SIZE_MAP: Record<string, { width: number; height: number; containerClass: string }> = {
  xs: { width: 32, height: 58, containerClass: 'w-8 h-14' },
  sm: { width: 44, height: 80, containerClass: 'w-11 h-20' },
  md: { width: 68, height: 122, containerClass: 'w-16 h-28 sm:w-20 sm:h-36' },
  lg: { width: 100, height: 180, containerClass: 'w-24 h-44 sm:w-32 sm:h-56' },
  xl: { width: 140, height: 252, containerClass: 'w-36 h-64 sm:w-44 sm:h-80' },
  hero: { width: 180, height: 324, containerClass: 'w-48 h-84 sm:w-56 sm:h-98 md:w-64 md:h-[400px]' },
  full: { width: 200, height: 360, containerClass: 'w-full h-full' },
};

/**
 * Visual Flourish: Indian Architectural / Mandala Aura
 */
const CulturalAura: React.FC<{
  color1: string;
  color2: string;
  accent: string;
  animated?: boolean;
}> = ({ color1, color2, accent, animated = true }) => (
  <g className={animated ? 'animate-guide-aura-rotate' : ''} style={{ transformOrigin: '100px 145px' }}>
    {/* Outer halo disc */}
    <circle cx="100" cy="145" r="86" fill={color1} opacity="0.65" />
    <circle cx="100" cy="145" r="76" stroke={color2} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.75" />
    {/* Mandala Petal Rays */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
      <path
        key={angle}
        d="M100 64 L102 70 L100 74 L98 70 Z"
        fill={accent}
        opacity="0.8"
        transform={`rotate(${angle} 100 145)`}
      />
    ))}
    {/* Inner ring */}
    <circle cx="100" cy="145" r="62" stroke={color2} strokeWidth="0.8" opacity="0.5" />
  </g>
);

/**
 * 1. YATRI — FULL-BODY Main Travel Companion
 * Attire: Terracotta rust kurta with contemporary mandarin collar, golden saffron stole with Indian textile motifs,
 * slim travel churidar/chinos, handcrafted leather travel shoes, cross-body canvas sling bag, brass compass,
 * holding rolled route map, welcoming Namaste greeting gesture.
 */
export const YatriFullBodySVG: React.FC<{ showAura?: boolean; animated?: boolean }> = ({
  showAura = true,
  animated = true,
}) => (
  <svg
    viewBox="0 0 200 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-sm select-none"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Visual Flourish / Indian Mandala Aura */}
    {showAura && <CulturalAura color1="#FEF3C7" color2="#FDE68A" accent="#F59E0B" animated={animated} />}

    {/* Ground Shadow */}
    <ellipse cx="100" cy="346" rx="52" ry="8" fill="#292524" opacity="0.12" />

    {/* Animated Character Body Wrapper */}
    <g className={animated ? 'animate-guide-idle' : ''} style={{ transformOrigin: '100px 340px' }}>
      {/* ---------------- FOOTWEAR (Handcrafted Tan Leather Travel Shoes) ---------------- */}
      {/* Left Shoe */}
      <path
        d="M74 330 C74 326 80 324 88 324 C95 324 99 328 100 334 C100 340 96 344 86 345 C77 345 74 340 74 334 Z"
        fill="#78350F"
      />
      <path d="M74 340 C78 344 88 346 98 343 L99 345 C89 348 77 346 73 342 Z" fill="#FDE68A" />
      {/* Right Shoe */}
      <path
        d="M102 334 C103 328 108 324 116 324 C123 324 129 326 129 330 C129 340 126 345 117 345 C107 344 103 340 102 334 Z"
        fill="#78350F"
      />
      <path d="M103 342 C106 345 116 347 127 344 L128 346 C117 349 105 347 102 344 Z" fill="#FDE68A" />

      {/* ---------------- LEGS & CHURIDAR TROUSERS (Espresso Travel Fit) ---------------- */}
      {/* Left Leg */}
      <path
        d="M78 226 L80 300 C80 310 82 320 84 328 L94 328 C94 320 92 308 92 230 Z"
        fill="#292524"
      />
      {/* Right Leg */}
      <path
        d="M110 230 L110 308 C110 320 108 322 108 328 L119 328 C121 320 123 310 123 226 Z"
        fill="#292524"
      />
      {/* Churidar Crease Accents */}
      <path d="M81 294 C86 298 90 297 93 294" stroke="#44403C" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M82 312 C87 315 90 314 93 312" stroke="#44403C" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M110 296 C114 299 119 298 122 296" stroke="#44403C" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M109 314 C113 317 118 316 120 314" stroke="#44403C" strokeWidth="1.2" strokeLinecap="round" />

      {/* ---------------- UPPER BODY & KURTA (Terracotta Rust Indian Travel Styling) ---------------- */}
      {/* Kurta Lower Skirt / Hem */}
      <path
        d="M68 188 L72 242 C72 248 76 250 82 250 L120 250 C126 250 130 248 130 242 L134 188 Z"
        fill="#B45309"
      />
      {/* Kurta Side Slits & Hem Trim */}
      <path d="M72 246 L130 246" stroke="#F59E0B" strokeWidth="1.8" />
      <path d="M101 190 L101 248" stroke="#9A3412" strokeWidth="1.2" />

      {/* Kurta Torso Main */}
      <path
        d="M66 116 C66 108 72 102 82 100 L120 100 C130 102 136 108 136 116 L134 192 L68 192 Z"
        fill="#B45309"
      />
      {/* Mandarin Collar Placket */}
      <path d="M96 98 L106 98 L105 160 L97 160 Z" fill="#9A3412" />
      <path d="M101 100 L101 158" stroke="#FBBF24" strokeWidth="1" />
      {/* Loop Buttons */}
      <circle cx="101" cy="108" r="1.5" fill="#FBBF24" />
      <circle cx="101" cy="120" r="1.5" fill="#FBBF24" />
      <circle cx="101" cy="132" r="1.5" fill="#FBBF24" />
      <circle cx="101" cy="144" r="1.5" fill="#FBBF24" />

      {/* Cross-Body Canvas Travel Bag Strap */}
      <path d="M124 104 L74 198 L69 195 L119 101 Z" fill="#78350F" opacity="0.9" />
      <circle cx="72" cy="196" r="3.5" fill="#FBBF24" />

      {/* Saffron Angavastram / Travel Stole with Textile Motifs */}
      <path
        d="M74 100 C74 100 84 130 82 192 C80 220 78 240 76 244 C72 244 68 238 68 214 C68 160 70 120 74 100 Z"
        fill="#F59E0B"
      />
      <path d="M72 130 C76 132 80 131 83 130" stroke="#B45309" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M71 160 C75 162 79 161 82 160" stroke="#B45309" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M70 190 C74 192 78 191 81 190" stroke="#B45309" strokeWidth="1" strokeDasharray="2 2" />

      {/* Brass Traveler Sun-Compass on Waist */}
      <circle cx="123" cy="192" r="7" fill="#FBBF24" stroke="#92400E" strokeWidth="1.5" />
      <polygon points="123,188 125,192 123,196 121,192" fill="#B45309" />
      <polygon points="123,188 126,192 123,192" fill="#DC2626" />

      {/* ---------------- LEFT ARM & ROLLED ROUTE MAP ---------------- */}
      {/* Left Shoulder & Sleeve */}
      <path d="M132 108 L148 148 L138 154 L126 122 Z" fill="#B45309" />
      {/* Left Forearm */}
      <path d="M144 148 L152 186 L143 189 L136 153 Z" fill="#DF9E76" />
      {/* Left Hand Holding Map */}
      <circle cx="151" cy="192" r="6" fill="#DF9E76" />
      {/* Rolled Journey Map Scroll with Wax Seal */}
      <rect x="144" y="174" width="14" height="36" rx="3" fill="#FFFDF7" stroke="#D97706" strokeWidth="1.2" />
      <line x1="147" y1="184" x2="155" y2="184" stroke="#B45309" strokeWidth="1" />
      <line x1="147" y1="194" x2="155" y2="194" stroke="#B45309" strokeWidth="1" />
      <circle cx="151" cy="189" r="2.5" fill="#DC2626" />

      {/* ---------------- RIGHT ARM & WELCOMING GESTURE (Namaste / Wave) ---------------- */}
      <g className={animated ? 'animate-guide-hand' : ''} style={{ transformOrigin: '70px 112px' }}>
        {/* Right Shoulder & Sleeve */}
        <path d="M70 108 L52 136 L60 144 L76 120 Z" fill="#B45309" />
        {/* Right Forearm raised welcomingly */}
        <path d="M54 138 L44 100 L53 96 L62 134 Z" fill="#DF9E76" />
        {/* Welcoming Hand (Open palm greeting) */}
        <path
          d="M44 98 C42 92 45 84 48 82 C51 81 54 84 55 88 C56 84 59 84 60 88 C61 85 64 86 64 90 C65 88 67 89 67 93 C66 100 59 104 53 104 Z"
          fill="#DF9E76"
          stroke="#B45309"
          strokeWidth="0.8"
        />
      </g>

      {/* ---------------- HEAD, FACE & GROOMING ---------------- */}
      {/* Neck */}
      <path d="M94 76 L108 76 L108 100 L94 100 Z" fill="#DF9E76" />
      <path d="M94 92 C94 92 98 102 101 102 C104 102 108 92 108 92 Z" fill="#D2885E" />

      {/* Head Ellipse */}
      <ellipse cx="101" cy="62" rx="19" ry="22" fill="#DF9E76" />
      {/* Ears */}
      <circle cx="82" cy="63" r="3.8" fill="#D2885E" />
      <circle cx="120" cy="63" r="3.8" fill="#D2885E" />

      {/* Hair (Contemporary Indian Travel Styling, Natural Textured Wave) */}
      <path
        d="M81 58 C80 43 90 32 101 32 C112 32 122 43 121 58 C119 46 113 41 101 41 C89 41 83 46 81 58 Z"
        fill="#262220"
      />
      <path
        d="M81 52 C81 52 87 45 99 45 C111 45 120 48 120 50 C120 38 111 35 101 35 C91 35 81 40 81 52 Z"
        fill="#1C1917"
      />

      {/* Expressive Almond Eyes & Catchlights */}
      <ellipse cx="94" cy="60" rx="2.5" ry="3" fill="#1C1917" />
      <circle cx="95" cy="59" r="0.9" fill="#FFFFFF" />
      <ellipse cx="108" cy="60" rx="2.5" ry="3" fill="#1C1917" />
      <circle cx="109" cy="59" r="0.9" fill="#FFFFFF" />

      {/* Warm Eyebrows */}
      <path d="M90 54 C93 52 97 53 99 55" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M103 55 C105 53 109 52 112 54" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />

      {/* Nose */}
      <path d="M101 60 L100 66 L103 66" stroke="#D2885E" strokeWidth="1.2" strokeLinecap="round" />

      {/* Welcoming Smile */}
      <path d="M96 71 C98 74 104 74 106 71" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="89" cy="65" r="2.5" fill="#EF4444" opacity="0.15" />
      <circle cx="113" cy="65" r="2.5" fill="#EF4444" opacity="0.15" />
    </g>
  </svg>
);

/**
 * 2. VIRASAT — FULL-BODY Heritage & Monument Specialist
 * Attire: Royal lapis/sapphire blue angarkha silk kurta with diagonal crossover placket, gold zardozi trims,
 * ivory churidar, Rajasthani pointed-toe mojaris, scholarly glasses, cradling UNESCO heritage gazetteer,
 * orator mudra gesture.
 */
export const VirasatFullBodySVG: React.FC<{ showAura?: boolean; animated?: boolean }> = ({
  showAura = true,
  animated = true,
}) => (
  <svg
    viewBox="0 0 200 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-sm select-none"
    preserveAspectRatio="xMidYMid meet"
  >
    {showAura && <CulturalAura color1="#EFF6FF" color2="#BFDBFE" accent="#2563EB" animated={animated} />}

    <ellipse cx="100" cy="346" rx="52" ry="8" fill="#1E3A8A" opacity="0.12" />

    <g className={animated ? 'animate-guide-idle' : ''} style={{ transformOrigin: '100px 340px' }}>
      {/* ---------------- FOOTWEAR (Handcrafted Rajasthani Mojari Jootis with Upturned Toes) ---------------- */}
      {/* Left Mojari */}
      <path
        d="M74 332 C74 326 80 324 88 324 C97 324 100 327 101 334 C101 341 96 345 86 345 C78 345 74 340 73 336 C72 333 70 331 68 331 C70 335 72 338 74 340 Z"
        fill="#831843"
      />
      <path d="M74 330 L88 326" stroke="#FBBF24" strokeWidth="1" strokeDasharray="1.5 1.5" />
      {/* Right Mojari */}
      <path
        d="M102 334 C103 327 106 324 115 324 C123 324 128 326 128 332 C129 336 131 333 133 331 C131 335 129 339 127 341 C121 345 107 345 102 334 Z"
        fill="#831843"
      />
      <path d="M115 326 L128 330" stroke="#FBBF24" strokeWidth="1" strokeDasharray="1.5 1.5" />

      {/* ---------------- LEGS & IVORY CHURIDAR ---------------- */}
      <path d="M80 230 L82 304 C82 314 84 322 86 328 L96 328 C96 320 94 310 94 234 Z" fill="#F8FAFC" />
      <path d="M108 234 L108 310 C108 320 106 322 106 328 L117 328 C119 322 121 314 121 230 Z" fill="#F8FAFC" />
      <path d="M83 296 C88 299 92 298 95 296" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M84 314 C89 317 92 316 95 314" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M107 298 C111 301 116 300 119 298" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M107 316 C111 319 115 318 118 316" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />

      {/* ---------------- SILK ANGARKHA KURTA (Royal Lapis Blue) ---------------- */}
      {/* Lower Flare Hem */}
      <path
        d="M66 190 L70 248 C70 254 75 256 82 256 L122 256 C129 256 134 254 134 248 L138 190 Z"
        fill="#1E3A8A"
      />
      <path d="M70 252 L134 252" stroke="#FBBF24" strokeWidth="2" />

      {/* Torso with Diagonal Overlap */}
      <path
        d="M66 116 C66 108 72 100 82 98 L122 98 C132 100 138 108 138 116 L136 194 L68 194 Z"
        fill="#1E3A8A"
      />
      {/* Angarkha Diagonal Crossover Line & Gold Zari Trim */}
      <path d="M86 98 L126 194" stroke="#FBBF24" strokeWidth="2" />
      <path d="M84 100 L124 196" stroke="#FDE68A" strokeWidth="0.8" />
      {/* Tied Tassels (Latkan) */}
      <circle cx="118" cy="174" r="3" fill="#F59E0B" />
      <path d="M118 177 L116 186 M118 177 L120 186" stroke="#F59E0B" strokeWidth="1" />

      {/* ---------------- LEFT ARM & UNESCO GAZETTEER FOLIO ---------------- */}
      <path d="M134 108 L150 148 L140 154 L128 122 Z" fill="#1E3A8A" />
      <path d="M146 148 L152 184 L142 188 L138 153 Z" fill="#D99770" />
      {/* Leather-bound Heritage Book with Temple Vimana Seal */}
      <rect x="142" y="162" width="16" height="42" rx="3" fill="#831843" stroke="#FBBF24" strokeWidth="1.2" />
      <rect x="145" y="174" width="10" height="12" rx="1.5" fill="#FBBF24" />
      <polygon points="150,176 153,182 147,182" fill="#831843" />

      {/* ---------------- RIGHT ARM & SCHOLARLY ORATOR GESTURE (Vyakhyana Mudra) ---------------- */}
      <g className={animated ? 'animate-guide-hand' : ''} style={{ transformOrigin: '70px 112px' }}>
        <path d="M70 108 L52 136 L60 144 L76 120 Z" fill="#1E3A8A" />
        <path d="M54 138 L42 96 L52 92 L62 134 Z" fill="#D99770" />
        {/* Poised mudra gesture (thumb and index meeting) */}
        <ellipse cx="44" cy="88" rx="4" ry="5" fill="#D99770" />
        <path d="M42 86 C40 84 41 80 44 80 C47 80 48 83 48 86" stroke="#1E3A8A" strokeWidth="0.8" />
        <path d="M46 84 C48 80 52 80 54 83 C55 86 54 90 52 92" stroke="#1E3A8A" strokeWidth="0.8" />
      </g>

      {/* ---------------- HEAD, SCHOLARLY GLASSES & BEARD ---------------- */}
      <path d="M94 76 L108 76 L108 100 L94 100 Z" fill="#D99770" />
      <ellipse cx="101" cy="62" rx="19" ry="22" fill="#D99770" />
      <circle cx="82" cy="63" r="3.8" fill="#C5835C" />
      <circle cx="120" cy="63" r="3.8" fill="#C5835C" />

      {/* Neat Hair & Trimmed Goatee */}
      <path
        d="M81 58 C80 43 90 32 101 32 C112 32 122 43 121 58 C119 46 113 41 101 41 C89 41 83 46 81 58 Z"
        fill="#1F1D1D"
      />
      <path d="M96 74 C98 81 104 81 106 74 Z" fill="#1F1D1D" />

      {/* Scholarly Gold Wireframe Glasses */}
      <circle cx="94" cy="60" r="5" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
      <circle cx="108" cy="60" r="5" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
      <line x1="99" y1="60" x2="103" y2="60" stroke="#F59E0B" strokeWidth="1.2" />

      <ellipse cx="94" cy="60" rx="2" ry="2.2" fill="#1C1917" />
      <circle cx="95" cy="59" r="0.7" fill="#FFFFFF" />
      <ellipse cx="108" cy="60" rx="2" ry="2.2" fill="#1C1917" />
      <circle cx="109" cy="59" r="0.7" fill="#FFFFFF" />

      <path d="M89 53 C92 51 96 52 98 54" stroke="#1F1D1D" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M104 54 C106 52 110 51 113 53" stroke="#1F1D1D" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M97 70 C99 72 103 72 105 70" stroke="#831843" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * 3. SAFAR — FULL-BODY Transit & Route Specialist
 * Attire: Emerald green Nehru utility vest over roll-up sleeve linen shirt, cargo trek pants, heavy-duty commuter boots,
 * cross-body messenger strap, digital GPS transit tablet, energetic "let's go" directional posture.
 */
export const SafarFullBodySVG: React.FC<{ showAura?: boolean; animated?: boolean }> = ({
  showAura = true,
  animated = true,
}) => (
  <svg
    viewBox="0 0 200 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-sm select-none"
    preserveAspectRatio="xMidYMid meet"
  >
    {showAura && <CulturalAura color1="#ECFDF5" color2="#A7F3D0" accent="#059669" animated={animated} />}

    <ellipse cx="100" cy="346" rx="54" ry="8" fill="#047857" opacity="0.12" />

    <g className={animated ? 'animate-guide-idle' : ''} style={{ transformOrigin: '100px 340px' }}>
      {/* ---------------- FOOTWEAR (Station & Trail Commuter Boots) ---------------- */}
      <path
        d="M72 328 C72 324 78 322 88 322 C97 322 101 326 102 332 C102 340 96 345 86 345 C76 345 72 338 72 328 Z"
        fill="#0F172A"
      />
      <rect x="73" y="340" width="28" height="4" rx="1.5" fill="#78350F" />
      <path
        d="M102 332 C103 326 107 322 116 322 C125 322 130 324 130 328 C130 338 126 345 116 345 C106 345 102 340 102 332 Z"
        fill="#0F172A"
      />
      <rect x="103" y="340" width="26" height="4" rx="1.5" fill="#78350F" />

      {/* ---------------- LEGS & CARGO EXPEDITION PANTS ---------------- */}
      <path d="M76 226 L80 300 C80 312 82 320 84 326 L96 326 C96 318 94 308 94 230 Z" fill="#334155" />
      <path d="M108 230 L108 308 C108 318 106 322 106 326 L118 326 C120 320 122 312 122 226 Z" fill="#334155" />
      {/* Cargo Pocket on Right Leg */}
      <rect x="114" y="260" width="8" height="16" rx="2" fill="#1E293B" />
      <rect x="78" y="260" width="8" height="16" rx="2" fill="#1E293B" />

      {/* ---------------- TORSO: ROLL-UP SHIRT + NEHRU VEST ---------------- */}
      <path d="M68 114 L74 192 L130 192 L136 114 Z" fill="#FFFDF7" />
      {/* Emerald Green Nehru Utility Vest */}
      <path
        d="M68 116 C68 108 74 100 84 98 L120 98 C130 100 136 108 136 116 L134 198 C134 204 130 206 124 206 L80 206 C74 206 70 204 70 198 Z"
        fill="#047857"
      />
      <path d="M101 100 L101 206" stroke="#065F46" strokeWidth="1.4" />
      {/* Brass Snap Buttons */}
      <circle cx="101" cy="112" r="1.6" fill="#FBBF24" />
      <circle cx="101" cy="128" r="1.6" fill="#FBBF24" />
      <circle cx="101" cy="144" r="1.6" fill="#FBBF24" />
      <circle cx="101" cy="160" r="1.6" fill="#FBBF24" />
      {/* Utility Ticket Pockets */}
      <rect x="76" y="140" width="16" height="10" rx="1.5" fill="#065F46" />
      <rect x="110" y="140" width="16" height="10" rx="1.5" fill="#065F46" />

      {/* ---------------- LEFT ARM & DIGITAL ROUTE TABLET ---------------- */}
      <path d="M132 108 L148 144 L138 150 L126 120 Z" fill="#047857" />
      <path d="M144 144 L150 178 L140 182 L136 150 Z" fill="#D68F63" />
      {/* Digital Transit Navigator Tablet with Active Route Display */}
      <rect x="138" y="160" width="24" height="34" rx="3" fill="#0F172A" stroke="#10B981" strokeWidth="1.5" />
      <rect x="141" y="163" width="18" height="28" rx="1.5" fill="#064E3B" />
      <path d="M144 184 L149 174 L154 178 L156 168" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="156" cy="168" r="1.8" fill="#FBBF24" />

      {/* ---------------- RIGHT ARM & DIRECTIONAL FORWARD GESTURE ---------------- */}
      <g className={animated ? 'animate-guide-hand' : ''} style={{ transformOrigin: '70px 112px' }}>
        <path d="M70 108 L50 134 L58 142 L76 120 Z" fill="#047857" />
        <path d="M52 136 L36 130 L38 120 L58 128 Z" fill="#D68F63" />
        {/* Dynamic pointing hand */}
        <path
          d="M36 126 L22 122 C20 121 20 119 22 118 L34 118 C36 118 38 121 38 126 Z"
          fill="#D68F63"
          stroke="#047857"
          strokeWidth="0.8"
        />
      </g>

      {/* ---------------- HEAD & ENERGETIC EXPRESSION ---------------- */}
      <path d="M94 76 L108 76 L108 100 L94 100 Z" fill="#D68F63" />
      <ellipse cx="101" cy="62" rx="19" ry="22" fill="#D68F63" />
      <circle cx="82" cy="63" r="3.8" fill="#BD7950" />
      <circle cx="120" cy="63" r="3.8" fill="#BD7950" />

      {/* Sporty Combed Hair */}
      <path
        d="M81 56 C80 42 90 32 101 32 C114 32 122 42 121 56 C118 45 112 40 101 40 C89 40 83 45 81 56 Z"
        fill="#1C1917"
      />

      <ellipse cx="94" cy="60" rx="2.5" ry="3" fill="#1C1917" />
      <circle cx="95" cy="59" r="0.9" fill="#FFFFFF" />
      <ellipse cx="108" cy="60" rx="2.5" ry="3" fill="#1C1917" />
      <circle cx="109" cy="59" r="0.9" fill="#FFFFFF" />

      <path d="M90 53 C93 51 97 52 99 54" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M103 54 C105 52 109 51 112 53" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />

      <path d="M96 71 C98 75 104 75 106 71" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * 4. RASIKA — FULL-BODY Culture, Food & Crafts Guide
 * Attire: Turmeric gold & madder red handloom saree-kurti drape with Ajrakh block-print border, Kolhapuri chappals,
 * gold bangles, floral jasmine bun, cradling carved textile woodblock and spice bowl, gracious welcoming gesture.
 */
export const RasikaFullBodySVG: React.FC<{ showAura?: boolean; animated?: boolean }> = ({
  showAura = true,
  animated = true,
}) => (
  <svg
    viewBox="0 0 200 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-sm select-none"
    preserveAspectRatio="xMidYMid meet"
  >
    {showAura && <CulturalAura color1="#FFF7ED" color2="#FED7AA" accent="#EA580C" animated={animated} />}

    <ellipse cx="100" cy="346" rx="52" ry="8" fill="#991B1B" opacity="0.1" />

    <g className={animated ? 'animate-guide-idle' : ''} style={{ transformOrigin: '100px 340px' }}>
      {/* ---------------- FOOTWEAR (Kolhapuri Handcrafted Leather Chappals) ---------------- */}
      <path
        d="M74 332 C74 326 80 324 88 324 C97 324 100 327 101 334 C101 341 96 345 86 345 C78 345 74 340 74 332 Z"
        fill="#78350F"
      />
      <circle cx="86" cy="334" r="2" fill="#DC2626" />
      <path
        d="M102 334 C103 327 106 324 115 324 C123 324 128 326 128 332 C128 340 124 345 116 345 C107 345 102 340 102 334 Z"
        fill="#78350F"
      />
      <circle cx="116" cy="334" r="2" fill="#DC2626" />

      {/* ---------------- PLEATED SILK DHOTI SKIRT / LOWER SAREE DRAPE ---------------- */}
      <path
        d="M72 200 C72 200 68 280 72 324 L96 324 C96 280 98 220 98 200 Z"
        fill="#B45309"
      />
      <path
        d="M102 200 C102 220 104 280 104 324 L128 324 C132 280 128 200 128 200 Z"
        fill="#B45309"
      />
      {/* Central Pleats & Gold Zari Hem Border */}
      <path d="M72 320 L128 320" stroke="#FBBF24" strokeWidth="2.5" />
      <path d="M96 202 L96 322" stroke="#9A3412" strokeWidth="1.2" />
      <path d="M104 202 L104 322" stroke="#9A3412" strokeWidth="1.2" />

      {/* ---------------- UPPER BODY & AJRAKH SASH / SAREE PALLU ---------------- */}
      <path
        d="M68 116 C68 108 74 100 84 98 L118 98 C128 100 134 108 134 116 L130 204 L70 204 Z"
        fill="#D97706"
      />
      {/* Madder Red Ajrakh Saree Pallu crossing shoulder */}
      <path
        d="M72 100 C72 100 114 130 118 204 L132 204 C132 160 88 98 74 98 Z"
        fill="#991B1B"
      />
      {/* Ajrakh Medallion Block Pattern */}
      <circle cx="86" cy="116" r="2" fill="#FDE68A" />
      <circle cx="98" cy="136" r="2" fill="#FDE68A" />
      <circle cx="110" cy="158" r="2" fill="#FDE68A" />
      <circle cx="120" cy="182" r="2" fill="#FDE68A" />

      {/* ---------------- RIGHT ARM & CARVED WOODEN PRINTING BLOCK ---------------- */}
      <path d="M72 108 L56 138 L64 144 L78 118 Z" fill="#D97706" />
      <path d="M58 140 L70 174 L78 170 L66 138 Z" fill="#DE9C72" />
      {/* Filigree Gold Bangles */}
      <rect x="68" y="166" width="9" height="3" rx="1" fill="#FBBF24" />
      {/* Hand holding Hand-carved Wooden Textile Woodblock */}
      <circle cx="76" cy="178" r="5" fill="#DE9C72" />
      <rect x="74" y="172" width="16" height="14" rx="2" fill="#78350F" stroke="#FBBF24" strokeWidth="1" />
      <path d="M78 176 L86 182 M86 176 L78 182" stroke="#FDE68A" strokeWidth="0.8" />

      {/* ---------------- LEFT ARM & GRACIOUS OPEN-PALM WELCOME ---------------- */}
      <g className={animated ? 'animate-guide-hand' : ''} style={{ transformOrigin: '128px 112px' }}>
        <path d="M130 108 L146 138 L138 144 L124 118 Z" fill="#991B1B" />
        <path d="M142 140 L156 112 L164 116 L148 146 Z" fill="#DE9C72" />
        {/* Gold Bangles */}
        <rect x="152" y="118" width="9" height="3" rx="1" fill="#FBBF24" />
        {/* Gracious open palm */}
        <path
          d="M156 110 C158 104 162 98 166 98 C170 98 171 102 170 106 C173 103 176 104 176 108 C177 106 180 107 179 112 C178 116 172 120 166 120 Z"
          fill="#DE9C72"
          stroke="#991B1B"
          strokeWidth="0.8"
        />
      </g>

      {/* ---------------- HEAD, BINDI & JASMINE FLOWER BUN ---------------- */}
      <path d="M94 76 L108 76 L108 100 L94 100 Z" fill="#DE9C72" />
      <ellipse cx="101" cy="62" rx="18" ry="21" fill="#DE9C72" />
      <circle cx="83" cy="63" r="3.5" fill="#C7845A" />
      <circle cx="119" cy="63" r="3.5" fill="#C7845A" />

      {/* Low Bun with White Jasmine (Mogra) Blossoms */}
      <circle cx="101" cy="38" r="14" fill="#1C1917" />
      <circle cx="94" cy="34" r="2.5" fill="#FFFFFF" />
      <circle cx="101" cy="32" r="2.5" fill="#FFFFFF" />
      <circle cx="108" cy="34" r="2.5" fill="#FFFFFF" />

      {/* Elegant Hairline */}
      <path
        d="M83 56 C82 44 91 36 101 36 C111 36 120 44 119 56 C118 47 112 43 101 43 C90 43 84 47 83 56 Z"
        fill="#1C1917"
      />

      {/* Maroon Bindi */}
      <circle cx="101" cy="54" r="1.5" fill="#991B1B" />

      <ellipse cx="94" cy="60" rx="2.5" ry="3" fill="#1C1917" />
      <circle cx="95" cy="59" r="0.9" fill="#FFFFFF" />
      <ellipse cx="108" cy="60" rx="2.5" ry="3" fill="#1C1917" />
      <circle cx="109" cy="59" r="0.9" fill="#FFFFFF" />

      <path d="M90 53 C93 51 97 52 99 54" stroke="#1C1917" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M103 54 C105 52 109 51 112 53" stroke="#1C1917" strokeWidth="1.4" strokeLinecap="round" />

      <path d="M96 71 C98 75 104 75 106 71" stroke="#991B1B" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * 5. KHOJ — FULL-BODY Hidden India & Offbeat Explorer
 * Attire: Indigo safari field jacket with rolled sleeves and brass flap pockets, checked cotton gamcha neck scarf,
 * olive expedition cargo trousers, high-top trek boots, field notebook with hand-drawn temple sketch, brass compass loupe.
 */
export const KhojFullBodySVG: React.FC<{ showAura?: boolean; animated?: boolean }> = ({
  showAura = true,
  animated = true,
}) => (
  <svg
    viewBox="0 0 200 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-sm select-none"
    preserveAspectRatio="xMidYMid meet"
  >
    {showAura && <CulturalAura color1="#EEF2FF" color2="#C7D2FE" accent="#4338CA" animated={animated} />}

    <ellipse cx="100" cy="346" rx="54" ry="8" fill="#312E81" opacity="0.12" />

    <g className={animated ? 'animate-guide-idle' : ''} style={{ transformOrigin: '100px 340px' }}>
      {/* ---------------- FOOTWEAR (High-Top Trail Hiking Boots) ---------------- */}
      <path
        d="M72 328 C72 322 78 320 88 320 C97 320 101 324 102 332 C102 340 96 345 86 345 C76 345 72 338 72 328 Z"
        fill="#57534E"
      />
      <rect x="73" y="340" width="28" height="4" rx="1.5" fill="#292524" />
      <path
        d="M102 332 C103 324 107 320 116 320 C125 320 130 322 130 328 C130 338 126 345 116 345 C106 345 102 340 102 332 Z"
        fill="#57534E"
      />
      <rect x="103" y="340" width="26" height="4" rx="1.5" fill="#292524" />

      {/* ---------------- LEGS & OLIVE EXPEDITION TROUSERS ---------------- */}
      <path d="M76 226 L80 300 C80 312 82 318 84 324 L96 324 C96 316 94 308 94 230 Z" fill="#4B5563" />
      <path d="M108 230 L108 308 C108 316 106 320 106 324 L118 324 C120 318 122 312 122 226 Z" fill="#4B5563" />

      {/* ---------------- TORSO: INDIGO FIELD SAFARI JACKET ---------------- */}
      <path
        d="M66 116 C66 108 72 100 82 98 L120 98 C130 100 136 108 136 116 L134 206 C134 212 130 214 124 214 L78 214 C72 214 68 212 68 206 Z"
        fill="#3730A3"
      />
      {/* Dual Brass-Buttoned Utility Pockets */}
      <rect x="74" y="138" width="16" height="14" rx="2" fill="#312E81" />
      <circle cx="82" cy="142" r="1.4" fill="#FBBF24" />
      <rect x="112" y="138" width="16" height="14" rx="2" fill="#312E81" />
      <circle cx="120" cy="142" r="1.4" fill="#FBBF24" />

      {/* Checked Indian Gamcha Neck Scarf */}
      <path
        d="M86 94 C86 94 100 114 102 134 C104 114 118 94 118 94 Z"
        fill="#DC2626"
      />
      <line x1="88" y1="104" x2="116" y2="104" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="92" y1="116" x2="112" y2="116" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 2" />

      {/* ---------------- LEFT ARM & EXPEDITION NOTEBOOK ---------------- */}
      <path d="M132 108 L148 144 L138 150 L126 120 Z" fill="#3730A3" />
      <path d="M144 144 L152 178 L142 182 L136 150 Z" fill="#D48C5E" />
      {/* Illustrated Field Journal */}
      <rect x="140" y="162" width="22" height="32" rx="2" fill="#FFFDF7" stroke="#78350F" strokeWidth="1.2" />
      <line x1="144" y1="170" x2="158" y2="170" stroke="#3730A3" strokeWidth="1" />
      <line x1="144" y1="178" x2="154" y2="178" stroke="#3730A3" strokeWidth="1" />
      <circle cx="151" cy="184" r="3" fill="#CA8A04" />

      {/* ---------------- RIGHT ARM & BRASS MAGNIFYING LOUPE ---------------- */}
      <g className={animated ? 'animate-guide-hand' : ''} style={{ transformOrigin: '70px 112px' }}>
        <path d="M70 108 L52 136 L60 144 L76 120 Z" fill="#3730A3" />
        <path d="M54 138 L42 110 L50 106 L62 134 Z" fill="#D48C5E" />
        {/* Antique Brass Magnifying Loupe */}
        <circle cx="42" cy="100" r="7" stroke="#F59E0B" strokeWidth="1.8" fill="none" />
        <circle cx="42" cy="100" r="5" fill="#E0E7FF" opacity="0.4" />
        <line x1="46" y1="105" x2="52" y2="112" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* ---------------- HEAD & INQUISITIVE EXPLORER EXPRESSION ---------------- */}
      <path d="M94 76 L108 76 L108 100 L94 100 Z" fill="#D48C5E" />
      <ellipse cx="101" cy="62" rx="19" ry="22" fill="#D48C5E" />
      <circle cx="82" cy="63" r="3.8" fill="#BD7547" />
      <circle cx="120" cy="63" r="3.8" fill="#BD7547" />

      {/* Wind-swept Explorer Hair */}
      <path
        d="M81 56 C80 42 90 30 102 30 C114 30 123 42 121 56 C118 45 111 39 101 39 C89 39 83 45 81 56 Z"
        fill="#1C1917"
      />

      <ellipse cx="94" cy="60" rx="2.5" ry="3" fill="#1C1917" />
      <circle cx="95" cy="59" r="0.9" fill="#FFFFFF" />
      <ellipse cx="108" cy="60" rx="2.5" ry="3" fill="#1C1917" />
      <circle cx="109" cy="59" r="0.9" fill="#FFFFFF" />

      {/* Inquisitive Raised Eyebrow */}
      <path d="M89 54 C92 53 96 54 98 56" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M103 52 C106 49 110 49 113 52" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />

      <path d="M96 71 C98 75 104 74 106 70" stroke="#3730A3" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * 6. PRITHVI — FULL-BODY Responsible Tourism & Sustainability Guide
 * Attire: Organic unbleached khadi cotton kurta tunic with green threadwork, relaxed cotton pyjama,
 * hand-woven natural jute espadrilles, hammered brass travel canteen, gently cradling a sacred green Bodhi/peepal leaf sprig.
 */
export const PrithviFullBodySVG: React.FC<{ showAura?: boolean; animated?: boolean }> = ({
  showAura = true,
  animated = true,
}) => (
  <svg
    viewBox="0 0 200 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-sm select-none"
    preserveAspectRatio="xMidYMid meet"
  >
    {showAura && <CulturalAura color1="#F0FDF4" color2="#BBF7D0" accent="#16A34A" animated={animated} />}

    <ellipse cx="100" cy="346" rx="52" ry="8" fill="#14532D" opacity="0.1" />

    <g className={animated ? 'animate-guide-idle' : ''} style={{ transformOrigin: '100px 340px' }}>
      {/* ---------------- FOOTWEAR (Natural Woven Jute Slip-ons) ---------------- */}
      <path
        d="M74 332 C74 326 80 324 88 324 C97 324 100 327 101 334 C101 341 96 345 86 345 C78 345 74 340 74 332 Z"
        fill="#78716C"
      />
      <path d="M76 341 C82 344 92 344 98 341" stroke="#E7E5E4" strokeWidth="1" />
      <path
        d="M102 334 C103 327 106 324 115 324 C123 324 128 326 128 332 C128 340 124 345 116 345 C107 345 102 340 102 334 Z"
        fill="#78716C"
      />
      <path d="M104 341 C110 344 120 344 126 341" stroke="#E7E5E4" strokeWidth="1" />

      {/* ---------------- LEGS & KHADI PYJAMA ---------------- */}
      <path d="M78 226 L80 300 C80 312 82 320 84 326 L96 326 C96 318 94 308 94 230 Z" fill="#E7E5E4" />
      <path d="M108 230 L108 308 C108 318 106 322 106 326 L118 326 C120 320 122 312 122 226 Z" fill="#E7E5E4" />

      {/* ---------------- UPPER BODY & UNBLEACHED KHADI KURTA TUNIC ---------------- */}
      <path
        d="M66 116 C66 108 72 100 82 98 L120 98 C130 100 136 108 136 116 L134 238 C134 244 130 246 124 246 L78 246 C72 246 68 244 68 238 Z"
        fill="#FAF7F0"
      />
      {/* Forest-Green Thread Embroidery at Hem and Collar */}
      <path d="M68 242 L134 242" stroke="#15803D" strokeWidth="1.8" />
      <path d="M101 100 L101 168" stroke="#15803D" strokeWidth="1.2" />
      <circle cx="101" cy="112" r="1.4" fill="#15803D" />
      <circle cx="101" cy="126" r="1.4" fill="#15803D" />
      <circle cx="101" cy="140" r="1.4" fill="#15803D" />

      {/* Hammered Brass Travel Canteen across Torso */}
      <path d="M72 106 L128 196" stroke="#78350F" strokeWidth="1.5" />
      <circle cx="126" cy="194" r="8" fill="#CA8A04" stroke="#78350F" strokeWidth="1.2" />
      <circle cx="126" cy="194" r="5" fill="#EAB308" />

      {/* ---------------- LEFT ARM: GENTLY RESTING OVER CHEST ---------------- */}
      <path d="M132 108 L146 142 L136 148 L126 120 Z" fill="#FAF7F0" />
      <path d="M142 142 L120 168 L114 162 L134 138 Z" fill="#D79970" />
      <ellipse cx="114" cy="164" rx="4" ry="5" fill="#D79970" />

      {/* ---------------- RIGHT ARM & SACRED GREEN BODHI LEAF ---------------- */}
      <g className={animated ? 'animate-guide-hand' : ''} style={{ transformOrigin: '70px 112px' }}>
        <path d="M70 108 L54 136 L62 142 L76 120 Z" fill="#FAF7F0" />
        <path d="M56 138 L68 168 L60 172 L50 142 Z" fill="#D79970" />
        {/* Open Palm Cradling Peepal/Bodhi Leaf Sprig */}
        <circle cx="70" cy="172" r="5" fill="#D79970" />
        {/* Sacred Peepal / Bodhi Leaf with Stem */}
        <path
          d="M72 172 C74 162 82 154 84 144 C76 148 68 158 72 172 Z"
          fill="#16A34A"
        />
        <path d="M72 172 L82 148" stroke="#86EFAC" strokeWidth="0.8" />
      </g>

      {/* ---------------- HEAD & SERENE EXPRESSION ---------------- */}
      <path d="M94 76 L108 76 L108 100 L94 100 Z" fill="#D79970" />
      <ellipse cx="101" cy="62" rx="19" ry="22" fill="#D79970" />
      <circle cx="82" cy="63" r="3.8" fill="#BD8057" />
      <circle cx="120" cy="63" r="3.8" fill="#BD8057" />

      <path
        d="M81 58 C80 43 90 32 101 32 C112 32 122 43 121 58 C119 46 113 41 101 41 C89 41 83 46 81 58 Z"
        fill="#1C1917"
      />

      <ellipse cx="94" cy="60" rx="2.5" ry="3" fill="#14532D" />
      <circle cx="95" cy="59" r="0.9" fill="#FFFFFF" />
      <ellipse cx="108" cy="60" rx="2.5" ry="3" fill="#14532D" />
      <circle cx="109" cy="59" r="0.9" fill="#FFFFFF" />

      <path d="M90 54 C93 52 97 53 99 55" stroke="#14532D" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M103 55 C105 53 109 52 112 54" stroke="#14532D" strokeWidth="1.4" strokeLinecap="round" />

      <path d="M96 71 C98 74 104 74 106 71" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * Universal Guide Illustration Component
 * Renders the FULL-BODY character from head to feet in authentic Indian regional clothing and accessories.
 */
export const GuideIllustration: React.FC<GuideIllustrationProps> = ({
  characterId,
  size = 'md',
  className = '',
  showAura = true,
  animated = true,
  popIn = false,
  popDirection = 'right',
  interactive = false,
  onClick,
}) => {
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  const getPopInClass = () => {
    if (!popIn) return '';
    switch (popDirection) {
      case 'left':
        return 'animate-guide-pop-left';
      case 'bottom':
        return 'animate-guide-pop-bottom';
      case 'right':
      default:
        return 'animate-guide-pop-right';
    }
  };

  const renderSVG = () => {
    switch (characterId) {
      case 'yatri':
        return <YatriFullBodySVG showAura={showAura} animated={animated} />;
      case 'virasat':
        return <VirasatFullBodySVG showAura={showAura} animated={animated} />;
      case 'safar':
        return <SafarFullBodySVG showAura={showAura} animated={animated} />;
      case 'rasika':
        return <RasikaFullBodySVG showAura={showAura} animated={animated} />;
      case 'khoj':
        return <KhojFullBodySVG showAura={showAura} animated={animated} />;
      case 'prithvi':
        return <PrithviFullBodySVG showAura={showAura} animated={animated} />;
      default:
        return <YatriFullBodySVG showAura={showAura} animated={animated} />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${sizeConfig.containerClass} ${getPopInClass()} ${className}`}
      aria-label={`Full-body illustrated Indian cultural guide ${characterId}`}
    >
      {renderSVG()}
    </div>
  );
};

// Aliases for backwards compatibility
export const YatriIllustration = ({ size = 'md', className = '' }: { size?: any; className?: string }) => (
  <GuideIllustration characterId="yatri" size={size} className={className} />
);
export const VirasatIllustration = ({ size = 'md', className = '' }: { size?: any; className?: string }) => (
  <GuideIllustration characterId="virasat" size={size} className={className} />
);
export const SafarIllustration = ({ size = 'md', className = '' }: { size?: any; className?: string }) => (
  <GuideIllustration characterId="safar" size={size} className={className} />
);
export const RasikaIllustration = ({ size = 'md', className = '' }: { size?: any; className?: string }) => (
  <GuideIllustration characterId="rasika" size={size} className={className} />
);
export const KhojIllustration = ({ size = 'md', className = '' }: { size?: any; className?: string }) => (
  <GuideIllustration characterId="khoj" size={size} className={className} />
);
export const PrithviIllustration = ({ size = 'md', className = '' }: { size?: any; className?: string }) => (
  <GuideIllustration characterId="prithvi" size={size} className={className} />
);
