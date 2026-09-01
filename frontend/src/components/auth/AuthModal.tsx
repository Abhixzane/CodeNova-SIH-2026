import React, { useState } from 'react';
import { X, Lock, Mail, User, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, login, register, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeCity, setHomeCity] = useState('Mumbai');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        await register(name, email, password, homeCity);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-parchment-50 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-charcoal-light hover:text-charcoal hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-terracotta/10 border border-emerald-500/20 text-terracotta mb-3">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-bold text-charcoal">
            {isSignUp ? 'Join BharatYatra' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-charcoal-light mt-1">
            {isSignUp ? 'Create your account to unlock personalized heritage itineraries' : 'Sign in to access your saved trips and travel favorites'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-charcoal-light mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aman Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-parchment border border-parchment-300/80 rounded-xl text-charcoal text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-charcoal-light mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-parchment border border-parchment-300/80 rounded-xl text-charcoal text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-light mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-parchment border border-parchment-300/80 rounded-xl text-charcoal text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Create BharatYatra Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-charcoal-light">
          {isSignUp ? (
            <span>Already have an account? <button type="button" onClick={() => setIsSignUp(false)} className="text-terracotta font-semibold hover:underline">Sign In</button></span>
          ) : (
            <span>New to BharatYatra? <button type="button" onClick={() => setIsSignUp(true)} className="text-terracotta font-semibold hover:underline">Create Account</button></span>
          )}
        </div>
      </div>
    </div>
  );
};
