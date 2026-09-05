import React, { useState } from 'react';
import { Landmark, Sparkles, Box, ArrowRight, ShieldCheck, Compass, RotateCw } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { GuideIllustration } from '../cultural-guides/GuideIllustrations';
import { InteractiveHeritageMonument3D, Monument3DType } from '../threed/InteractiveHeritageMonument3D';
import { ThreeDDestinationCard } from '../common/ThreeDDestinationCard';

interface ThreeDHeritageShowcaseProps {
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  selectedCity?: string;
}

export const ThreeDHeritageShowcase: React.FC<ThreeDHeritageShowcaseProps> = ({
  onSelectPlace,
  onNavigateTab,
  selectedCity = 'All India',
}) => {
  const [active3DMonument, setActive3DMonument] = useState<Monument3DType>('taj-mahal');
  const [viewMode, setViewMode] = useState<'cards' | 'simulator'>('cards');

  // Verified ASI & UNESCO Heritage Records directly from project datasets
  const verifiedMonuments = [
    {
      id: 'taj-mahal',
      type: 'taj-mahal' as Monument3DType,
      name: 'Taj Mahal',
      city: 'Agra',
      state: 'Uttar Pradesh',
      era: '1632 - 1653 CE',
      material: 'Makrana White Marble',
      architecturalStyle: 'Mughal Architecture',
      description:
        'A symmetrical Makrana marble masterpiece commissioned by Emperor Shah Jahan along the Yamuna riverfront, featuring semi-precious pietra dura gemstone inlays.',
      imageUrl:
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
      badge: 'UNESCO World Heritage',
    },
    {
      id: 'qutub-minar',
      type: 'qutub-minar' as Monument3DType,
      name: 'Qutub Minar Complex',
      city: 'New Delhi',
      state: 'Delhi (NCT)',
      era: '1192 - 1220 CE',
      material: 'Fluted Red Sandstone & Marble',
      architecturalStyle: 'Indo-Islamic Fluted Tower',
      description:
        'The tallest brick minaret in the world (72.5m) with Arabic epigraphy, flanked by the 4th-century rust-resistant Iron Pillar of King Chandragupta II.',
      imageUrl:
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
      badge: 'UNESCO World Heritage',
    },
    {
      id: 'gateway-of-india',
      type: 'gateway-of-india' as Monument3DType,
      name: 'Gateway of India',
      city: 'Mumbai',
      state: 'Maharashtra',
      era: '1911 - 1924 CE',
      material: 'Yellow Basalt & Reinforced Concrete',
      architecturalStyle: 'Indo-Saracenic Revival',
      description:
        'Grand basalt triumphal arch overlooking the Arabian Sea, built by George Wittet blending 16th-century Gujarati Sultanate and Roman triumphal arches.',
      imageUrl:
        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
      badge: 'National Monument',
    },
    {
      id: 'konark-sun-temple',
      type: 'konark-sun-temple' as Monument3DType,
      name: 'Konark Sun Temple',
      city: 'Konark',
      state: 'Odisha',
      era: '1250 CE',
      material: 'Khondalite Stone',
      architecturalStyle: 'Kalinga Architecture',
      description:
        'Colossal 13th-century chariot of Surya the Sun God carved with 24 intricate astronomical stone wheels and pulled by seven stone steeds.',
      imageUrl:
        'https://images.unsplash.com/photo-1600100397608-f010f443a9e1?w=800&auto=format&fit=crop&q=80',
      badge: 'UNESCO World Heritage',
    },
    {
      id: 'hampi-virupaksha',
      type: 'hampi-stone-temple' as Monument3DType,
      name: 'Hampi Virupaksha & Stone Chariot',
      city: 'Vijayanagara',
      state: 'Karnataka',
      era: '14th - 16th Century',
      material: 'Monolithic Granite',
      architecturalStyle: 'Vijayanagara Architecture',
      description:
        'Capital of the Vijayanagara Empire along the Tungabhadra river, famed for monolithic granite shrines, musical pillars, and stone chariot.',
      imageUrl:
        'https://images.unsplash.com/photo-1600100397858-6927976e3d2c?w=800&auto=format&fit=crop&q=80',
      badge: 'UNESCO World Heritage',
    },
    {
      id: 'amber-palace',
      type: 'amber-palace' as Monument3DType,
      name: 'Amber Palace & Jaigarh Fort',
      city: 'Jaipur',
      state: 'Rajasthan',
      era: '1592 CE',
      material: 'Red Sandstone & Marble',
      architecturalStyle: 'Rajput & Mughal Fort Architecture',
      description:
        'A majestic hill fortress overlooking Maota Lake, renowned for the Sheesh Mahal mirror mosaic hall that glitters with a single lamp.',
      imageUrl:
        'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=800&auto=format&fit=crop&q=80',
      badge: 'UNESCO Hill Forts',
    },
  ];

  // Prioritize city context if relevant
  const cityLower = selectedCity.toLowerCase();
  const sortedMonuments = [...verifiedMonuments].sort((a, b) => {
    if (cityLower.includes(a.city.toLowerCase())) return -1;
    if (cityLower.includes(b.city.toLowerCase())) return 1;
    return 0;
  });

  const selectedMonumentObj = verifiedMonuments.find((m) => m.type === active3DMonument) || verifiedMonuments[0];

  return (
    <section className="space-y-6 pt-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#EFE8DF] shadow-warm">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-200">
            <Landmark className="w-3.5 h-3.5 text-amber-700" />
            <span>Interactive 3D Architectural Archives</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Step Into India’s Heritage
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Interact with verified three-dimensional architectural objects and depth-enhanced perspectives of India’s celebrated monuments. Grounded in Archaeological Survey of India (ASI) records.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#EFE8DF] shrink-0">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'cards'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Depth Cards</span>
          </button>
          <button
            onClick={() => setViewMode('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'simulator'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D WebGL Simulator</span>
          </button>
        </div>
      </div>

      {/* Virasat Heritage Companion Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4.5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-white to-stone-50 border border-amber-200/80 shadow-warm">
        <GuideIllustration characterId="virasat" size="md" animated={true} popIn={true} popDirection="left" />
        <div className="flex-1 w-full min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>Virasat • Heritage Architecture Historian</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            "Each monument in India is a geometrical harmony of its geological terrain — from Agra’s translucent Makrana marble and Delhi’s red quartzose sandstone to Mumbai’s volcanic yellow basalt. Rotate the 3D models to examine symmetry and proportions."
          </p>
        </div>
      </div>

      {/* Simulator View vs Cards View */}
      {viewMode === 'simulator' ? (
        <div className="space-y-4">
          {/* Monument Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {verifiedMonuments.map((m) => (
              <button
                key={m.id}
                onClick={() => setActive3DMonument(m.type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 border ${
                  active3DMonument === m.type
                    ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                    : 'bg-white text-stone-700 border-[#EFE8DF] hover:bg-stone-50'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{m.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({m.city})</span>
              </button>
            ))}
          </div>

          {/* 3D WebGL Interactive Canvas */}
          <InteractiveHeritageMonument3D
            monumentType={active3DMonument}
            monumentName={selectedMonumentObj.name}
            cityName={selectedMonumentObj.city}
            onExploreDetails={() => onSelectPlace(selectedMonumentObj.id)}
          />

          {/* Architectural Fact Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-[#EFE8DF] shadow-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Dynasty / Era</span>
              <p className="text-sm font-bold text-stone-900 mt-0.5">{selectedMonumentObj.era}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#EFE8DF] shadow-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Primary Material</span>
              <p className="text-sm font-bold text-stone-900 mt-0.5">{selectedMonumentObj.material}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#EFE8DF] shadow-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Architectural Style</span>
              <p className="text-sm font-bold text-stone-900 mt-0.5">{selectedMonumentObj.architecturalStyle}</p>
            </div>
          </div>
        </div>
      ) : (
        /* 3D Depth Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMonuments.map((m) => (
            <ThreeDDestinationCard
              key={m.id}
              id={m.id}
              title={m.name}
              subtitle={`${m.city}, ${m.state}`}
              badge={m.badge}
              imageUrl={m.imageUrl}
              tagline={m.description}
              onClick={() => onSelectPlace(m.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
