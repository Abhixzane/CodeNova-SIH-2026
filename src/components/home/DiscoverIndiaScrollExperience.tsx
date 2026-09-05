import React, { useState } from 'react';
import { 
  Landmark, 
  Sparkles, 
  Utensils, 
  Palette, 
  Compass, 
  Train, 
  Sun, 
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { GuideIllustration } from '../cultural-guides/GuideIllustrations';

interface DiscoverIndiaScrollExperienceProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectPlace?: (placeId: string) => void;
  onSelectCity?: (city: string) => void;
  selectedCity?: string;
}

interface SceneData {
  number: number;
  title: string;
  theme: string;
  subtitle: string;
  guideId: 'virasat' | 'safar' | 'rasika' | 'khoj' | 'prithvi';
  guideName: string;
  guideQuote: string;
  description: string;
  highlights: { title: string; subtitle: string; location: string }[];
  actionLabel: string;
  actionTab: NavTab;
  imageUrl: string;
  culturalNote: string;
}

export const DiscoverIndiaScrollExperience: React.FC<DiscoverIndiaScrollExperienceProps> = ({
  onNavigateTab,
  onSelectPlace,
}) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const scenes: SceneData[] = [
    {
      number: 1,
      theme: 'Heritage',
      title: 'Dynasties & Monolithic Stone',
      subtitle: 'Where every carved plinth chronicles civilizational memory',
      guideId: 'virasat',
      guideName: 'Virasat',
      guideQuote: 'From 6th-century basalt cave sanctums to symmetrical marble domes, India’s architecture harmonizes with its sacred geography.',
      description: 'Journey across 42 UNESCO World Heritage Sites. Marvel at the fluted red sandstone minarets of Delhi, the mirror mosaics of Rajasthan hill forts, and the rock-cut Kailasa temple of Ellora hewn from a single cliff.',
      highlights: [
        { title: 'Taj Mahal', subtitle: 'Makrana Marble & Pietra Dura', location: 'Agra, UP' },
        { title: 'Kailasa Temple', subtitle: 'Monolithic Basalt Marvel', location: 'Ellora, MH' },
        { title: 'Hawa Mahal', subtitle: '953 Honeycomb Jharokhas', location: 'Jaipur, RJ' },
      ],
      actionLabel: 'Explore Heritage Archives',
      actionTab: 'heritage',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=85',
      culturalNote: 'ASI Protected • Verified Historical Timelines',
    },
    {
      number: 2,
      theme: 'Culture',
      title: 'Living Traditions & Sacred Rhythms',
      subtitle: 'Ancient ceremonies echoing along riverbanks and temple courtyards',
      guideId: 'rasika',
      guideName: 'Rasika',
      guideQuote: 'The culture of India is not locked in museum cabinets; it breathes every evening as conch shells blow along the Varanasi ghats.',
      description: 'Witness classical Kathakali dance rituals in Kerala, the transcendent Ganga Aarti at Dashashwamedh Ghat, and centuries of Sufi qawwali music in historic Delhi dargahs.',
      highlights: [
        { title: 'Ganga Sandhya Aarti', subtitle: 'Flaming Brass Diyas & Chants', location: 'Varanasi, UP' },
        { title: 'Kathakali Drama', subtitle: 'Expressive Mudras & Makeup', location: 'Kochi, KL' },
        { title: 'Lavani & Warli', subtitle: 'Folk Rhythms & Sacred Geometry', location: 'Maharashtra' },
      ],
      actionLabel: 'Discover Cultural Traditions',
      actionTab: 'culture-artisans',
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&auto=format&fit=crop&q=85',
      culturalNote: 'Living Intangible Cultural Heritage',
    },
    {
      number: 3,
      theme: 'Food',
      title: 'The Great Culinary Map',
      subtitle: 'From royal dum pukht kitchens to buzzing spice alleys',
      guideId: 'rasika',
      guideName: 'Rasika',
      guideQuote: 'Every 50 kilometres in India, the water changes and with it, the spice blend of the grandmother’s hearth.',
      description: 'Taste authentic regional gastronomy: steaming Mumbai Vada Pav along Dadar station, Awadhi saffron biryani in old lanes, crisp Malabar parottas, and sun-dried Rajasthani ker sangri.',
      highlights: [
        { title: 'Mumbai Street Eats', subtitle: 'Vada Pav, Pav Bhaji & Bun Maska', location: 'Mumbai, MH' },
        { title: 'Royal Dal Baati Churma', subtitle: 'Sandstone Pit Baking & Ghee', location: 'Jaipur, RJ' },
        { title: 'Malabar Fish Curry', subtitle: 'Fresh Coconut & Kudampuli', location: 'Fort Kochi, KL' },
      ],
      actionLabel: 'Browse Culinary Experiences',
      actionTab: 'culture-artisans',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop&q=85',
      culturalNote: 'Verified Local Origins & Historic Eateries',
    },
    {
      number: 4,
      theme: 'Crafts',
      title: 'Master Artisans & Guilds',
      subtitle: 'Centuries of GI-tagged craftsmanship passed hand-to-hand',
      guideId: 'prithvi',
      guideName: 'Prithvi',
      guideQuote: 'Supporting local handloom weavers and potters keeps sustainable civilizational wisdom alive.',
      description: 'Step inside living craft quarters: the jacquard pit-looms of Banaras weaving pure gold zari, Jaipur’s cobalt blue quartz pottery workshops, and Bidri silver-inlay metallurgy in the Deccan.',
      highlights: [
        { title: 'Banarasi Brocade Silk', subtitle: 'Real Silver Zari Weaving', location: 'Varanasi, UP' },
        { title: 'Jaipur Blue Pottery', subtitle: 'Egyptian Paste & Floral Motifs', location: 'Jaipur, RJ' },
        { title: 'Warli Tribal Painting', subtitle: 'Rice Flour & Terracotta Earth', location: 'Dahanu, MH' },
      ],
      actionLabel: 'Meet Indian Artisans',
      actionTab: 'culture-artisans',
      imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200&auto=format&fit=crop&q=85',
      culturalNote: 'Geographical Indication (GI) Certified',
    },
    {
      number: 5,
      theme: 'Hidden India',
      title: 'The Untrod Trail',
      subtitle: 'Ancient stepwells, hidden river islands and forgotten forts',
      guideId: 'khoj',
      guideName: 'Khoj',
      guideQuote: 'India’s most profound magic is often found down an unpaved alleyway where no tour buses tread.',
      description: 'Discover subterranean geometric stepwells where cool breezes blow, misty bamboo villages in Northeast river deltas, quiet Portuguese Latin quarters, and solitary hilltop Maratha bastions.',
      highlights: [
        { title: 'Panna Meena ka Kund', subtitle: 'Criss-Cross Geometric Stepwell', location: 'Amer, RJ' },
        { title: 'Khotachiwadi Village', subtitle: '19th Century Portuguese Hamlets', location: 'Girgaon, Mumbai' },
        { title: 'Agrasen ki Baoli', subtitle: '108 Steps of Red Sandstone', location: 'Connaught Place, DL' },
      ],
      actionLabel: 'Discover Hidden Places',
      actionTab: 'heritage',
      imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=1200&auto=format&fit=crop&q=85',
      culturalNote: 'Off-the-Beaten-Path Curations',
    },
    {
      number: 6,
      theme: 'Transport',
      title: 'The Steel Arteries of India',
      subtitle: 'Multimodal corridors connecting two billion journeys daily',
      guideId: 'safar',
      guideName: 'Safar',
      guideQuote: 'The Mumbai local train is not just a railway; it is the beating pulse and equalizing heart of the maximum city.',
      description: 'Experience India in motion: the iconic Mumbai suburban local lines bridging Churchgate to Dahanu, scenic Konkan coastal rail viaducts, yellow vintage taxis, and eco-friendly heritage ferries.',
      highlights: [
        { title: 'Mumbai Suburban Rail', subtitle: 'Western, Central & Harbour Lines', location: 'Mumbai, MH' },
        { title: 'CSMT Victorian Terminus', subtitle: 'Gothic Gargoyles & UNESCO Dome', location: 'Fort, Mumbai' },
        { title: 'Vembanad Water Ferry', subtitle: 'Historic Backwater Crossings', location: 'Ernakulam, KL' },
      ],
      actionLabel: 'Explore Railway & Transit',
      actionTab: 'mumbai-local',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=85',
      culturalNote: 'Suburban Network Schedules & Verified Fares',
    },
    {
      number: 7,
      theme: 'Experiences',
      title: 'Moments of Wonder',
      subtitle: 'Immersion that lingers in memory for a lifetime',
      guideId: 'rasika',
      guideName: 'Rasika',
      guideQuote: 'Travel becomes memorable not by the miles covered, but by the quiet dawn conversations you have with locals.',
      description: 'Morning yoga on peaceful ghat steps, bicycling through Art Deco boulevards of Marine Drive, sunset camel silhouettes across desert dunes, and tranquil tea harvest walks in high mountain hills.',
      highlights: [
        { title: 'Marine Drive Sunset', subtitle: 'Queen’s Necklace Twilight Walk', location: 'South Mumbai, MH' },
        { title: 'Amer Fort Dawn Trek', subtitle: 'Aravalli Mountain Mist', location: 'Jaipur, RJ' },
        { title: 'Fort Kochi Cycling', subtitle: 'Colonial Spice Warehouses', location: 'Kochi, KL' },
      ],
      actionLabel: 'Browse Curated Experiences',
      actionTab: 'heritage',
      imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop&q=85',
      culturalNote: 'Handcrafted Immersion Trails',
    },
    {
      number: 8,
      theme: 'Plan Your Journey',
      title: 'Turn Dreams into Real Journeys',
      subtitle: 'Smart routing, transparent budgets & verified accessibility',
      guideId: 'safar',
      guideName: 'Safar',
      guideQuote: 'Wherever your heart yearns to wander across India, let us organize every step with verified accuracy and seamless rail transit.',
      description: 'Craft custom day-by-day itineraries, calculate multimodal transit connections, check wheelchair accessibility ratings, and get real-time recommendations tailored to your travel style.',
      highlights: [
        { title: 'AI Itinerary Generator', subtitle: 'Optimized Time & Travel Fares', location: 'Pan-India' },
        { title: 'Multimodal Transit Planner', subtitle: 'Walk, Bus, Train & Auto Estimates', location: 'Active Hubs' },
        { title: 'Facility Intelligence', subtitle: 'Cloakrooms, Wheelchair & Water', location: 'Verified Sites' },
      ],
      actionLabel: 'Open Journey Planner',
      actionTab: 'itinerary',
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=85',
      culturalNote: 'End-to-End Travel Planning Engine',
    },
  ];

  const currentScene = scenes[activeSceneIndex];

  return (
    <section className="space-y-6 pt-8">
      {/* Section Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#EFE8DF] shadow-warm">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-200">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>Storytelling Journey • 8 Distinct Chapters</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Discover India
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Travel chapter by chapter through the foundational layers of the subcontinent. From UNESCO stone shrines to artisan looms and multimodal steel tracks.
          </p>
        </div>

        {/* Scene Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSceneIndex((prev) => (prev > 0 ? prev - 1 : scenes.length - 1))}
            className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] hover:bg-amber-50 text-stone-700 hover:text-amber-900 flex items-center justify-center transition shadow-2xs"
            aria-label="Previous Scene"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-stone-600 px-2 font-mono">
            {activeSceneIndex + 1} / {scenes.length}
          </span>
          <button
            onClick={() => setActiveSceneIndex((prev) => (prev < scenes.length - 1 ? prev + 1 : 0))}
            className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] hover:bg-amber-50 text-stone-700 hover:text-amber-900 flex items-center justify-center transition shadow-2xs"
            aria-label="Next Scene"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chapter Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {scenes.map((s, idx) => (
          <button
            key={s.number}
            onClick={() => setActiveSceneIndex(idx)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap border ${
              activeSceneIndex === idx
                ? 'bg-amber-800 text-white border-amber-800 shadow-xs scale-102'
                : 'bg-white text-stone-700 border-[#EFE8DF] hover:bg-stone-50'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] leading-4 font-mono font-bold">
              {s.number}
            </span>
            <span>{s.theme}</span>
          </button>
        ))}
      </div>

      {/* Active Scene Storytelling Stage */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-[#EFE8DF] shadow-3d-card transition-all duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Visual Scene Backdrop with Depth */}
          <div className="relative lg:col-span-6 min-h-[360px] sm:min-h-[440px] overflow-hidden bg-stone-100">
            <img
              src={currentScene.imageUrl}
              alt={currentScene.title}
              className="w-full h-full object-cover object-center filter saturate-95 transition-transform duration-700 ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent pointer-events-none" />

            {/* Cultural Badge Overlay */}
            <div className="absolute top-5 left-5 z-10">
              <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-amber-300 text-xs font-bold text-amber-900 shadow-warm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Chapter {currentScene.number}: {currentScene.theme}</span>
              </span>
            </div>

            {/* Cultural Note at Bottom */}
            <div className="absolute bottom-5 left-5 right-5 z-10 text-white text-xs font-medium flex items-center justify-between">
              <span className="bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                {currentScene.culturalNote}
              </span>
              <span className="text-white/80 font-serif italic text-sm">
                YatraVerse Storyline
              </span>
            </div>
          </div>

          {/* Right Column: Narrative, Guide Voice & Key Destinations */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-[#FAF8F5]">
            <div className="space-y-4">
              {/* Scene Title */}
              <div>
                <p className="text-xs font-bold text-amber-800 tracking-wider uppercase">
                  Scene {currentScene.number} of 8 • {currentScene.theme}
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-1">
                  {currentScene.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
                  {currentScene.subtitle}
                </p>
              </div>

              {/* Narrative Body */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                {currentScene.description}
              </p>

              {/* Accompanying Cultural Guide Voice */}
              <div className="p-4 rounded-2xl bg-white border border-[#EFE8DF] shadow-xs flex items-start gap-3.5">
                <GuideIllustration characterId={currentScene.guideId} size="sm" animated={true} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-0.5">
                    <span>{currentScene.guideName}’s Perspective</span>
                  </div>
                  <p className="text-xs text-stone-600 italic leading-relaxed">
                    "{currentScene.guideQuote}"
                  </p>
                </div>
              </div>

              {/* Highlights Pill Grid */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Featured Highlights
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentScene.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-white border border-[#EFE8DF] text-left shadow-2xs"
                    >
                      <p className="text-xs font-bold text-stone-900 truncate">{h.title}</p>
                      <p className="text-[10px] text-stone-500 truncate">{h.subtitle}</p>
                      <p className="text-[10px] font-semibold text-amber-800 mt-1 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{h.location}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-[#EFE8DF] flex items-center justify-between">
              <button
                onClick={() => onNavigateTab(currentScene.actionTab)}
                className="px-6 py-3 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-bold transition shadow-warm flex items-center gap-2 active:scale-98"
              >
                <span>{currentScene.actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-[11px] font-bold text-stone-400">
                Swipe or use arrows to proceed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
