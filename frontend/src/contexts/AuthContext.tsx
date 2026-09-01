import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, OnboardingSurvey } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, homeCity?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => Promise<void>;
  saveSurvey: (survey: OnboardingSurvey) => Promise<void>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isSurveyModalOpen: boolean;
  setSurveyModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isSurveyModalOpen, setSurveyModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await api.getProfile();
        setUser(profile);
      } catch {
        setUser({
          id: 'user-default-1',
          name: 'Aman Verma',
          email: 'explorer@bharatyatra.in',
          home_city: 'Mumbai',
          preferred_language: 'English',
          is_survey_completed: true,
          survey: {
            traveler_type: 'Heritage explorer',
            trip_duration: '2-3 days',
            budget_range: 'budget',
            preferred_transport: 'mixed',
            interests: ['heritage', 'coastal', 'culture', 'photography'],
          }
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      setUser(res.profile);
      setAuthModalOpen(false);
      if (!res.profile.is_survey_completed) {
        setSurveyModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string, homeCity?: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, pass, homeCity);
      setUser(res.profile);
      setAuthModalOpen(false);
      setSurveyModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('bharat_token');
    setUser(null);
  };

  const updateProfile = async (updated: UserProfile) => {
    const res = await api.updateProfile(updated);
    setUser(res);
  };

  const saveSurvey = async (survey: OnboardingSurvey) => {
    const res = await api.saveSurvey(survey);
    setUser(res);
    setSurveyModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        saveSurvey,
        isAuthModalOpen,
        setAuthModalOpen,
        isSurveyModalOpen,
        setSurveyModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
