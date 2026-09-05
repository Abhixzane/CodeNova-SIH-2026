import React, { useState } from 'react';
import { MapPin, Landmark, Sparkles, ArrowRight, Layers, Compass, ChevronRight } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { InteractiveMap } from '../map/InteractiveMap';
import { PlaceSummary } from '../../types';

interface ExploreByRegionSectionProps {
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectCity: (city: string) => void;
  onSelectState?: (stateId: string) => void;
  selectedCity?: string;
  places?: PlaceSummary[];
}

interface RegionInfo {
  id: string;
  stateName: string;
  hindiName: string;
  capitalCity: string;
  cityKey: string;
  region: string;
  heritageHighlights: string[];
  culture: string;
  experiences: string[];
  popularPlaces: { name: string; id: string }[];
  tagline: string;
}

export const ExploreByRegionSection: React.FC<ExploreByRegionSectionProps> = ({
  onSelectPlace,
  onNavigateTab,
  onSelectCity,
  onSelectState,
  selectedCity = 'All India',
  places,
}) => {
  const regionsData: RegionInfo[] = [
    {
      id: 'maharashtra',
      stateName: 'Maharashtra',
      hindiName: 'महाराष्ट्र',
      capitalCity: 'Mumbai',
      cityKey: 'mumbai',
      region: 'Western India',
      tagline: 'Ancient basalt cave sanctuaries, rugged Maratha hill forts & vibrant coastal port metropolis.',
      heritageHighlights: ['Elephanta Caves (UNESCO)', 'Gateway of India', 'CSMT Victorian Gothic Terminus', 'Ajanta & Ellora Caves'],
      culture: 'Lavani classical folk dance, Warli tribal art, Ganesh Utsav festivities, and coastal Koli traditions.',
      experiences: ['Marine Drive sunset promenade', 'Heritage Art Deco architectural walking trail', 'Khotachiwadi vernacular quarter walk', 'Suburban railway exploration'],
      popularPlaces: [
        { name: 'Gateway of India', id: 'gateway-of-india' },
        { name: 'Elephanta Caves', id: 'elephanta-caves' },
        { name: 'Marine Drive', id: 'marine-drive' },
      ],
    },
    {
      id: 'rajasthan',
      stateName: 'Rajasthan',
      hindiName: 'राजस्थान',
      capitalCity: 'Jaipur',
      cityKey: 'jaipur',
      region: 'Northern India',
      tagline: 'Golden desert sands, grand Rajput hill citadels, Sheesh Mahals & royal stepwells.',
      heritageHighlights: ['Amber Palace & Jaigarh Fort', 'Hawa Mahal Palace of Winds', 'Jantar Mantar Royal Observatory', 'Panna Meena ka Kund Stepwell'],
      culture: 'Ghoomar dance, Blue Pottery craft guilds, block printing, Bandhani textiles, and royal Rajput cuisine.',
      experiences: ['Amber fort elephant corridor morning view', 'Johari Bazaar gem & jewelry walk', 'Panna Meena stepwell architectural photography', 'Chokhi Dhani evening folk festival'],
      popularPlaces: [
        { name: 'Amber Palace', id: 'amber-palace' },
        { name: 'Hawa Mahal', id: 'hawa-mahal' },
        { name: 'Panna Meena Stepwell', id: 'panna-meena-stepwell' },
      ],
    },
    {
      id: 'delhi',
      stateName: 'Delhi (NCT)',
      hindiName: 'दिल्ली',
      capitalCity: 'New Delhi',
      cityKey: 'delhi',
      region: 'Northern India',
      tagline: 'Seven historic capitals layered in stone: Sultanate minarets, grand Mughal tombs & Lutyens avenues.',
      heritageHighlights: ['Qutub Minar Complex (UNESCO)', 'Humayun’s Tomb Garden Tomb', 'Red Fort Imperial Citadel', 'Agrasen ki Baoli Stepwell'],
      culture: 'Urdu shayari poetry, Nizamuddin Dargah sufi qawwali, Old Delhi Paranthe Wali Gali, and classical Ghazals.',
      experiences: ['Chandni Chowk rickshaw heritage tour', 'Sunrise walk through Lodhi Gardens', 'Sufi musical evenings in Nizamuddin', 'Mehrauli Archaeological Park exploration'],
      popularPlaces: [
        { name: 'Qutub Minar', id: 'qutub-minar' },
        { name: 'Humayuns Tomb', id: 'humayuns-tomb' },
        { name: 'Agrasen ki Baoli', id: 'agrasen-ki-baoli' },
      ],
    },
    {
      id: 'kerala',
      stateName: 'Kerala',
      hindiName: 'केरल',
      capitalCity: 'Kochi (Ernakulam)',
      cityKey: 'kochi',
      region: 'Southern India',
      tagline: 'Vibrant spice ports, colonial synagogue quarters, tranquil Vembanad lagoon channels & Ayurvedic traditions.',
      heritageHighlights: ['Mattancherry Dutch Palace', 'Paradesi Synagogue (1568)', 'Chinese Fishing Nets at Fort Kochi', 'St. Francis Church'],
      culture: 'Kathakali classical dance drama, Kalaripayattu martial arts, Onam snake boat races, and spice trading legacy.',
      experiences: ['Sunset ferry cruise across Vembanad backwaters', 'Spice market sensory tour in Mattancherry', 'Kathakali makeup ritual observation', 'Fort Kochi colonial cycling trail'],
      popularPlaces: [
        { name: 'Chinese Fishing Nets', id: 'chinese-fishing-nets' },
        { name: 'Mattancherry Palace', id: 'mattancherry-palace' },
        { name: 'Fort Kochi Beach', id: 'fort-kochi-beach' },
      ],
    },
    {
      id: 'uttar-pradesh',
      stateName: 'Uttar Pradesh',
      hindiName: 'उत्तर प्रदेश',
      capitalCity: 'Agra / Varanasi',
      cityKey: 'agra',
      region: 'Northern India',
      tagline: 'The timeless spiritual heart of India along the holy Ganga and Yamuna river basins.',
      heritageHighlights: ['Taj Mahal (UNESCO)', 'Agra Fort Red Sandstone Fortress', 'Fatehpur Sikri Imperial City', 'Kashi Vishwanath Corridor'],
      culture: 'Banarasi silk weaving & silver zari, Ganga Aarti river devotions, Awadhi royal cuisine, and Dhrupad classical music.',
      experiences: ['Sunrise wooden boat row along Varanasi Ghats', 'Twilight view of Taj Mahal from Mehtab Bagh', 'Banarasi master weaver loom demonstrations', 'Subah-e-Banaras music awakening'],
      popularPlaces: [
        { name: 'Taj Mahal', id: 'taj-mahal' },
        { name: 'Agra Fort', id: 'agra-fort' },
        { name: 'Varanasi Ghats', id: 'kashi-vishwanath-corridor' },
      ],
    },
    {
      id: 'goa',
      stateName: 'Goa',
      hindiName: 'गोवा',
      capitalCity: 'Panaji',
      cityKey: 'goa',
      region: 'Western India',
      tagline: 'Portuguese baroque cathedrals, Konkan coastal spice estates & serene golden coastline.',
      heritageHighlights: ['Basilica of Bom Jesus (UNESCO)', 'Se Cathedral', 'Aguada Portuguese Coastal Fort', 'Fontainhas Latin Quarter'],
      culture: 'Fado & Mando music, Konkani seafood culinary traditions, Azulejo ceramic tiles, and Shigmo spring carnival.',
      experiences: ['Walking tour of Fontainhas pastel lanes', 'Spice plantation trail in Ponda', 'Old Goa baroque church architectural study', 'Mandovi river sunset cruise'],
      popularPlaces: [
        { name: 'Basilica of Bom Jesus', id: 'basilica-bom-jesus' },
        { name: 'Aguada Fort', id: 'aguada-fort' },
      ],
    },
  ];

  // Default to currently selected city's state or Maharashtra
  const initialIndex = () => {
    const c = selectedCity.toLowerCase();
    const idx = regionsData.findIndex((r) => r.cityKey.toLowerCase().includes(c) || c.includes(r.cityKey.toLowerCase()));
    return idx !== -1 ? idx : 0;
  };

  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number>(initialIndex);
  const activeRegion = regionsData[selectedRegionIndex];

  const handleStateSelect = (index: number) => {
    setSelectedRegionIndex(index);
    const target = regionsData[index];
    if (onSelectCity) {
      onSelectCity(target.capitalCity.split(' ')[0]);
    }
  };

  const handleExploreStateAction = () => {
    if (onSelectState) {
      onSelectState(activeRegion.id);
    } else {
      if (onSelectCity) onSelectCity(activeRegion.capitalCity.split(' ')[0]);
      onNavigateTab('dashboard');
    }
  };

  return (
    <section className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Regional Discovery</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Explore by Region
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1">
            Discover living traditions, royal dynasties, and geographic diversity across India's vibrant states and territories.
          </p>
        </div>

        {/* Preserve the existing 36 States/UT functionality */}
        <button
          onClick={() => onNavigateTab('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-amber-900 bg-white hover:bg-amber-50 px-4 py-2 rounded-xl border border-stone-200/90 hover:border-amber-300 transition shadow-2xs self-start sm:self-auto"
        >
          <span>View All 36 States & UTs</span>
          <ChevronRight className="w-4 h-4 text-amber-700" />
        </button>
      </div>

      {/* Region/State Selection Pills (Clean & uncluttered, not a giant list of 36) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {regionsData.map((reg, idx) => {
          const isSelected = selectedRegionIndex === idx;
          return (
            <button
              key={reg.id}
              onClick={() => handleStateSelect(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-800 text-white shadow-xs scale-102'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <span>{reg.stateName}</span>
              <span className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                ({reg.region.split(' ')[0]})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Exploration Grid: Interactive Map + Selected State Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leaflet Interactive Map Viewport (Clean, light theme) */}
        <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-[#EFE8DF] shadow-warm bg-white">
          <div className="p-3.5 bg-stone-50/90 border-b border-stone-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-medium text-stone-700">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>Interactive Map: <strong className="text-stone-900">{activeRegion.capitalCity}</strong></span>
            </div>
            <span className="text-[11px] text-stone-400 font-medium">Click markers for GPS coordinates</span>
          </div>

          <div className="relative">
            <InteractiveMap
              onSelectPlace={onSelectPlace}
              selectedCity={activeRegion.capitalCity.split(' ')[0]}
              onSelectCity={onSelectCity}
              places={places}
              height="420px"
            />
          </div>
        </div>

        {/* Selected State / UT Detail Dossier */}
        <div className="lg:col-span-6 rounded-3xl bg-white border border-[#EFE8DF] p-6 sm:p-7 shadow-warm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header with State, Region & Capital */}
            <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {activeRegion.region}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    Hub: <strong className="text-stone-800">{activeRegion.capitalCity}</strong>
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 flex items-baseline gap-2">
                  <span>{activeRegion.stateName}</span>
                  <span className="text-base text-stone-400 font-normal">{activeRegion.hindiName}</span>
                </h3>
              </div>

              {/* Primary CTA: "Explore [State] →" */}
              <button
                onClick={handleExploreStateAction}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition active:scale-98 whitespace-nowrap"
              >
                <span>Explore {activeRegion.stateName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
              "{activeRegion.tagline}"
            </p>

            {/* Heritage Highlights */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-amber-700" />
                <span>Heritage Highlights</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeRegion.heritageHighlights.map((h, i) => (
                  <div key={i} className="text-xs text-stone-700 p-2 rounded-lg bg-stone-50 border border-stone-100 flex items-start gap-1.5">
                    <span className="text-amber-700 font-bold">•</span>
                    <span className="line-clamp-1">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Culture & Living Traditions */}
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Culture & Living Traditions</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/80">
                {activeRegion.culture}
              </p>
            </div>

            {/* Authentic Experiences */}
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                <span>Curated Experiences</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeRegion.experiences.map((exp, i) => (
                  <span key={i} className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md">
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* Popular Places Quick Select */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-stone-500">Key Places:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {activeRegion.popularPlaces.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => onSelectPlace(pl.id)}
                    className="text-xs font-medium text-amber-800 hover:text-amber-950 underline decoration-amber-300 hover:decoration-amber-700 transition"
                  >
                    {pl.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
