import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Landmark,
  Navigation,
  Bot,
  Utensils,
  MapPin,
  User,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  Box,
  Train,
  ShieldCheck,
  Flag,
  Activity,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';

interface TopNavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onOpenAuthModal?: () => void;
  onOpenSearch?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  onSelectCity,
  onOpenAuthModal,
  onOpenSearch,
}) => {
  const { user, logout } = useAuth();
  const isAuthenticated = Boolean(user);
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Curated cities list for instant regional switching
  const cities = ['All India', 'Mumbai', 'Delhi', 'Jaipur', 'Agra', 'Varanasi', 'Kochi', 'Goa', 'Bengaluru'];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(target)) {
        setMoreDropdownOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(target)) {
        setCityDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  // Primary top links as specified in user guidelines
  const mainNavLinks: Array<{
    id: NavTab;
    label: string;
    isActive: boolean;
  }> = [
    {
      id: 'home',
      label: 'Explore',
      isActive: activeTab === 'home',
    },
    {
      id: 'dashboard',
      label: 'Destinations',
      isActive: activeTab === 'dashboard',
    },
    {
      id: 'heritage',
      label: 'Heritage',
      isActive: activeTab === 'heritage' || activeTab === '3d',
    },
    {
      id: 'itinerary',
      label: 'Plan Trip',
      isActive: activeTab === 'itinerary' || activeTab === 'routes' || activeTab === 'mumbai-local',
    },
    {
      id: 'ai',
      label: 'AI Guide',
      isActive: activeTab === 'ai',
    },
    {
      id: 'culture-artisans',
      label: 'Experience',
      isActive: activeTab === 'culture-artisans',
    },
  ];

  // Secondary items cleanly organized under "More"
  const secondaryItems: Array<{
    id: NavTab;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'map', label: 'Interactive Map', description: 'GIS markers across all Indian regions', icon: Layers },
    { id: '3d', label: '3D Heritage Museum', description: 'Real-time WebGL architectural models', icon: Box },
    { id: 'mumbai-local', label: 'Suburban Rail', description: 'Mumbai local network, interchanges & fares', icon: Train },
    { id: 'routes', label: 'Transit & Route Studio', description: 'Multi-modal transit comparisons', icon: Navigation },
    { id: 'facilities-accessibility', label: 'Accessibility & Safety', description: 'Wheelchair audits, verified amenities', icon: ShieldCheck },
    { id: 'intelligence', label: 'Tourism Intelligence', description: 'Footfall analysis & seasonality', icon: Activity },
    { id: 'reports', label: 'Citizen Reports', description: 'Heritage condition reports and feedback', icon: Flag },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EFE8DF] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 rounded-xl p-1"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 flex items-center justify-center text-amber-200 shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-amber-200" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                  Yatra<span className="text-amber-700">Verse</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200/80 uppercase tracking-wide">
                  SIH 2026
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium tracking-wide hidden sm:block">
                Discover India • Experience Its Stories
              </span>
            </div>
          </button>

          {/* Desktop Primary Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {mainNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-150 relative ${
                  link.isActive
                    ? 'text-amber-900 bg-amber-100/70 shadow-xs'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                {link.label}
                {link.isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-700 rounded-full" />
                )}
              </button>
            ))}

            {/* Contextual More Dropdown */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-2.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-150 flex items-center gap-1 ${
                  moreDropdownOpen ||
                  ['map', 'mumbai-local', 'routes', 'facilities-accessibility', 'intelligence', 'reports'].includes(
                    activeTab
                  )
                    ? 'text-amber-900 bg-amber-100/50'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#EFE8DF] p-2 space-y-1 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Extended Tourism Tools
                  </div>
                  {secondaryItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition ${
                          isSelected
                            ? 'bg-amber-50 text-amber-900 font-semibold'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-stone-100 text-stone-600 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">{item.label}</div>
                          <div className="text-[11px] text-stone-500 line-clamp-1">{item.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Tools: City Switcher, Saved, Auth */}
          <div className="flex items-center gap-2">
            {/* City Selector Pill */}
            <div className="relative" ref={cityDropdownRef}>
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EFE8DF] hover:border-amber-300 text-xs font-semibold text-stone-800 shadow-xs transition"
                title="Filter regional content"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="max-w-[80px] truncate">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#EFE8DF] p-2 space-y-0.5 z-50 animate-fadeIn">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Select Region / City
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        onSelectCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                        selectedCity === city
                          ? 'bg-amber-50 text-amber-800 font-bold'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Places / Favorites Pill */}
            <button
              onClick={() => handleNav('favorites')}
              className={`p-2 rounded-xl text-stone-600 hover:text-stone-950 hover:bg-stone-200/50 transition relative ${
                activeTab === 'favorites' ? 'text-amber-800 bg-amber-100/60' : ''
              }`}
              title="Saved Places & Trips"
              aria-label="Saved places"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {favorites && favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-700 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Profile / Auth Button */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setProfileDropdownOpen(!profileDropdownOpen);
                  } else if (onOpenAuthModal) {
                    onOpenAuthModal();
                  } else {
                    handleNav('profile');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition ${
                  isAuthenticated
                    ? 'bg-white border-[#EFE8DF] hover:border-amber-300 text-stone-800 shadow-xs'
                    : 'bg-amber-800 hover:bg-amber-900 border-amber-800 text-white shadow-xs font-semibold text-xs'
                }`}
                title={isAuthenticated ? 'Account Profile' : 'Sign In'}
              >
                <User className="w-3.5 h-3.5" />
                <span className="text-xs font-bold hidden sm:inline-block">
                  {isAuthenticated ? user?.name?.split(' ')[0] || 'Profile' : 'Sign In'}
                </span>
              </button>

              {profileDropdownOpen && isAuthenticated && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EFE8DF] p-2 space-y-1 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900">{user?.name || 'Explorer'}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => handleNav('profile')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => handleNav('trips')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-stone-500" />
                    <span>Saved Trips & Circuits</span>
                  </button>
                  <button
                    onClick={() => handleNav('favorites')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Heart className="w-3.5 h-3.5 text-stone-500" />
                    <span>Favorite Places</span>
                  </button>
                  <div className="border-t border-stone-100 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-200/60 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EFE8DF] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-4 animate-fadeIn">
          {/* Region Switcher on Mobile */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#EFE8DF] text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-stone-700">Region:</span>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-900 border-0 focus:ring-0 cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Navigation on Mobile */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Explore India
            </div>
            {mainNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                  link.isActive
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-stone-700 hover:bg-stone-200/50'
                }`}
              >
                <span>{link.label}</span>
                {link.isActive && <span className="w-2 h-2 rounded-full bg-amber-700" />}
              </button>
            ))}
          </div>

          {/* Secondary Tools on Mobile */}
          <div className="space-y-1 pt-2 border-t border-[#EFE8DF]">
            <div className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Specialized Tools
            </div>
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition ${
                    isSelected
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-200/40 font-medium'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-700/80" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
