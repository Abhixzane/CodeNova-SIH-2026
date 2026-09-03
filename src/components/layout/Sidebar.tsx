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
  ChevronRight,
  Landmark,
  Train,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export type NavTab = 
  | 'home'
  | 'heritage'
  | 'dashboard'
  | 'map'
  | 'mumbai-local'
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

  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }> = [
    { id: 'home', label: 'Explore & Overview', icon: Compass },
    { id: 'heritage', label: '42 Heritage Sites', icon: Landmark, badge: 'UNESCO', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'dashboard', label: 'States & Hubs', icon: Layers, badge: '36 States/UTs', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { id: 'map', label: 'Interactive Map', icon: MapIcon },
    { id: 'mumbai-local', label: 'Mumbai Suburban Rail', icon: Train, badge: 'Lifeline', badgeColor: 'bg-sky-100 text-sky-800 border-sky-200' },
    { id: 'routes', label: 'Transit & Route Studio', icon: Navigation },
    { id: 'itinerary', label: 'Day Planner', icon: Calendar },
    { id: '3d', label: '3D Heritage Models', icon: Box, badge: 'WebGL', badgeColor: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 'ai', label: 'AI Travel Guide', icon: Bot, badge: 'Gemini', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { id: 'trips', label: 'My Saved Trips', icon: Bookmark },
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group w-full"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  Yatra<span className="text-emerald-600">Verse</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  SIH 2026
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium block truncate">
                Discover India • Smarter Navigation
              </span>
            </div>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
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
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${
                      item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* User Card / Auth */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          {user ? (
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                <button
                  onClick={() => handleNav('profile')}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
                >
                  Preferences
                </button>
                <button
                  onClick={logout}
                  className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Profile</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
