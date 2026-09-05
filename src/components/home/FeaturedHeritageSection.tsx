import React from 'react';
import { Landmark, ArrowRight, ShieldCheck, Clock, MapPin, Box } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { GuideIllustration } from '../cultural-guides/GuideIllustrations';

interface FeaturedHeritageSectionProps {
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const FeaturedHeritageSection: React.FC<FeaturedHeritageSectionProps> = ({
  onSelectPlace,
  onNavigateTab,
}) => {
  const heritageShowcase = [
    {
      id: 'taj-mahal',
      name: 'Taj Mahal',
      city: 'Agra',
      state: 'Uttar Pradesh',
      era: '1632 - 1653 CE',
      style: 'Mughal Architecture',
      status: 'UNESCO World Heritage Site',
      summary: 'A masterpiece of symmetrical Makrana white marble and floral pietra dura inlay, commissioned by Mughal Emperor Shah Jahan.',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
      has3D: true,
    },
    {
      id: 'qutub-minar',
      name: 'Qutub Minar Complex',
      city: 'New Delhi',
      state: 'Delhi (NCT)',
      era: '1192 - 1220 CE',
      style: 'Indo-Islamic Fluted Tower',
      status: 'UNESCO World Heritage Site',
      summary: 'The tallest brick minaret in the world, carved with fine Arabic calligraphy, flanked by the 4th-century rust-resistant Iron Pillar.',
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
      has3D: false,
    },
    {
      id: 'gateway-of-india',
      name: 'Gateway of India & Elephanta Caves',
      city: 'Mumbai',
      state: 'Maharashtra',
      era: '1911 - 1924 CE / 5th-8th Century',
      style: 'Indo-Saracenic & Rock-Cut Basalt',
      status: 'National Monument & UNESCO Enclave',
      summary: 'Mumbai’s monumental basalt arch overlooking the Arabian Sea, serving as the launch point for the ancient 6th-century Trimurti rock sculptures.',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
      has3D: true,
    },
    {
      id: 'amber-palace',
      name: 'Amber Palace & Jaigarh Fort',
      city: 'Jaipur',
      state: 'Rajasthan',
      era: '1592 CE',
      style: 'Rajput & Mughal Architecture',
      status: 'UNESCO Hill Forts of Rajasthan',
      summary: 'Opulent red sandstone and marble fortress overlooking Maota Lake, famous for the glittering Sheesh Mahal mirror mosaics.',
      imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=800&auto=format&fit=crop&q=80',
      has3D: false,
    },
  ];

  return (
    <section className="space-y-6 pt-6">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-1">
            <Landmark className="w-3.5 h-3.5" />
            <span>ASI & UNESCO Catalog</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Featured Heritage
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1">
            Timeless monuments representing millennia of master craftsmanship, geometry, and stone masonry.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('heritage')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#EFE8DF] text-xs font-semibold text-stone-800 transition self-start sm:self-auto shadow-xs"
        >
          <span>Explore All 45 Sites</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
        </button>
      </div>

      {/* Virasat Guide Editorial Introduction */}
      <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-white to-stone-50 border border-blue-200/80 shadow-2xs">
        <GuideIllustration characterId="virasat" size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-950">Virasat (विरासत)</span>
            <span className="text-[10px] font-semibold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
              Heritage Specialist
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">
            "Discover the story behind every monument. Every carved stone and vaulted arch tells a chapter of India's five-millennia civilization."
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('heritage')}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white transition shrink-0 hidden sm:inline-flex items-center gap-1"
        >
          <span>UNESCO Archive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Large Editorial Heritage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {heritageShowcase.map((site) => (
          <div
            key={site.id}
            onClick={() => onSelectPlace(site.id)}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EFE8DF] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col sm:flex-row"
          >
            {/* Monument Image with Proportional Aspect */}
            <div className="relative sm:w-2/5 h-56 sm:h-auto overflow-hidden bg-stone-100 shrink-0">
              <img
                src={site.imageUrl}
                alt={site.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-stone-900/40 via-transparent to-transparent" />

              {site.has3D && (
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-stone-900/85 text-amber-300 backdrop-blur-md text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-xs">
                  <Box className="w-3 h-3" />
                  <span>3D Model</span>
                </div>
              )}
            </div>

            {/* Editorial Content */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-amber-700" />
                    {site.status}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {site.era}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                  {site.name}
                </h3>

                <div className="flex items-center gap-1 text-xs text-stone-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{site.city}, {site.state}</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {site.summary}
                </p>
              </div>

              {/* Call to Action Link */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:text-amber-900">
                <span>Explore Heritage Dossier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
