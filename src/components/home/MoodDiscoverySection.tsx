import React from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface MoodDiscoverySectionProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectCategory?: (category: string) => void;
  onOpenHiddenIndia?: () => void;
  onSelectCity?: (city: string) => void;
}

interface MoodCategory {
  id: string;
  title: string;
  hindiTitle: string;
  tagline: string;
  imageUrl: string;
  actionType: 'tab' | 'hidden' | 'city';
  targetTab?: NavTab;
  targetCity?: string;
  badge: string;
}

export const MoodDiscoverySection: React.FC<MoodDiscoverySectionProps> = ({
  onNavigateTab,
  onOpenHiddenIndia,
  onSelectCity,
}) => {
  const categories: MoodCategory[] = [
    {
      id: 'heritage',
      title: 'Heritage',
      hindiTitle: 'विरासत',
      tagline: 'Ancient citadels, UNESCO stone temples & imperial Mughal tombs.',
      imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=800&auto=format&fit=crop&q=80',
      actionType: 'tab',
      targetTab: 'heritage',
      badge: '45 UNESCO Sites',
    },
    {
      id: 'nature',
      title: 'Nature',
      hindiTitle: 'प्रकृति',
      tagline: 'Serene backwater lagoons, spice hills & tranquil misty peaks.',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
      actionType: 'city',
      targetCity: 'Kochi',
      targetTab: 'dashboard',
      badge: 'Scenic Escapes',
    },
    {
      id: 'food-culture',
      title: 'Food & Culture',
      hindiTitle: 'स्वाद व परंपरा',
      tagline: 'Centuries of royal kitchens, coastal curries & street delicacies.',
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
      actionType: 'tab',
      targetTab: 'culture-artisans',
      badge: 'Living Flavors',
    },
    {
      id: 'hidden-india',
      title: 'Hidden India',
      hindiTitle: 'अनकहा भारत',
      tagline: 'Subterranean stepwells, quiet hamlets & prehistoric basalt pillars.',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      actionType: 'hidden',
      badge: 'Beyond the Guidebooks',
    },
    {
      id: 'arts-crafts',
      title: 'Arts & Crafts',
      hindiTitle: 'शिल्प कला',
      tagline: 'GI-tagged handlooms, cobalt blue pottery & master karigars.',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
      actionType: 'tab',
      targetTab: 'culture-artisans',
      badge: 'Artisan Guilds',
    },
    {
      id: 'festivals-events',
      title: 'Festivals & Events',
      hindiTitle: 'उत्सव व संगम',
      tagline: 'Sacred riverfront Ganga Aartis, classical dances & royal celebrations.',
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
      actionType: 'tab',
      targetTab: 'culture-artisans',
      badge: 'Sacred Gatherings',
    },
  ];

  const handleCategoryClick = (cat: MoodCategory) => {
    if (cat.actionType === 'hidden') {
      if (onOpenHiddenIndia) {
        onOpenHiddenIndia();
      } else {
        const el = document.getElementById('beyond-the-famous-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (cat.actionType === 'city' && cat.targetCity) {
      if (onSelectCity) onSelectCity(cat.targetCity);
      if (cat.targetTab) onNavigateTab(cat.targetTab);
    } else if (cat.targetTab) {
      onNavigateTab(cat.targetTab);
    }
  };

  return (
    <section className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Exploration</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            What are you in the mood for?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1">
            Choose a feeling, and let India reveal its architectural wonders, sacred celebrations, and living traditions.
          </p>
        </div>
      </div>

      {/* Six Large Visual Tiles with Authentic Imagery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EFE8DF] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Container with Soft Gradient */}
            <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
              <img
                src={cat.imageUrl}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-stone-800 uppercase tracking-wide shadow-xs">
                {cat.badge}
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-xs">
                    {cat.title}
                  </h3>
                  <span className="text-xs text-amber-200/90 font-medium">
                    {cat.hindiTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Content description & footer action */}
            <div className="p-4 flex-1 flex flex-col justify-between bg-white">
              <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-3">
                {cat.tagline}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <span className="text-xs font-semibold text-amber-800 group-hover:text-amber-950 flex items-center gap-1">
                  <span>Discover {cat.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] text-stone-400 font-medium">Verified Data</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
