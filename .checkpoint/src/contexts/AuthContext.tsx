import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, OnboardingSurvey } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, home_city?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => Promise<void>;
  saveSurvey: (survey: OnboardingSurvey) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('bharat_token');
        if (token) {
          const profile = await api.getProfile();
          setUser(profile);
        }
      } catch (err) {
        console.error('Session restore failed:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.profile);
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password: string, home_city?: string) => {
    const res = await api.register(name, email, password, home_city);
    setUser(res.profile);
    setIsAuthModalOpen(false);
    setIsOnboardingModalOpen(true);
  };

  const logout = () => {
    localStorage.removeItem('bharat_token');
    setUser(null);
  };

  const updateProfile = async (profile: UserProfile) => {
    const updated = await api.updateProfile(profile);
    setUser(updated);
  };

  const saveSurvey = async (survey: OnboardingSurvey) => {
    const updated = await api.saveSurvey(survey);
    setUser(updated);
    setIsOnboardingModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        saveSurvey,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOnboardingModalOpen,
        setIsOnboardingModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
