import React from 'react';
import { Leaf, Heart, Accessibility, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { GuideIllustration } from '../cultural-guides/GuideIllustrations';

interface TravelWithPurposeSectionProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const TravelWithPurposeSection: React.FC<TravelWithPurposeSectionProps> = ({
  onNavigateTab,
}) => {
  const pillars = [
    {
      icon: Users,
      title: 'Local Experiences',
      desc: 'Connect directly with neighborhood walking guides, boatmen, and indigenous communities.',
      action: () => onNavigateTab('culture-artisans'),
      linkText: 'Community tours',
    },
    {
      icon: Heart,
      title: 'Local Artisans',
      desc: 'Support GI-tagged handloom weavers, terracotta potters, and generational karigars without middlemen.',
      action: () => onNavigateTab('culture-artisans'),
      linkText: 'Meet artisans',
    },
    {
      icon: Accessibility,
      title: 'Accessibility',
      desc: 'Verified wheelchair ramps, tactile braille markers, step-free pathways, and audio guides at historic sites.',
      action: () => onNavigateTab('facilities-accessibility'),
      linkText: 'Check facilities',
    },
    {
      icon: ShieldCheck,
      title: 'Heritage Preservation',
      desc: 'Protect fragile ancient masonry and report structural stone wear or vandalism directly to ASI.',
      action: () => onNavigateTab('reports'),
      linkText: 'Citizen audits',
    },
    {
      icon: Leaf,
      title: 'Responsible Travel',
      desc: 'Zero plastic waste near temple water kunds, low-carbon public transit, and respectful photography.',
      action: () => onNavigateTab('culture-artisans'),
      linkText: 'Ethical pledge',
    },
  ];

  return (
    <section className="pt-6 pb-4">
      {/* Visually Light Container as Requested in Prompt */}
      <div className="rounded-3xl bg-[#FAF8F5] border border-[#EFE8DF] p-6 sm:p-8 space-y-6">
        {/* Prithvi Digital Guide Integration & Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="shrink-0 p-1 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
            <GuideIllustration characterId="prithvi" size="sm" animated={true} />
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-1.5 border border-emerald-200/80">
              <Leaf className="w-3 h-3 text-emerald-700" />
              <span>Prithvi • Sustainable Stewardship</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Travel With Purpose
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mt-1 leading-relaxed">
              Every mindful step safeguards India's living monuments, empowers generational artisan guilds, and fosters inclusive, accessible discovery for everyone.
            </p>
          </div>
        </div>

        {/* 5 Core Pillars: Local experiences, Local artisans, Accessibility, Heritage preservation, Responsible travel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                onClick={p.action}
                className="group cursor-pointer p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-warm transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-xs text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800 group-hover:text-emerald-950">
                  <span>{p.linkText}</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
