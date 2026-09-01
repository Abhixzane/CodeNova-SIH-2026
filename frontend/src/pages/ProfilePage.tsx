import React, { useState } from 'react';
import { User, Mail, Sliders, LogOut, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  onNavigateHome: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigateHome }) => {
  const { user, updateProfile, logout, setSurveyModalOpen } = useAuth();
  const [name, setName] = useState(user?.name || 'Aman Verma');
  const [homeCity, setHomeCity] = useState(user?.home_city || 'Mumbai');
  const [language, setLanguage] = useState(user?.preferred_language || 'English');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await updateProfile({
        ...user,
        name,
        home_city: homeCity,
        preferred_language: language,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-parchment text-charcoal p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-parchment-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 border border-emerald-500/20 text-terracotta text-xs font-semibold mb-2">
              <User size={14} /> Account Settings
            </div>
            <h1 className="text-3xl font-extrabold text-charcoal">Traveler Profile</h1>
            <p className="text-sm text-charcoal-light mt-1">
              Manage your personal preferences, survey answers, and tourism parameters.
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              onNavigateHome();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-charcoal-light hover:text-rose-400 border border-parchment-300 text-xs font-semibold transition"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="bg-parchment-50 border border-parchment-300 rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 text-3xl font-extrabold mb-4 shadow-xl shadow-emerald-500/20">
              {name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-charcoal">{name}</h2>
            <p className="text-xs text-charcoal-light flex items-center gap-1 mt-1">
              <Mail size={12} /> {user?.email || 'explorer@bharatyatra.in'}
            </p>
            <div className="mt-4 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta border border-emerald-500/20 text-xs font-semibold">
              {user?.survey?.traveler_type || 'Heritage Explorer'}
            </div>

            <button
              onClick={() => setSurveyModalOpen(true)}
              className="w-full mt-6 py-2.5 rounded-xl bg-terracotta/10 hover:bg-terracotta/20 border border-emerald-500/30 text-terracotta text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Sliders size={14} /> Re-take Onboarding Survey
            </button>
          </div>

          {/* Edit Profile Form */}
          <div className="md:col-span-2 bg-parchment-50 border border-parchment-300 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-charcoal mb-4">Edit Profile Information</h3>

            {isSaved && (
              <div className="mb-4 p-3 rounded-xl bg-terracotta/10 border border-emerald-500/30 text-terracotta text-xs flex items-center gap-2">
                <Check size={16} /> Profile saved successfully!
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-charcoal-light mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-parchment border border-parchment-300 rounded-xl text-charcoal text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-light mb-1.5">Home City</label>
                <select
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="w-full px-4 py-3 bg-parchment border border-parchment-300 rounded-xl text-charcoal text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Kochi">Kochi</option>
                  <option value="Panaji">Panaji</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-light mb-1.5">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-parchment border border-parchment-300 rounded-xl text-charcoal text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="English">English (Primary)</option>
                  <option value="Hindi">Hindi (Beta)</option>
                  <option value="Marathi">Marathi (Beta)</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-terracotta text-slate-950 font-bold text-xs hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
