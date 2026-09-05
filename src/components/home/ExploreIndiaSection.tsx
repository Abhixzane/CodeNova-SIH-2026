import React from 'react';
import { MapPin, ArrowRight, Compass } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface ExploreIndiaSectionProps {
  onSelectCity: (city: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const ExploreIndiaSection: React.FC<ExploreIndiaSectionProps> = ({
  onSelectCity,
  onNavigateTab,
}) => {
  const featuredCities = [
    {
      id: 'mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      description: 'UNESCO Victorian Gothic & Art Deco Ensembles, Coastal Forts & Mumbai Local lifeline.',
      tag: 'Coastal & Heritage',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'delhi',
      city: 'Delhi',
      state: 'Delhi NCT',
      description: 'Mughal citadels, Qutub Minar complex, Humayun’s Tomb, and imperial monuments.',
      tag: 'Imperial History',
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'agra',
      city: 'Agra',
      state: 'Uttar Pradesh',
      description: 'Home of the Taj Mahal, magnificent red sandstone Agra Fort & Fatehpur Sikri.',
      tag: 'UNESCO Crown',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'jaipur',
      city: 'Jaipur',
      state: 'Rajasthan',
      description: 'The walled Pink City, Amber Palace, Jantar Mantar observatory, and royal textiles.',
      tag: 'Royal Heritage',
      imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'varanasi',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      description: 'Sacred riverfront ghats along the Ganges, Sarnath Buddhist stupas, and ancient silk looms.',
      tag: 'Living Traditions',
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'kochi',
      city: 'Kochi',
      state: 'Kerala',
      description: 'Historic spice port, cantilevered Chinese fishing nets, and serene backwater canals.',
      tag: 'Spice Coast',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleCityClick = (cityName: string) => {
    onSelectCity(cityName);
    onNavigateTab('dashboard');
  };

  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Gateways</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Explore India
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1">
            Begin your journey with India’s most celebrated cultural and historic epicenters.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('dashboard')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#EFE8DF] text-xs font-semibold text-stone-800 transition self-start sm:self-auto shadow-xs"
        >
          <span>View All Destinations</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
        </button>
      </div>

      {/* Clean 6-City Discovery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featuredCities.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCityClick(item.city)}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EFE8DF] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Container with Soft Gradient */}
            <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
              <img
                src={item.imageUrl}
                alt={item.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-70" />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-stone-800 uppercase tracking-wide shadow-xs">
                {item.tag}
              </div>

              {/* City & State Overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1 text-[11px] text-amber-200 font-medium">
                  <MapPin className="w-3 h-3" />
                  <span>{item.state}</span>
                </div>
                <h3 className="font-serif text-xl font-bold tracking-tight">{item.city}</h3>
              </div>
            </div>

            {/* Description & Action */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                {item.description}
              </p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:text-amber-900">
                <span>Explore City Hub</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
