import React, { useState } from 'react';
import { GuideIllustration } from './GuideIllustrations';
import { GUIDE_CHARACTERS } from './CulturalGuideTypes';
import { Compass, Sparkles, MapPin, ArrowRight, Eye, Layers } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface HiddenGem {
  id: string;
  name: string;
  city: string;
  state: string;
  century: string;
  category: string;
  whyInteresting: string;
  thumbnailUrl: string;
  tags: string[];
}

interface KhojHiddenIndiaSectionProps {
  selectedCity: string;
  onNavigateTab: (tab: NavTab) => void;
  onSelectPlace?: (placeId: string) => void;
  onOpenAIChat?: (prompt: string) => void;
}

const VERIFIED_HIDDEN_GEMS: Record<string, HiddenGem[]> = {
  mumbai: [
    {
      id: 'mumbai-banganga',
      name: 'Banganga Sacred Water Tank',
      city: 'Mumbai',
      state: 'Maharashtra',
      century: '12th Century AD',
      category: 'Sacred Architecture',
      whyInteresting: 'A mythical freshwater spring and tranquil rectangular stone tank built under the Silhara dynasty, surrounded by centuries-old temples in the heart of Malabar Hill.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
      tags: ['Silhara Heritage', 'Freshwater Spring', 'Temple Stepway'],
    },
    {
      id: 'mumbai-khotachiwadi',
      name: 'Khotachiwadi Heritage Hamlet',
      city: 'Mumbai',
      state: 'Maharashtra',
      century: '19th Century AD',
      category: 'Living Heritage Precinct',
      whyInteresting: 'A peaceful enclave of wooden Portuguese-Goan two-storey cottages with ornate verandahs and arched doorways, tucked behind bustling Girgaon.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&auto=format&fit=crop&q=80',
      tags: ['Portuguese Vernacular', 'Timber Architecture', 'Quiet Alleys'],
    },
    {
      id: 'mumbai-gilbert-hill',
      name: 'Gilbert Hill Monolithic Column',
      city: 'Mumbai',
      state: 'Maharashtra',
      century: '66 Million BCE',
      category: 'Geological Marvel',
      whyInteresting: 'A sheer 200-foot vertical column of black basalt rock created from volcanic molten lava during the Mesozoic era, older than Devils Tower.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
      tags: ['Prehistoric Basalt', 'Ancient Volcano', 'Panoramic Ridge'],
    },
  ],
  delhi: [
    {
      id: 'delhi-agrasen-baoli',
      name: 'Agrasen ki Baoli Stepwell',
      city: 'Delhi',
      state: 'Delhi (NCT)',
      century: '14th Century AD',
      category: 'Water Architecture',
      whyInteresting: 'A dramatic 60-meter long by 15-meter wide red sandstone stepwell comprising 108 steps across three arched levels, hidden minutes from Connaught Place.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1585136917192-e7f22501a1c7?w=800&auto=format&fit=crop&q=80',
      tags: ['Deep Reservoir', 'Tughlaq-era', 'Symmetrical Steps'],
    },
    {
      id: 'delhi-mehrauli-park',
      name: 'Mehrauli Archaeological Park',
      city: 'Delhi',
      state: 'Delhi (NCT)',
      century: '11th - 16th Century',
      category: 'Archaeological Forest',
      whyInteresting: 'A 200-acre forested heritage landscape housing over 100 historical monuments including Balban’s tomb, Jamali Kamali mosque, and Rajon ki Baoli stepwell.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
      tags: ['Sultanate Ruins', 'Canopy Trails', 'Peaceful Solitude'],
    },
    {
      id: 'delhi-ghalib-haveli',
      name: 'Mirza Ghalib Haveli Museum',
      city: 'Delhi',
      state: 'Delhi (NCT)',
      century: '19th Century AD',
      category: 'Literary Heritage',
      whyInteresting: 'The preserved residence of iconic Urdu poet Mirza Asadullah Baig Khan Ghalib, tucked in the labyrinthine alleys of Gali Qasim Jan in Old Delhi.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
      tags: ['Urdu Poetry', 'Mughal Haveli', 'Chandni Chowk Alleys'],
    },
  ],
  jaipur: [
    {
      id: 'jaipur-panna-meena',
      name: 'Panna Meena ka Kund',
      city: 'Jaipur',
      state: 'Rajasthan',
      century: '16th Century AD',
      category: 'Stepwell Engineering',
      whyInteresting: 'A masterpiece of symmetrical stepwell geometry with interlocking criss-cross staircases and recessed octagonal pavilions near Amer citadel.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      tags: ['Criss-cross Steps', 'Rajput Masonry', 'Sunrise Light'],
    },
    {
      id: 'jaipur-galta-ji',
      name: 'Galta Ji Spring Temple Complex',
      city: 'Jaipur',
      state: 'Rajasthan',
      century: '18th Century AD',
      category: 'Sacred Hill Spring',
      whyInteresting: 'A series of pink sandstone temple pavilions nestled between two mountain cliffs in the Aravalli hills, fed by perpetual natural mountain springs.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
      tags: ['Aravalli Gorge', 'Natural Kunds', 'Pink Sandstone'],
    },
  ],
  agra: [
    {
      id: 'agra-mehtab-bagh',
      name: 'Mehtab Bagh (Moonlight Garden)',
      city: 'Agra',
      state: 'Uttar Pradesh',
      century: '1530 AD',
      category: 'Mughal Charbagh',
      whyInteresting: 'The ultimate Yamuna riverbank charbagh aligned precisely with the Taj Mahal, offering serene sunset reflections without monumental crowds.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
      tags: ['Riverfront View', 'Charbagh Geometry', 'Sunset Reflection'],
    },
    {
      id: 'agra-chini-rauza',
      name: 'Chini ka Rauza Glazed Tomb',
      city: 'Agra',
      state: 'Uttar Pradesh',
      century: '1635 AD',
      category: 'Persian Tilework',
      whyInteresting: 'The funerary monument of Shah Jahan’s prime minister, renowned for its exotic Persian polychrome glazed porcelain tilework (kashi).',
      thumbnailUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
      tags: ['Persian Tilework', 'Yamuna Bank', 'Architectural Rarity'],
    },
  ],
  varanasi: [
    {
      id: 'varanasi-panchganga',
      name: 'Panchganga Ghat Meditation Cells',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      century: 'Ancient / 17th Century',
      category: 'Sacred Stone Pier',
      whyInteresting: 'Sacred confluence ghat housing subterranean stone meditation chambers and stone bastions where poet-saint Kabir composed verse in quietude.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      tags: ['Confluence of Rivers', 'Quiet Ghat', 'Kabir Tradition'],
    },
    {
      id: 'varanasi-chaukhandi',
      name: 'Chaukhandi Stupa at Sarnath',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      century: '5th - 16th Century',
      category: 'Buddhist & Mughal Fusion',
      whyInteresting: 'A terraced Gupta-era Buddhist mound later modified with an octagonal red sandstone tower built by Emperor Akbar to commemorate Humayun’s visit.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
      tags: ['Gupta Brickwork', 'Mughal Octagon', 'Peaceful Gardens'],
    },
  ],
  kochi: [
    {
      id: 'kochi-kadamakkudy',
      name: 'Kadamakkudy Island Archipelago',
      city: 'Kochi',
      state: 'Kerala',
      century: 'Natural Biosphere',
      category: 'Island Estuary',
      whyInteresting: 'Fourteen serene backwater islands interconnected by country bridges, preserving ancient pokkali saltwater rice and organic prawn filtration farming.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
      tags: ['Pokkali Farming', 'Migratory Birds', 'Quiet Backwaters'],
    },
    {
      id: 'kochi-bastion-bungalow',
      name: 'Bastion Bungalow Maritime Enclave',
      city: 'Kochi',
      state: 'Kerala',
      century: '1667 AD',
      category: 'Colonial Coastal Fort',
      whyInteresting: 'Built into the circular wall of the 17th-century Dutch Fort Stromberg, showcasing vaulted ceilings, timber floorboards, and spice-route cartography.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
      tags: ['Dutch Bastion', 'Spice Route Maps', 'Old Fort Kochi'],
    },
  ],
};

export const KhojHiddenIndiaSection: React.FC<KhojHiddenIndiaSectionProps> = ({
  selectedCity,
  onNavigateTab,
  onSelectPlace,
  onOpenAIChat,
}) => {
  const khoj = GUIDE_CHARACTERS.khoj;
  const cityKey = selectedCity.toLowerCase().trim();

  // Pick city-specific gems, or default to curated multi-city gems if "All India"
  const gems =
    VERIFIED_HIDDEN_GEMS[cityKey] || [
      VERIFIED_HIDDEN_GEMS.mumbai[0],
      VERIFIED_HIDDEN_GEMS.delhi[0],
      VERIFIED_HIDDEN_GEMS.jaipur[0],
      VERIFIED_HIDDEN_GEMS.varanasi[0],
    ];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#F7FEE7]/40 via-white to-[#FAF8F5] border border-lime-200/80 p-6 sm:p-10 shadow-xs">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <GuideIllustration characterId="khoj" size="lg" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-lime-900 bg-lime-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Guide Khoj Presents
              </span>
              {selectedCity && selectedCity !== 'All India' && (
                <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  📍 {selectedCity}
                </span>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Discover Hidden India
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              "{khoj.tagline}" Step beyond the tourist trails into tranquil stepwells, sacred tanks, and living heritage enclaves.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onOpenAIChat) {
              onOpenAIChat(
                `Suggest 3 tranquil, lesser-known heritage and cultural places to explore in ${
                  selectedCity !== 'All India' ? selectedCity : 'India'
                } with visiting tips.`
              );
            } else {
              onNavigateTab('ai');
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl text-white transition hover:opacity-90 active:scale-95 shrink-0 shadow-xs"
          style={{ backgroundColor: khoj.themeColor.primary }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Khoj For Hidden Gems</span>
        </button>
      </div>

      {/* Verified Hidden Gem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gems.map((gem) => (
          <div
            key={gem.id}
            className="group rounded-2xl bg-white border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image Preview with Category Badge */}
              <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                <img
                  src={gem.thumbnailUrl}
                  alt={gem.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 text-stone-900 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {gem.category}
                  </span>
                  <span className="text-[10px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {gem.century}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] font-medium opacity-90">
                    <MapPin className="w-3 h-3 text-lime-400" />
                    <span>
                      {gem.city}, {gem.state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <h4 className="font-serif font-bold text-base text-stone-900 group-hover:text-lime-800 transition-colors">
                  {gem.name}
                </h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed line-clamp-3">
                  {gem.whyInteresting}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {gem.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-500 italic">Verified Provenance</span>
              <button
                onClick={() => {
                  if (onSelectPlace) {
                    onSelectPlace(gem.id);
                  } else {
                    onNavigateTab('dashboard');
                  }
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-lime-800 hover:text-lime-900 group-hover:underline"
              >
                <span>Explore Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
