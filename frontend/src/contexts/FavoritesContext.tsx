import React, { createContext, useContext, useState, useEffect } from 'react';
import { FavoriteItem } from '../types';
import { api } from '../services/api';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isFavorite: (placeId: string) => boolean;
  toggleFavorite: (placeId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const refreshFavorites = async () => {
    try {
      const items = await api.getFavorites();
      setFavorites(items);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, []);

  const isFavorite = (placeId: string) => {
    return favorites.some((f) => f.place_id === placeId);
  };

  const toggleFavorite = async (placeId: string) => {
    if (isFavorite(placeId)) {
      setFavorites((prev) => prev.filter((f) => f.place_id !== placeId));
      await api.removeFavorite(placeId);
    } else {
      const newFav = await api.addFavorite(placeId);
      setFavorites((prev) => [...prev, newFav]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, refreshFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};
