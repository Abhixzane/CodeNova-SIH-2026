import React, { useState } from 'react';
import { 
  Globe, 
  User, 
  Menu, 
  X,
  Search,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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
  const { user, setAuthModalOpen, isAuthenticated } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'map', label: 'Interactive Map' },
    { id: 'ai', label: 'AI Assistant' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'routes', label: 'Routes' },
    { id: '3d', label: '3D Explorer' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'trips', label: 'My Trips' },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-parchment/90 backdrop-blur-xl border-b border-parchment-300/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo matching Image 1: Green MapPin with circle + BharatYatra */}
          <div 
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-full bg-terracotta/15 border border-sage flex items-center justify-center text-terracotta group-hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20">
              <div className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-parchment" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-charcoal font-['Plus_Jakarta_Sans'] flex items-center gap-1.5">
                <span>Bharat<span className="text-terracotta">Yatra</span></span>
              </div>
              <p className="text-[10px] text-charcoal-light tracking-wider -mt-0.5">
                Explore India. Experience Heritage.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-parchment-100/60 p-1.5 rounded-full border border-parchment-300/80 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-terracotta text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                      : 'text-charcoal-light hover:text-charcoal hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area: Language + User Profile */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onSearchClick}
              className="p-2 rounded-full bg-parchment-100/80 border border-parchment-300 text-charcoal-light hover:text-terracotta hover:border-emerald-500/30 transition"
              title="Search Places (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Selector */}
            <button className="flex items-center gap-1.5 text-xs text-charcoal-light hover:text-charcoal transition-colors bg-parchment-100/80 px-3 py-1.5 rounded-full border border-parchment-300">
              <Globe className="w-3.5 h-3.5 text-terracotta" />
              <span>EN</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* User Profile Trigger */}
            {isAuthenticated ? (
              <button
                onClick={() => handleNav('profile')}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-parchment-100/80 hover:bg-slate-800 border border-parchment-300 hover:border-emerald-500/30 rounded-full transition cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-full bg-terracotta/20 text-terracotta flex items-center justify-center font-bold text-xs">
                  {user?.name.charAt(0) || 'A'}
                </div>
                <span className="text-xs font-semibold text-charcoal group-hover:text-terracotta transition">
                  {user?.name.split(' ')[0] || 'Profile'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-1.5 rounded-full bg-terracotta text-slate-950 font-bold text-xs hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={onSearchClick}
              className="p-2 rounded-xl bg-parchment-100 border border-parchment-300 text-charcoal-light"
            >
              <Search className="w-5 h-5 text-terracotta" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-parchment-100 border border-parchment-300 text-charcoal-light hover:text-charcoal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-parchment-300 bg-parchment/98 px-4 pt-3 pb-6 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-terracotta/15 text-terracotta border border-emerald-500/30'
                    : 'text-charcoal-light hover:bg-parchment-100'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
          <div className="pt-3 border-t border-parchment-300 mt-2">
            <button
              onClick={() => {
                if (isAuthenticated) handleNav('profile');
                else setAuthModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-terracotta text-slate-950 font-bold text-xs text-center"
            >
              {isAuthenticated ? `Profile (${user?.name})` : 'Sign In / Register'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
