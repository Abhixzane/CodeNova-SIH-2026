import React from 'react';
import { GuideIllustration } from './GuideIllustrations';
import { GUIDE_CHARACTERS } from './CulturalGuideTypes';
import { ShieldCheck, Heart, Sparkles, Footprints, Accessibility, ShoppingBag, ArrowRight } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface PrithviResponsibleSectionProps {
  onNavigateTab: (tab: NavTab) => void;
  className?: string;
}

export const PrithviResponsibleSection: React.FC<PrithviResponsibleSectionProps> = ({
  onNavigateTab,
  className = '',
}) => {
  const prithvi = GUIDE_CHARACTERS.prithvi;

  const pillars = [
    {
      icon: <Footprints className="w-5 h-5 text-teal-700" />,
      title: 'Mindful Heritage Steps',
      description: 'Preserve ancient sandstone and murals: touch lightly, avoid flash photography where prohibited, and stay on marked trails.',
    },
    {
      icon: <ShoppingBag className="w-5 h-5 text-teal-700" />,
      title: 'Support Artisan Guilds',
      description: 'Buy directly from certified handloom cooperatives and GI-recognized karigars, ensuring fair livelihood for living heritage crafts.',
    },
    {
      icon: <Accessibility className="w-5 h-5 text-teal-700" />,
      title: 'Accessible & Inclusive Travel',
      description: 'Look for ASI wheelchair-accessible monuments, tactile braille pathway cards, and battery-operated clean shuttles.',
    },
    {
      icon: <Heart className="w-5 h-5 text-teal-700" />,
      title: 'Honor Local Sacred Living Culture',
      description: 'Dress with respect at sanctums and ghats, participate gently in rituals, and minimize single-use plastics around water bodies.',
    },
  ];

  return (
    <section className={`relative rounded-3xl bg-gradient-to-br from-teal-50/40 via-white to-stone-50 border border-teal-200/80 p-6 sm:p-10 shadow-xs ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <GuideIllustration characterId="prithvi" size="lg" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Guide Prithvi • Responsible Tourism
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Travel Thoughtfully. Leave a Positive Footprint.
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              India’s cultural landscapes have thrived for millenia through sacred community stewardship. Join us in preserving this heritage for generations to come.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('facilities-accessibility')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl text-white shadow-xs transition hover:opacity-90 active:scale-95"
            style={{ backgroundColor: prithvi.themeColor.primary }}
          >
            <Accessibility className="w-4 h-4" />
            <span>Accessible Facilities</span>
          </button>
          <button
            onClick={() => onNavigateTab('intelligence')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-teal-200 bg-white text-teal-900 hover:bg-teal-50 transition active:scale-95"
          >
            <span>Crowd & Risk Indicators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-teal-100 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-3">
              {pillar.icon}
            </div>
            <h4 className="font-serif font-bold text-sm text-stone-900 mb-1">
              {pillar.title}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
