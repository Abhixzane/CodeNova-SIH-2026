import React from 'react';
import { GuideIllustration } from './GuideIllustrations';
import { GUIDE_CHARACTERS } from './CulturalGuideTypes';
import { Utensils, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

interface RasikaCultureGuideProps {
  selectedCity: string;
  onExploreCulture?: () => void;
  onExploreFood?: () => void;
  onExploreCrafts?: () => void;
  className?: string;
}

// Strictly isolated regional culture & culinary highlights
const CITY_CULTURAL_FOCUS: Record<
  string,
  {
    foodTitle: string;
    foodDesc: string;
    craftTitle: string;
    craftDesc: string;
  }
> = {
  mumbai: {
    foodTitle: 'Dadar Vada Pav & Malvani Seafood',
    foodDesc: 'Spiced potato batata vada in pav bread, fresh coastal bombil fry, and tangy kokum solkadhi.',
    craftTitle: 'Khotachiwadi Heritage & Parel Mills History',
    craftDesc: 'Portuguese-era timber cottages, textile mill heritage precincts, and Girgaon bronze vessel artisans.',
  },
  delhi: {
    foodTitle: 'Old Delhi Nihari, Paranthe & Daryaganj Butter Chicken',
    foodDesc: 'Slow-cooked shahi stews in Matia Mahal, Chandni Chowk stuffed paranthas, and rabri jaleba.',
    craftTitle: 'Zardozi Metallic Embroidery & Meena Kari',
    craftDesc: 'Centuries-old Mughal metallic gold thread embroidery and intricate enamel jeweler artisans.',
  },
  jaipur: {
    foodTitle: 'Dal Baati Churma & Ghevar Sweet',
    foodDesc: 'Oven-baked whole wheat baatis dipped in desi ghee with spiced panchmel dal, and honeycomb ghevar.',
    craftTitle: 'Kot Jewar Blue Pottery & Sanganer Block Prints',
    craftDesc: 'GI-tagged turquoise quartz pottery made without clay, and natural vegetable-dye Chippa block printing.',
  },
  agra: {
    foodTitle: 'Agra Angoori Petha & Mughlai Bedmi Puri',
    foodDesc: 'Translucent ash gourd confection perfected in imperial kitchens, served with spicy urad dal puris.',
    craftTitle: 'Pachhikari Pietra Dura Marble Inlay & Leather Craft',
    craftDesc: 'Direct descendants of Taj Mahal artisans embedding semi-precious lapis, malachite, and carnelian into white marble.',
  },
  varanasi: {
    foodTitle: 'Banarasi Kachori Sabzi, Tamatar Chaat & Malaiyo',
    foodDesc: 'Crispy asafoetida kachoris at sunrise, sizzling clay-pot tomato chaat, and winter saffron foam dessert.',
    craftTitle: 'Banarasi Zari Handloom Silk Weaving',
    craftDesc: 'UNESCO & GI-recognized master weavers crafting pure silver and gold electroplated brocades.',
  },
  kochi: {
    foodTitle: 'Malabar Fish Curry & Appam with Coconut Stew',
    foodDesc: 'Fresh pearl spot (karimeen) cooked in banana leaves with kokum, paired with fermented rice appams.',
    craftTitle: 'Aranmula Metal Mirror & Coir Craft',
    craftDesc: 'Ancient metallurgical bronze alloy mirrors made by a single hereditary guild, alongside coir woven craft.',
  },
};

export const RasikaCultureGuide: React.FC<RasikaCultureGuideProps> = ({
  selectedCity,
  onExploreCulture,
  onExploreFood,
  onExploreCrafts,
  className = '',
}) => {
  const rasika = GUIDE_CHARACTERS.rasika;
  const cityKey = selectedCity.toLowerCase().trim();
  const cityData = CITY_CULTURAL_FOCUS[cityKey] || {
    foodTitle: 'Authentic Regional Delicacies & Street Flavors',
    foodDesc: 'Savor regional recipes handed down through centuries of royal and village culinary traditions.',
    craftTitle: 'Living Crafts, GI Handlooms & Master Artisans',
    craftDesc: 'Explore GI-tagged textiles, terracotta pottery, and metalwork preserved by master karigars.',
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br from-orange-50/60 via-white to-stone-50/60 p-5 sm:p-6 shadow-xs ${className}`}
      style={{ borderColor: rasika.themeColor.border }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <GuideIllustration characterId="rasika" size="lg" className="self-center sm:self-auto" />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-sm font-bold text-stone-900">
              {rasika.name} ({rasika.hindiName})
            </span>
            <span
              className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: rasika.themeColor.bgLight, color: rasika.themeColor.text }}
            >
              Food, Culture & Crafts Specialist
            </span>
            {selectedCity && selectedCity !== 'All India' && (
              <span className="text-[11px] font-medium text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full">
                📍 {selectedCity} Flavors
              </span>
            )}
          </div>

          <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
            "Don't Just Visit India. Taste It. Experience It."
          </h4>

          {/* City-Specific Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3 text-left">
            <div className="p-3 bg-white rounded-xl border border-orange-200/70 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950 mb-1">
                <Utensils className="w-3.5 h-3.5 text-orange-600" />
                <span>{cityData.foodTitle}</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {cityData.foodDesc}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-orange-200/70 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950 mb-1">
                <ShoppingBag className="w-3.5 h-3.5 text-orange-600" />
                <span>{cityData.craftTitle}</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {cityData.craftDesc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            {onExploreCulture && (
              <button
                onClick={onExploreCulture}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-white shadow-xs transition hover:opacity-90 active:scale-95"
                style={{ backgroundColor: rasika.themeColor.primary }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Discover Local Culture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onExploreFood && (
              <button
                onClick={onExploreFood}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-orange-200 bg-white text-orange-900 hover:bg-orange-50 transition active:scale-95"
              >
                <Utensils className="w-3.5 h-3.5 text-orange-600" />
                <span>Regional Delicacies</span>
              </button>
            )}

            {onExploreCrafts && (
              <button
                onClick={onExploreCrafts}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-stone-500" />
                <span>GI Tagged Crafts</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
