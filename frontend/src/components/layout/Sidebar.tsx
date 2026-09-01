import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Map, 
  Box, 
  Sparkles, 
  CalendarDays, 
  Route, 
  Heart, 
  Luggage, 
  User, 
  Settings, 
  Moon, 
  Sun, 
  ChevronDown, 
  Crown,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
}) => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Places', icon: Compass },
    { id: 'map', label: 'Interactive Map', icon: Map },
    { id: '3d', label: '3D Explorer', icon: Box, isNew: true },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
    { id: 'itinerary', label: 'Itinerary Planner', icon: CalendarDays },
    { id: 'routes', label: 'Routes & Transport', icon: Route },
  ];

  const secondaryNav = [
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'trips', label: 'My Trips', icon: Luggage },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const cities = [
    { id: 'Mumbai', label: 'Mumbai', state: 'Maharashtra' },
    { id: 'Jaipur', label: 'Jaipur', state: 'Rajasthan' },
    { id: 'New Delhi', label: 'New Delhi', state: 'Delhi' },
    { id: 'Kochi', label: 'Kochi', state: 'Kerala' },
    { id: 'Panaji', label: 'Panaji', state: 'Goa' },
    { id: 'Shimla', label: 'Shimla', state: 'Himachal Pradesh' },
  ];

  return (
    <aside className="w-64 bg-parchment border-r border-parchment-300/80 flex flex-col h-screen sticky top-0 overflow-y-auto scrollbar-none z-30 select-none">
      {/* Brand Header */}
      <div 
        onClick={() => setActiveTab('home')}
        className="p-5 flex items-center gap-3 border-b border-parchment-300/60 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-full bg-terracotta/15 border border-sage flex items-center justify-center text-terracotta shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-parchment" />
          </div>
        </div>
        <div>
          <div className="font-extrabold text-lg text-charcoal font-['Plus_Jakarta_Sans'] tracking-tight">
            Bharat<span className="text-terracotta">Yatra</span>
          </div>
          <p className="text-[10px] text-charcoal-light -mt-0.5">
            Explore India. Experience Heritage.
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="p-3 space-y-1 flex-1">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-terracotta/15 text-terracotta border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'text-charcoal-light hover:text-charcoal hover:bg-parchment-100/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta' : 'text-charcoal-light'}`} />
                <span>{item.label}</span>
              </div>
              {item.isNew && (
                <span className="text-[10px] font-bold uppercase bg-terracotta text-slate-950 px-1.5 py-0.2 rounded-full font-mono">
                  New
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 pb-1 px-3">
          <div className="h-px bg-slate-800/80" />
        </div>

        {secondaryNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-terracotta/15 text-terracotta border border-emerald-500/30'
                  : 'text-charcoal-light hover:text-charcoal hover:bg-parchment-100/40'
              }`}
            >
              <Icon className="w-4 h-4 text-slate-500" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Section: City Selector + Pro Card + Theme Toggle */}
      <div className="p-3 border-t border-parchment-300/80 space-y-3 bg-[#060a14]">
        {/* City Selector */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-light px-1 mb-1 block">
            Select Active City
          </label>
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-parchment-100 border border-parchment-300 rounded-xl px-3 py-2 text-xs text-charcoal appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer pr-8 font-medium"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  📍 {c.label} ({c.state})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-light absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Upgrade / Travel Pass Card matching Image 2 */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0d172e] border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-charcoal">BharatYatra Pass</span>
          </div>
          <p className="text-[10px] text-charcoal-light leading-tight">
            Unlock 3D heritage views, audio guides & verified multi-modal passes.
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            className="w-full py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[11px] font-bold transition-colors border border-amber-500/30"
          >
            Explore Pass →
          </button>
        </div>

        {/* Dark Mode Toggle Switch matching Image 2 */}
        <div className="flex items-center justify-between px-2 py-1 text-xs text-charcoal-light">
          <div className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-3.5 h-3.5 text-terracotta" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-9 h-5 rounded-full p-0.5 flex items-center transition cursor-pointer ${
              isDarkMode ? 'bg-terracotta justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>
      </div>
    </aside>
  );
};
