import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

interface PopularDestinationsProps {
  onSelectState: (stateId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({
  onSelectState,
  onNavigateTab,
}) => {
  const destinations = [
    {
      id: 'mumbai',
      name: 'Maharashtra (Mumbai)',
      subtitle: 'Financial Hub & Gateway to UNESCO Caves',
      placesCount: '16 Verified Sites',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
      isPrimary: true,
    },
    {
      id: 'rajasthan',
      name: 'Rajasthan (Jaipur)',
      subtitle: 'Land of Maharajas, Forts & Havelis',
      placesCount: '12 Verified Sites',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'delhi',
      name: 'Delhi (NCT)',
      subtitle: 'Millennia of Empires, Red Fort & Qutub',
      placesCount: '8 Verified Sites',
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'kerala',
      name: 'Kerala (Kochi)',
      subtitle: "God's Own Country, Spice Coast & Backwaters",
      placesCount: '8 Verified Sites',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'goa',
      name: 'Goa',
      subtitle: 'Colonial Portuguese Churches & Coast',
      placesCount: '6 Verified Sites',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Top Tourism Corridors of India
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key state hubs with complete multimodal rail, road, and architectural dossiers
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <span>View All 36 States & UTs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            onClick={() => onSelectState(dest.id)}
            className="group relative h-64 rounded-xl overflow-hidden bg-white border border-slate-200 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col justify-end"
          >
            <img
              src={dest.imageUrl}
              alt={dest.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

            {dest.isPrimary && (
              <div className="absolute top-2.5 right-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                  Pilot Corridor
                </span>
              </div>
            )}

            <div className="relative p-3.5 space-y-1 text-white z-10">
              <h3 className="text-sm font-bold leading-snug group-hover:text-amber-300 transition-colors">
                {dest.name}
              </h3>
              <p className="text-[11px] text-slate-300 line-clamp-1">{dest.subtitle}</p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-300 border-t border-white/15">
                <span>{dest.placesCount}</span>
                <span className="text-amber-300 font-bold flex items-center gap-0.5">
                  Explore →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
