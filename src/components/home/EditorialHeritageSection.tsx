import React from 'react';
import { Landmark, ArrowRight, ShieldCheck, Box, Sparkles, MapPin } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { GuideIllustration } from '../cultural-guides/GuideIllustrations';

interface EditorialHeritageSectionProps {
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  selectedCity?: string;
}

export const EditorialHeritageSection: React.FC<EditorialHeritageSectionProps> = ({
  onSelectPlace,
  onNavigateTab,
  selectedCity = 'All India',
}) => {
  // Heritage sites database with authentic photography & architectural metadata
  const allSites = [
    {
      id: 'taj-mahal',
      name: 'Taj Mahal',
      city: 'Agra',
      state: 'Uttar Pradesh',
      era: '1632 - 1653 CE',
      style: 'Mughal Architecture',
      status: 'UNESCO World Heritage Site',
      summary: 'A pristine masterpiece of symmetrical Makrana white marble and floral pietra dura gemstone inlay, commissioned by Mughal Emperor Shah Jahan along the Yamuna riverfront.',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&auto=format&fit=crop&q=85',
      has3D: true,
      featured: true,
    },
    {
      id: 'qutub-minar',
      name: 'Qutub Minar Complex',
      city: 'New Delhi',
      state: 'Delhi (NCT)',
      era: '1192 - 1220 CE',
      style: 'Indo-Islamic Fluted Tower',
      status: 'UNESCO World Heritage Site',
      summary: 'The tallest brick minaret in the world at 72.5m, intricately fluted with Arabic epigraphy, flanked by the 4th-century rust-resistant Iron Pillar of King Chandragupta II.',
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
      has3D: false,
      featured: false,
    },
    {
      id: 'amber-palace',
      name: 'Amber Palace & Jaigarh Fort',
      city: 'Jaipur',
      state: 'Rajasthan',
      era: '1592 CE',
      style: 'Rajput & Mughal Architecture',
      status: 'UNESCO Hill Forts of Rajasthan',
      summary: 'An opulent red sandstone and marble fortress crowning the rugged Aravalli ridge, famed for the glittering Sheesh Mahal mirror mosaics that illuminate with a single lamp.',
      imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=800&auto=format&fit=crop&q=80',
      has3D: false,
      featured: false,
    },
    {
      id: 'gateway-of-india',
      name: 'Gateway of India & Elephanta Caves',
      city: 'Mumbai',
      state: 'Maharashtra',
      era: '1911 - 1924 CE / 6th Century',
      style: 'Indo-Saracenic & Rock-Cut Basalt',
      status: 'National Monument & UNESCO Enclave',
      summary: 'Mumbai’s monumental yellow basalt arch overlooking the Arabian Sea, serving as the ferry departure point for the ancient 6th-century Trimurti Sadashiva cave sanctum.',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
      has3D: true,
      featured: false,
    },
  ];

  // If a specific city is selected, prioritize that city's verified heritage site as lead
  const cityKey = selectedCity.toLowerCase().trim();
  let sites = [...allSites];
  if (cityKey.includes('delhi')) {
    sites = [allSites[1], allSites[0], allSites[2], allSites[3]];
  } else if (cityKey.includes('jaipur')) {
    sites = [allSites[2], allSites[0], allSites[1], allSites[3]];
  } else if (cityKey.includes('mumbai')) {
    sites = [allSites[3], allSites[0], allSites[1], allSites[2]];
  } else if (cityKey.includes('agra')) {
    sites = [allSites[0], allSites[1], allSites[2], allSites[3]];
  }

  const leadSite = sites[0];
  const secondarySites = sites.slice(1, 4);

  return (
    <section className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-1">
            <Landmark className="w-3.5 h-3.5" />
            <span>ASI & UNESCO Catalog</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            India Through Its Heritage
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1">
            Timeless monuments representing millennia of master craftsmanship, geometry, and stone masonry.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('heritage')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition self-start sm:self-auto active:scale-98"
        >
          <span>Explore Heritage</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Contextual Virasat Heritage Guide Introduction */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-stone-50 border border-blue-200/80 shadow-2xs">
        <div className="shrink-0">
          <GuideIllustration characterId="virasat" size="md" animated={true} popIn={true} />
        </div>
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs font-bold text-blue-950">Virasat (विरासत)</span>
            <span className="text-[10px] font-semibold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Heritage Specialist
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-2xl">
            "Every carved arch and corbelled dome holds an architectural lineage. I have cataloged over 45 ASI monuments with dynastic timelines, stone types, and virtual 3D reconstructions to help you experience their true antiquity."
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <button
              onClick={() => onNavigateTab('heritage')}
              className="text-xs font-medium text-blue-900 bg-blue-100/80 hover:bg-blue-200 px-3 py-1 rounded-lg transition"
            >
              Browse 45 Sites Catalog →
            </button>
            <button
              onClick={() => onNavigateTab('3d')}
              className="text-xs font-medium text-blue-900 bg-white border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded-lg transition flex items-center gap-1"
            >
              <Box className="w-3 h-3 text-blue-700" />
              <span>3D Virtual Artifacts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Large Visual Hierarchy Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Large Editorial Lead Feature */}
        <div
          onClick={() => onSelectPlace(leadSite.id)}
          className="lg:col-span-7 group cursor-pointer rounded-3xl bg-white border border-[#EFE8DF] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
        >
          <div className="relative h-72 sm:h-96 overflow-hidden bg-stone-100">
            <img
              src={leadSite.imageUrl}
              alt={leadSite.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-stone-900 uppercase tracking-wide shadow-xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-700" />
                <span>{leadSite.status}</span>
              </span>
              {leadSite.has3D && (
                <span className="px-2.5 py-1 rounded-full bg-blue-900/90 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wide flex items-center gap-1">
                  <Box className="w-3 h-3" />
                  <span>3D Reconstructed</span>
                </span>
              )}
            </div>

            {/* Title on Lead Image */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="text-xs text-amber-300 font-semibold mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{leadSite.city}, {leadSite.state}</span>
                <span>•</span>
                <span>{leadSite.era}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {leadSite.name}
              </h3>
            </div>
          </div>

          <div className="p-6 flex flex-col justify-between flex-1 bg-white">
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
              {leadSite.summary}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <div className="text-xs font-semibold text-stone-500">
                Style: <span className="text-stone-800 font-medium">{leadSite.style}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 group-hover:text-amber-950">
                <span>View Architectural Dossier</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Editorial Column */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          {secondarySites.map((site) => (
            <div
              key={site.id}
              onClick={() => onSelectPlace(site.id)}
              className="group cursor-pointer rounded-2xl bg-white border border-[#EFE8DF] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 p-4 flex gap-4 items-center"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-stone-100">
                <img
                  src={site.imageUrl}
                  alt={site.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {site.has3D && (
                  <div className="absolute top-1.5 left-1.5 p-1 rounded-md bg-blue-900/90 text-white">
                    <Box className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium mb-0.5">
                  <MapPin className="w-3 h-3 text-amber-700" />
                  <span>{site.city}</span>
                  <span>•</span>
                  <span>{site.era}</span>
                </div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 truncate group-hover:text-amber-900 transition-colors">
                  {site.name}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                  {site.summary}
                </p>
                <div className="mt-2 text-[11px] font-semibold text-amber-800 flex items-center gap-1">
                  <span>Inspect Monument</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
