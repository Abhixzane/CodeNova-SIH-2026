import React from 'react';
import { Compass, Sparkles, MapPin, Eye, ArrowRight, ShieldCheck } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { GuideIllustration } from '../cultural-guides/GuideIllustrations';

interface BeyondTheFamousSectionProps {
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenAIChat?: (prompt?: string) => void;
  selectedCity?: string;
}

interface HiddenPlace {
  id: string;
  name: string;
  hindiName: string;
  city: string;
  state: string;
  category: string;
  discoveryNote: string;
  timingTip: string;
  crowdLevel: 'Very Low' | 'Quiet' | 'Moderate';
  imageUrl: string;
}

export const BeyondTheFamousSection: React.FC<BeyondTheFamousSectionProps> = ({
  onSelectPlace,
  onNavigateTab,
  onOpenAIChat,
  selectedCity = 'All India',
}) => {
  // Verified repository of lesser-known Indian heritage destinations
  const verifiedGems: Record<string, HiddenPlace[]> = {
    mumbai: [
      {
        id: 'banganga-tank',
        name: 'Banganga Sacred Water Tank',
        hindiName: 'बाणगंगा पवित्र जल कुंड',
        city: 'Mumbai',
        state: 'Maharashtra',
        category: 'Sacred Water Heritage',
        discoveryNote: 'A 12th-century Silhara dynasty freshwater reservoir hidden within Malabar Hill, fed by an underground subterranean spring surrounded by ancient stone shrines.',
        timingTip: 'Visit at dawn (6:30 AM) to witness quiet temple bells and water reflections before city traffic begins.',
        crowdLevel: 'Very Low',
        imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'khotachiwadi-heritage',
        name: 'Khotachiwadi Portuguese Hamlet',
        hindiName: 'खोताचीवाडी हेरिटेज',
        city: 'Mumbai',
        state: 'Maharashtra',
        category: 'Colonial Vernacular',
        discoveryNote: 'A sheltered 19th-century East Indian Christian enclave of pastel wooden-carved verandahs, terracotta-tiled rooflines, and quiet cobblestone pedestrian lanes in Girgaon.',
        timingTip: 'Late afternoon walk (4:30 PM); observe vernacular wooden railings and private chapels.',
        crowdLevel: 'Quiet',
        imageUrl: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'gilbert-hill',
        name: 'Gilbert Hill Monolith',
        hindiName: 'गिल्बर्ट हिल',
        city: 'Mumbai',
        state: 'Maharashtra',
        category: 'Geological Wonder',
        discoveryNote: 'A sheer 200-foot sheer columnar basalt monolith formed 66 million years ago during the Cretaceous period volcanic events, one of only two such basalt columns on Earth.',
        timingTip: 'Climb the carved steps at sunrise for a 360-degree vista over the Arabian Sea horizon.',
        crowdLevel: 'Quiet',
        imageUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80',
      },
    ],
    delhi: [
      {
        id: 'agrasen-ki-baoli',
        name: 'Agrasen ki Baoli Stepwell',
        hindiName: 'अग्रसेन की बावली',
        city: 'Delhi',
        state: 'Delhi (NCT)',
        category: 'Subterranean Reservoir',
        discoveryNote: 'A 60-meter long by 15-meter wide 14th-century stepwell of 108 stone steps plunging into the earth, framed by arched alcoves moments away from Connaught Place.',
        timingTip: 'Early morning (7:00 AM) before city visitors arrive; incredible acoustic echo.',
        crowdLevel: 'Quiet',
        imageUrl: 'https://images.unsplash.com/photo-1585136917192-e7f22501a1c7?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'mehrauli-archaeological-park',
        name: 'Mehrauli Archaeological Park',
        hindiName: 'महरौली पुरातत्व पार्क',
        city: 'Delhi',
        state: 'Delhi (NCT)',
        category: 'Living Forest Citadel',
        discoveryNote: 'Over 200 historically significant monuments spanning 1,000 years of continuous occupation, including Jamali Kamali Mosque and Rajon ki Baoli hidden amidst dense foliage.',
        timingTip: 'Morning hours (8:00 AM - 11:00 AM); carry walking footwear for shaded paths.',
        crowdLevel: 'Very Low',
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
      },
    ],
    jaipur: [
      {
        id: 'panna-meena-stepwell',
        name: 'Panna Meena ka Kund',
        hindiName: 'पन्ना मीना का कुंड',
        city: 'Jaipur',
        state: 'Rajasthan',
        category: 'Geometric Stepwell',
        discoveryNote: 'A 16th-century architectural marvel featuring interlocking criss-cross stepped tiers, designed so that descending and ascending worshippers never shared the same flight.',
        timingTip: 'Golden hour late afternoon (4:00 PM) when the angled sunlight casts hypnotic geometric stair shadows.',
        crowdLevel: 'Quiet',
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'galta-ji-temple',
        name: 'Galta Ji Spring Temple',
        hindiName: 'गलता जी पवित्र कुंड',
        city: 'Jaipur',
        state: 'Rajasthan',
        category: 'Natural Gorge Sanctuary',
        discoveryNote: 'A series of ancient pink sandstone pavilions nestled in a dramatic mountain crevasse, fed by a continuous perennial mountain spring that pools into seven sacred kunds.',
        timingTip: 'Sunset hours; witness troop of langurs gather by the natural rock cliffs.',
        crowdLevel: 'Moderate',
        imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=800&auto=format&fit=crop&q=80',
      },
    ],
    agra: [
      {
        id: 'mehtab-bagh',
        name: 'Mehtab Bagh (Moonlight Garden)',
        hindiName: 'मेहताब बाग',
        city: 'Agra',
        state: 'Uttar Pradesh',
        category: 'Charbagh Sanctuary',
        discoveryNote: 'The 25-acre moonlit garden built directly opposite the Taj Mahal across the Yamuna River, designed by Emperor Babur as the terminal pleasure sanctuary of the riverfront.',
        timingTip: 'Sunset (5:30 PM) for unobstructed golden reflections across the water without tomb crowds.',
        crowdLevel: 'Quiet',
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
      },
    ],
    varanasi: [
      {
        id: 'panchganga-ghat',
        name: 'Panchganga Ghat Meditation Cells',
        hindiName: 'पंचगंगा घाट',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        category: 'Subterranean Ghat Cells',
        discoveryNote: 'The sacred mythical confluence of five holy streams, renowned for the subterranean stone meditation cells where saint Ramananda once taught Kabir.',
        timingTip: 'Dawn boat stop; quietest stone stairs along the northern crescent of the river.',
        crowdLevel: 'Very Low',
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
      },
    ],
    kochi: [
      {
        id: 'kadamakkudy-islands',
        name: 'Kadamakkudy Island Archipelago',
        hindiName: 'कदमाकुडी द्वीप समूह',
        city: 'Kochi',
        state: 'Kerala',
        category: 'Estuarine Sanctuary',
        discoveryNote: 'A network of 14 tranquil backwater islets fringed by mangrove swamps, traditional Chinese dip nets, and organic tidal prawn filtration fields.',
        timingTip: 'Sunrise cycling or country canoe navigation between island dykes.',
        crowdLevel: 'Very Low',
        imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
      },
    ],
  };

  // Determine which gems to show based on selected city
  const cityKey = selectedCity.toLowerCase().trim();
  let activeGems: HiddenPlace[] = [];

  if (cityKey.includes('mumbai')) {
    activeGems = verifiedGems.mumbai;
  } else if (cityKey.includes('delhi')) {
    activeGems = verifiedGems.delhi;
  } else if (cityKey.includes('jaipur')) {
    activeGems = verifiedGems.jaipur;
  } else if (cityKey.includes('agra')) {
    activeGems = verifiedGems.agra;
  } else if (cityKey.includes('varanasi')) {
    activeGems = verifiedGems.varanasi;
  } else if (cityKey.includes('kochi')) {
    activeGems = verifiedGems.kochi;
  } else {
    // Pan-India selection: take 1 from each verified region
    activeGems = [
      verifiedGems.mumbai[0], // Banganga
      verifiedGems.delhi[0],  // Agrasen ki Baoli
      verifiedGems.jaipur[0], // Panna Meena Stepwell
    ];
  }

  const handleDiscoverAction = () => {
    if (onOpenAIChat) {
      onOpenAIChat(
        selectedCity !== 'All India'
          ? `Namaste Khoj! Show me secret hidden gems, quiet baolis, and lesser-known heritage in ${selectedCity}.`
          : 'Namaste Khoj! Recommend verified offbeat heritage sites and hidden stepwells across India.'
      );
    } else {
      onNavigateTab('ai');
    }
  };

  return (
    <section id="beyond-the-famous-section" className="space-y-6 pt-6">
      {/* Signature Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Offbeat & Lesser-Known</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Beyond the Famous
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1">
            The India you don't always find in guidebooks.
          </p>
        </div>

        {/* Functional CTA: Discover Hidden India */}
        <button
          onClick={handleDiscoverAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition self-start sm:self-auto active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Discover Hidden India</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Khoj Digital Guide Integration */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-white to-stone-50 border border-emerald-200/80 shadow-2xs">
        <div className="shrink-0">
          <GuideIllustration characterId="khoj" size="md" animated={true} popIn={true} />
        </div>
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-950">Khoj (खोज)</span>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Secret Pathways Scout
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-2xl">
            "Behind tourist corridors lie sacred stone water springs, geometric subterranean stepwells, and ancient basalt formations. Here are verified sanctuary spaces in {selectedCity === 'All India' ? 'India' : selectedCity} where history breathes uninterrupted."
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <button
              onClick={handleDiscoverAction}
              className="text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-lg transition"
            >
              Ask Khoj for Quiet Hours →
            </button>
            <span className="text-xs text-stone-500 font-medium py-1">
              Zero crowds • 100% verified archival landmarks
            </span>
          </div>
        </div>
      </div>

      {/* Small Number of Verified Lesser-Known Destinations (2 or 3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeGems.map((gem) => (
          <div
            key={gem.id}
            onClick={() => onSelectPlace(gem.id)}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EFE8DF] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden bg-stone-100">
              <img
                src={gem.imageUrl}
                alt={gem.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-emerald-900 uppercase tracking-wide shadow-xs">
                  {gem.category}
                </span>
                <span className="px-2 py-1 rounded-full bg-emerald-900/90 text-[10px] font-medium text-emerald-100">
                  {gem.crowdLevel}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1 text-[11px] text-amber-200 font-medium mb-0.5">
                  <MapPin className="w-3 h-3 text-amber-300" />
                  <span>{gem.city}, {gem.state}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-100 transition-colors">
                  {gem.name}
                </h3>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between bg-white">
              <p className="text-xs text-stone-600 leading-relaxed mb-3 line-clamp-3">
                {gem.discoveryNote}
              </p>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <span className="font-bold text-stone-700">Scout Tip:</span>
                  <span className="line-clamp-1">{gem.timingTip}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-950 pt-1">
                  <span>View Details & Transit</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
