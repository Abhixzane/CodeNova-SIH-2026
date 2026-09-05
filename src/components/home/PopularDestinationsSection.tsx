import React from 'react';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface PopularDestinationsSectionProps {
  onSelectCity: (city: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const PopularDestinationsSection: React.FC<PopularDestinationsSectionProps> = ({
  onSelectCity,
  onNavigateTab,
}) => {
  const destinations = [
    {
      city: 'Agra',
      state: 'Uttar Pradesh',
      description: "Home to iconic Mughal architecture and one of India's most celebrated heritage landscapes.",
      highlights: ['Taj Mahal', 'Agra Fort', 'Pietra Dura Inlay'],
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80',
    },
    {
      city: 'Jaipur',
      state: 'Rajasthan',
      description: "The royal Pink City of regal courtyards, astronomical observatories, and hill forts.",
      highlights: ['Amber Palace', 'Hawa Mahal', 'Block Printing'],
      imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=600&auto=format&fit=crop&q=80',
    },
    {
      city: 'Mumbai',
      state: 'Maharashtra',
      description: "Vibrant coastal metropolis where Victorian Gothic heritage meets the Arabian Sea.",
      highlights: ['Gateway of India', 'CSMT Railway', 'Elephanta Caves'],
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
    },
    {
      city: 'Kochi',
      state: 'Kerala',
      description: "Historic maritime trading port draped in spice aromas, ancient synagogues, and quiet lagoons.",
      highlights: ['Fort Kochi', 'Chinese Fishing Nets', 'Kathakali Art'],
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleCityClick = (city: string) => {
    onSelectCity(city);
    onNavigateTab('dashboard');
  };

  return (
    <section className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Signature Journeys</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Popular Destinations
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1">
            Explore carefully documented regional corridors with architectural dossiers and travel logistics.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('dashboard')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#EFE8DF] text-xs font-semibold text-stone-800 transition self-start sm:self-auto shadow-xs"
        >
          <span>All 36 States & UTs</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
        </button>
      </div>

      {/* 4 Clean Visual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {destinations.map((dest) => (
          <div
            key={dest.city}
            onClick={() => handleCityClick(dest.city)}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EFE8DF] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
          >
            {/* Visual Image */}
            <div className="relative h-44 overflow-hidden bg-stone-100">
              <img
                src={dest.imageUrl}
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-200">
                  {dest.state}
                </div>
                <h3 className="font-serif text-xl font-bold tracking-tight">
                  {dest.city}
                </h3>
              </div>
            </div>

            {/* Description & Highlights */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                "{dest.description}"
              </p>

              {/* Useful Highlights */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex flex-wrap gap-1">
                  {dest.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:text-amber-900">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
