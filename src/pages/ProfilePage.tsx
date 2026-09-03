import React, { useState } from 'react';
import { User, MapPin, Sparkles, LogOut, Check, Compass, Heart, Bookmark, ShieldCheck, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { NavTab } from '../components/layout/Sidebar';

interface ProfilePageProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigateTab }) => {
  const { user, logout, updateProfile, setIsAuthModalOpen, setIsOnboardingModalOpen } = useAuth();
  const { favorites } = useFavorites();

  const [name, setName] = useState(user?.name || '');
  const [homeCity, setHomeCity] = useState(user?.home_city || 'Mumbai');
  const [travelStyle, setTravelStyle] = useState(user?.travel_style || 'heritage_explorer');
  const [budgetPreference, setBudgetPreference] = useState(user?.budget_preference || 'moderate');
  const [preferredTransport, setPreferredTransport] = useState(user?.preferred_transport || 'mixed');
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 text-emerald-700 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Traveler Profile</h2>
        <p className="text-xs text-slate-500">
          Sign in to view your personalized heritage preferences, bookmarks, and saved itineraries.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateProfile({
        ...user,
        name,
        home_city: homeCity,
        travel_style: travelStyle,
        budget_preference: budgetPreference,
        preferred_transport: preferredTransport,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
          {user.name ? user.name.charAt(0).toUpperCase() : 'Y'}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active Member
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">{user.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              Base Hub: {user.home_city || 'Mumbai'}
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 font-bold capitalize">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              {travelStyle?.replace('_', ' ') || 'Heritage Explorer'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 text-xs font-bold text-slate-600 hover:text-rose-600 transition flex items-center gap-1.5 self-center sm:self-start"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => onNavigateTab('favorites')}
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 cursor-pointer transition shadow-sm space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Bookmarked Places</span>
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-black text-slate-900">{favorites.length}</p>
          <p className="text-xs text-emerald-700 font-semibold">View Bookmarks →</p>
        </div>

        <div
          onClick={() => onNavigateTab('trips')}
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 cursor-pointer transition shadow-sm space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Saved Itineraries</span>
            <Bookmark className="w-5 h-5 text-orange-500 fill-orange-500/20 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-black text-slate-900">Registered</p>
          <p className="text-xs text-emerald-700 font-semibold">Manage Saved Trips →</p>
        </div>
      </div>

      {/* Edit Preferences Form */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>Traveler Preferences & Settings</span>
          </h2>
          <button
            onClick={() => setIsOnboardingModalOpen(true)}
            className="text-xs text-emerald-700 hover:underline font-bold"
          >
            Re-run Welcome Survey
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Default Home City
              </label>
              <select
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Agra">Agra</option>
                <option value="Kochi">Kochi</option>
                <option value="Varanasi">Varanasi</option>
                <option value="Goa">Goa</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Travel Style Archetype
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="heritage_explorer">Heritage Explorer (Historical Deep Dives)</option>
                <option value="fast_sightseer">Fast Sightseer (Maximum Attractions)</option>
                <option value="photographer">Photographer (Golden Hour & Architecture)</option>
                <option value="cultural_enthusiast">Cultural Enthusiast (Food, Ghats & Temples)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Preferred Transit Mode
              </label>
              <select
                value={preferredTransport}
                onChange={(e) => setPreferredTransport(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="mixed">Balanced Multi-modal (Train + Auto + Walk)</option>
                <option value="suburban_rail">Suburban Rail / Metro Enthusiast</option>
                <option value="cab">Taxi / App Cab Priority</option>
                <option value="pedestrian">Pedestrian Heritage Corridors</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Profile Saved Successfully!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
