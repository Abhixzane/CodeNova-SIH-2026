import React, { useState } from 'react';
import { Utensils, Sparkles, ArrowRight, Tag, Heart } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { GuideIllustration } from '../cultural-guides/GuideIllustrations';

interface CulturalExperiencesSectionProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const CulturalExperiencesSection: React.FC<CulturalExperiencesSectionProps> = ({
  onNavigateTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<'crafts' | 'food' | 'culture' | 'festivals' | 'experiences'>('crafts');

  const categories = [
    { id: 'crafts', label: 'Crafts & Artisans', icon: '🎨' },
    { id: 'food', label: 'Culinary Traditions', icon: '🍲' },
    { id: 'culture', label: 'Living Heritage', icon: '🪕' },
    { id: 'festivals', label: 'Festivals', icon: '✨' },
    { id: 'experiences', label: 'Local Experiences', icon: '🚶' },
  ] as const;

  const experienceData: Record<typeof activeCategory, Array<{
    title: string;
    region: string;
    badge?: string;
    description: string;
    imageUrl: string;
  }>> = {
    crafts: [
      {
        title: 'Banarasi Silk Brocades & Zari',
        region: 'Varanasi, Uttar Pradesh',
        badge: 'GI Tagged Craft',
        description: 'Handwoven gold and silver metallic threads crafted on pit-looms by 5th-generation master weavers.',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Jaipur Blue Pottery',
        region: 'Jaipur, Rajasthan',
        badge: 'GI Tagged Craft',
        description: 'Traditional Egyptian paste pottery painted with cobalt blue dyes and floral Persian motifs without clay.',
        imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Kolhapuri Leather Craftsmanship',
        region: 'Kolhapur, Maharashtra',
        badge: 'GI Tagged Heritage',
        description: 'Vegetable-tanned buffalo leather slippers hand-braided with cords and zero chemical adhesives.',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
      },
    ],
    food: [
      {
        title: 'Authentic Maharashtrian Vada Pav & Misal',
        region: 'Mumbai & Pune',
        badge: 'Iconic Street Fare',
        description: 'Crisp spiced potato fritters served inside pav with dry garlic coconut chutney and fiery kat broth.',
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Awadhi Dum Cooking & Galouti',
        region: 'Lucknow & Delhi',
        badge: 'Mughal Culinary Arts',
        description: 'Slow sealed handi cooking with over 20 roasted aromatic spices tenderizing heritage recipes.',
        imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Malabar Spiced Fish Curry & Appam',
        region: 'Kochi, Kerala',
        badge: 'Coastal Delicacy',
        description: 'Fermented rice bowl hoppers paired with tangy kokum and coconut milk coastal curries.',
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      },
    ],
    culture: [
      {
        title: 'Kathakali Dance Drama',
        region: 'Kerala',
        badge: 'Classical Art Form',
        description: 'Spectacular facial expressions (Navarasas), heavy makeup, and detailed gestures depicting epics.',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Vedic Chanting of the Ganges',
        region: 'Varanasi',
        badge: 'UNESCO Intangible Heritage',
        description: 'Sacred twilight Aarti ceremonies with towering brass multi-tiered fire lamps along Dashashwamedh.',
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Rajasthani Puppet Theater (Kathputli)',
        region: 'Jaipur & Jodhpur',
        badge: 'Folk Tradition',
        description: 'Carved wood marionettes draped in bright bandhani fabrics enacting legendary warrior ballads.',
        imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=600&auto=format&fit=crop&q=80',
      },
    ],
    festivals: [
      {
        title: 'Ganesh Chaturthi Cultural Processions',
        region: 'Maharashtra',
        badge: 'State Festival',
        description: 'Vibrant 10-day community celebrations marked by rhythmic dhol-tasha pathaks and coastal immersions.',
        imageUrl: 'https://images.unsplash.com/photo-1567591414240-e18e95c1815d?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Pushkar Camel & Heritage Fair',
        region: 'Rajasthan',
        badge: 'Desert Gathering',
        description: 'One of the world’s largest camel and livestock gatherings under the November Kartik Purnima moon.',
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Dev Deepawali on the Ghats',
        region: 'Varanasi',
        badge: 'Festival of Lights',
        description: 'Over one million earthen oil diyas illuminated along 84 historic stone ghats facing the holy river.',
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80',
      },
    ],
    experiences: [
      {
        title: 'Mumbai Victorian Heritage Architecture Walk',
        region: 'Fort & Ballard Estate, Mumbai',
        badge: 'Guided Walking Tour',
        description: 'Step into colonial stone façades, hidden gothic gargoyles, and old book markets of South Bombay.',
        imageUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Dawn Rowing Tour Along the Ganges',
        region: 'Varanasi Ghats',
        badge: 'Spiritual Excursion',
        description: 'Silent early-morning boat glide passing ancient stone palaces bathed in the golden morning light.',
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Heritage Master Artisan Guild Workshop',
        region: 'Kochi & Jaipur',
        badge: 'Hands-on Learning',
        description: 'Try block carving and hand-spinning directly in master artisan studio enclaves.',
        imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
      },
    ],
  };

  const currentItems = experienceData[activeCategory];

  return (
    <section className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Living Traditions</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Experience India
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1">
            Immerse yourself in authentic indigenous crafts, age-old recipes, and master artisan communities.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('culture-artisans')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#EFE8DF] text-xs font-semibold text-stone-800 transition self-start sm:self-auto shadow-xs"
        >
          <span>Explore All Experiences</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
        </button>
      </div>

      {/* Rasika Guide Introduction */}
      <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-50/70 via-white to-stone-50 border border-orange-200/80 shadow-2xs">
        <GuideIllustration characterId="rasika" size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-950">Rasika (रसिका)</span>
            <span className="text-[10px] font-semibold bg-orange-100 text-orange-900 px-2 py-0.5 rounded-full">
              Food & Culture Connoisseur
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">
            "Don't just visit India. Taste it. Experience it. From centuries-old spice blends to master weaver looms, discover India through its living flavors and crafts."
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('culture-artisans')}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-orange-700 hover:bg-orange-800 text-white transition shrink-0 hidden sm:inline-flex items-center gap-1"
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Local Delicacies</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeCategory === cat.id
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-[#EFE8DF]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 3 Featured Cards for Current Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {currentItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onNavigateTab('culture-artisans')}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EFE8DF] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden bg-stone-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />

              {item.badge && (
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-stone-800 shadow-xs">
                  {item.badge}
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold">
                {item.region}
              </div>
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:text-amber-900">
                <span>View Dossier & Artisans</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
