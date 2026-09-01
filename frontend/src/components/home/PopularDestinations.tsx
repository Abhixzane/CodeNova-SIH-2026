import React from 'react';
import { StateItem } from '../../types';
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
      id: 'kerala',
      name: 'Kerala',
      subtitle: "God's Own Country",
      placesCount: '128 Places',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'rajasthan',
      name: 'Rajasthan',
      subtitle: 'Land of Kings',
      placesCount: '156 Places',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'mumbai',
      name: 'Mumbai',
      subtitle: 'City of Dreams',
      placesCount: '98 Places',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
      isPrimary: true,
    },
    {
      id: 'himachal-pradesh',
      name: 'Himachal Pradesh',
      subtitle: 'Heaven on Earth',
      placesCount: '112 Places',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'goa',
      name: 'Goa',
      subtitle: 'Beach Paradise',
      placesCount: '87 Places',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal font-['Plus_Jakarta_Sans']">
            Explore Popular Destinations
          </h2>
          <p className="text-xs text-charcoal-light mt-0.5">
            Handpicked cultural capitals, scenic backwaters, and heritage states
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('explore')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:text-emerald-300 transition-colors group"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 5-Card Horizontal Carousel matching Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            onClick={() => {
              if (dest.id === 'mumbai') {
                onNavigateTab('explore');
              } else {
                onSelectState(dest.id);
              }
            }}
            className="group relative h-72 rounded-3xl overflow-hidden heritage-border heritage-shadow bg-parchment-50 border border-parchment-300/80 bg-parchment-50 cursor-pointer hover:border-sage transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
          >
            <img
              src={dest.imageUrl}
              alt={dest.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d19] via-[#080d19]/40 to-transparent" />

            {dest.isPrimary && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta text-slate-950">
                  Pilot City
                </span>
              </div>
            )}

            {/* Bottom Card Info matching Image 1 */}
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-charcoal group-hover:text-terracotta transition-colors font-['Plus_Jakarta_Sans']">
                  {dest.name}
                </h3>
              </div>
              <p className="text-xs text-charcoal-light font-medium">{dest.subtitle}</p>
              <div className="pt-1.5 flex items-center justify-between text-[11px] text-charcoal-light">
                <span>{dest.placesCount}</span>
                <span className="text-terracotta font-semibold group-hover:translate-x-0.5 transition-transform">Explore ?</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
