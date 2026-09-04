import React, { useState } from 'react';
import { X, Mail, Lock, User, MapPin, Loader2, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [homeCity, setHomeCity] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register(name, email, password, homeCity);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/25 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsAuthModalOpen(false);
        }
      }}
    >
      <div
        id="auth-modal"
        className="relative w-full max-w-md rounded-3xl bg-[#FFFDF8] border border-[#D8D2C8] p-6 sm:p-8 shadow-xl space-y-6 overflow-hidden"
      >
        {/* Close button with charcoal/gray tone */}
        <button
          id="auth-modal-close-btn"
          onClick={() => setIsAuthModalOpen(false)}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-[#6B6B6B] hover:text-[#252525] hover:bg-[#F7F3EA] border border-transparent hover:border-[#D8D2C8] transition focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F3EA] border border-[#D8D2C8] text-[#252525] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>BharatYatra • Heritage & Transit Portal</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#252525] tracking-tight">
            {isRegister ? 'Create BharatYatra Account' : 'Welcome Back'}
          </h2>

          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
            {isRegister
              ? 'Save itineraries, bookmark heritage sites, and customize travel routes.'
              : 'Sign in to access your saved trips, favorites, and personalized guides.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form id="auth-modal-form" onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-name-input"
                className="text-[11px] font-bold text-[#252525] uppercase tracking-wider block"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#6B6B6B]" />
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#D8D2C8] text-xs text-[#252525] placeholder-[#8E8E93] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="auth-email-input"
              className="text-[11px] font-bold text-[#252525] uppercase tracking-wider block"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#6B6B6B]" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#D8D2C8] text-xs text-[#252525] placeholder-[#8E8E93] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="auth-password-input"
              className="text-[11px] font-bold text-[#252525] uppercase tracking-wider block"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#6B6B6B]" />
              <input
                id="auth-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#D8D2C8] text-xs text-[#252525] placeholder-[#8E8E93] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
              />
              <button
                id="auth-toggle-password-btn"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 rounded-lg text-[#6B6B6B] hover:text-[#252525] transition"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-home-city-select"
                className="text-[11px] font-bold text-[#252525] uppercase tracking-wider block"
              >
                Home City (Base Hub)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#6B6B6B] pointer-events-none" />
                <select
                  id="auth-home-city-select"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#D8D2C8] text-xs text-[#252525] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition cursor-pointer"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Agra">Agra</option>
                  <option value="Varanasi">Varanasi</option>
                  <option value="Kochi">Kochi</option>
                  <option value="Goa">Goa</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Amritsar">Amritsar</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>
            </div>
          )}

          {/* Sign In / Sign Up Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <span>{isRegister ? 'Sign Up & Continue' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Toggle Login/Register Mode */}
        <div className="text-center pt-2 border-t border-[#D8D2C8]/60">
          <p className="text-xs text-[#6B6B6B]">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  id="auth-switch-mode-btn"
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError(null);
                  }}
                  className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2 transition ml-1"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  id="auth-switch-mode-btn"
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError(null);
                  }}
                  className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2 transition ml-1"
                >
                  Create one
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
