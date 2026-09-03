import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (placeId: string) => boolean;
  toggleFavorite: (placeId: string) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const items = await api.getFavorites();
        setFavorites(items.map((i) => i.place_id));
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, []);

  const isFavorite = (placeId: string) => favorites.includes(placeId);

  const toggleFavorite = async (placeId: string) => {
    if (isFavorite(placeId)) {
      setFavorites((prev) => prev.filter((id) => id !== placeId));
      try {
        await api.removeFavorite(placeId);
      } catch (err) {
        console.error('Failed to remove favorite:', err);
      }
    } else {
      setFavorites((prev) => [...prev, placeId]);
      try {
        await api.addFavorite(placeId);
      } catch (err) {
        console.error('Failed to add favorite:', err);
      }
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
};
