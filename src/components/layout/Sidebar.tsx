import React from 'react';
import {
  Compass,
  MapPin,
  Map as MapIcon,
  Navigation,
  Calendar,
  Box,
  Bot,
  Bookmark,
  Heart,
  User,
  LogOut,
  LogIn,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export type NavTab = 
  | 'home'
  | 'dashboard'
  | 'map'
  | 'routes'
  | 'itinerary'
  | '3d'
  | 'ai'
  | 'trips'
  | 'favorites'
  | 'profile';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) => {
  const { user, logout, setIsAuthModalOpen } = useAuth();

  const navItems: Array<{ id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }> = [
    { id: 'home', label: 'Explore India', icon: Compass },
    { id: 'dashboard', label: 'City Hub', icon: Layers },
    { id: 'map', label: 'Interactive Map', icon: MapIcon },
    { id: 'routes', label: 'Route Studio', icon: Navigation },
    { id: 'itinerary', label: 'Day Planner', icon: Calendar },
    { id: '3d', label: '3D Heritage', icon: Box, badge: 'WebGL' },
    { id: 'ai', label: 'AI Travel Guide', icon: Bot, badge: 'AI' },
    { id: 'trips', label: 'My Trips', icon: Bookmark },
    { id: 'favorites', label: 'Saved Places', icon: Heart },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 w-64 bg-slate-950 border-r border-parchment-300 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-parchment-300 flex items-center justify-between">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-charcoal shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-charcoal block">
                Bharat<span className="text-orange-500">Yatra</span>
              </span>
              <span className="text-[10px] text-charcoal-light block">Intelligent Tourism Studio</span>
            </div>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            Platform Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                    : 'text-charcoal-light hover:text-charcoal hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* User Card / Auth */}
        <div className="p-3 border-t border-parchment-300">
          {user ? (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-parchment-300 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-charcoal truncate">{user.name}</p>
                  <p className="text-[10px] text-charcoal-light truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <button
                  onClick={() => handleNav('profile')}
                  className="text-orange-400 hover:underline"
                >
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-charcoal text-xs font-bold transition-all shadow-md shadow-orange-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
