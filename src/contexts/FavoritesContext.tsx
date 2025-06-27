import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Equipment } from '../types';

interface FavoritesContextType {
  favorites: Equipment[];
  addToFavorites: (equipment: Equipment) => void;
  removeFromFavorites: (equipmentId: string) => void;
  isFavorite: (equipmentId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Equipment[]>([]);

  const addToFavorites = (equipment: Equipment) => {
    setFavorites(prev => {
      if (prev.find(item => item.id === equipment.id)) {
        return prev;
      }
      return [...prev, equipment];
    });
  };

  const removeFromFavorites = (equipmentId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== equipmentId));
  };

  const isFavorite = (equipmentId: string) => {
    return favorites.some(item => item.id === equipmentId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};