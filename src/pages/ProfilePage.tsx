import React, { useState } from 'react';
import { User, MapPin, Sparkles, LogOut, Check, Compass, Heart, Bookmark } from 'lucide-react';
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
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-parchment-300 text-orange-400 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-charcoal">Traveler Profile</h2>
        <p className="text-xs text-charcoal-light">
          Sign in to view your personalized heritage preferences, bookmarks, and saved itineraries.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-charcoal font-bold text-xs transition shadow-md shadow-orange-500/20"
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
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Profile Header */}
      <div className="rounded-3xl bg-slate-900/60 border border-parchment-300 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 text-charcoal font-extrabold text-2xl flex items-center justify-center shadow-xl shadow-orange-500/25">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <h1 className="text-xl font-bold text-charcoal">{user.name}</h1>
          <p className="text-xs text-charcoal-light">{user.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-950 border border-parchment-300 text-charcoal-light">
              <MapPin className="w-3 h-3 text-orange-400" />
              Base Hub: {user.home_city || 'Mumbai'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 font-semibold capitalize">
              {user.travel_style?.replace('_', ' ') || 'Heritage Explorer'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-parchment-300 text-xs font-semibold text-red-400 hover:text-red-300 transition flex items-center gap-1.5 self-center sm:self-start"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => onNavigateTab('favorites')}
          className="p-5 rounded-2xl bg-parchment-100/90 border border-parchment-300 hover:border-orange-500/50 cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-charcoal-light">
            <span>Bookmarked Places</span>
            <Heart className="w-4 h-4 text-red-400 fill-red-400/20" />
          </div>
          <p className="text-2xl font-bold text-charcoal">{favorites.length}</p>
        </div>

        <div
          onClick={() => onNavigateTab('trips')}
          className="p-5 rounded-2xl bg-parchment-100/90 border border-parchment-300 hover:border-orange-500/50 cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-charcoal-light">
            <span>Saved Itineraries</span>
            <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          </div>
          <p className="text-2xl font-bold text-charcoal">View Trips →</p>
        </div>
      </div>

      {/* Edit Preferences Form */}
      <div className="rounded-3xl bg-slate-900/60 border border-parchment-300 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-charcoal flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Profile & Tourism Preferences</span>
          </h2>
          <button
            onClick={() => setIsOnboardingModalOpen(true)}
            className="text-xs text-orange-400 hover:underline font-semibold"
          >
            Re-run Survey
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-light">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-parchment-300 text-xs text-charcoal focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-light">Default Home City</label>
            <select
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-parchment-300 text-xs text-charcoal focus:outline-none focus:border-orange-500"
            >
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Kochi">Kochi</option>
              <option value="Goa">Goa</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-charcoal text-xs font-bold transition flex items-center gap-2 shadow-md shadow-orange-500/20"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Profile Updated!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
