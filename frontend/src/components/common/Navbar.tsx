import React, { useState } from 'react';
import { 
  Compass, 
  Map, 
  Box, 
  Sparkles, 
  Route, 
  CalendarDays, 
  Search, 
  Menu, 
  X,
  MapPin
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSearchClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'map', label: 'India Map', icon: Map },
    { id: '3d', label: '3D Heritage', icon: Box },
    { id: 'routes', label: 'Route Studio', icon: Route },
    { id: 'itinerary', label: 'Itinerary Planner', icon: CalendarDays },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 heritage-border heritage-shadow bg-parchment-50 border-b border-parchment-300/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-orange-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-charcoal font-['Plus_Jakarta_Sans']">
                  Code<span className="text-orange-500">Nova</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-400 border border-terracotta/30 px-1.5 py-0.5 rounded">
                  SIH '26
                </span>
              </div>
              <p className="text-[10px] text-charcoal-light -mt-0.5 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-orange-400" />
                Mumbai Pilot & India Tourism
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-orange-500/15 text-orange-400 border border-terracotta/30 shadow-sm shadow-orange-500/10'
                      : 'text-charcoal-light hover:text-charcoal hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-charcoal-light'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Search Trigger & SIH Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onSearchClick}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-parchment-100 border border-parchment-300 text-charcoal-light hover:text-charcoal hover:border-parchment-300 transition-all text-xs"
            >
              <Search className="w-3.5 h-3.5 text-orange-400" />
              <span>Search Mumbai & India...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-charcoal-light rounded border border-parchment-300">?K</kbd>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onSearchClick}
              className="p-2 rounded-xl bg-parchment-100 border border-parchment-300 text-charcoal-light hover:text-charcoal"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-orange-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-parchment-100 border border-parchment-300 text-charcoal-light hover:text-charcoal"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-parchment-300 bg-slate-950/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-orange-500/15 text-orange-400 border border-terracotta/30'
                    : 'text-charcoal-light hover:bg-parchment-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-charcoal-light'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
