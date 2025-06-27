import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Review } from '../types';

interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getEquipmentReviews: (equipmentId: string) => Review[];
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

interface ReviewsProviderProps {
  children: ReactNode;
}

export const ReviewsProvider: React.FC<ReviewsProviderProps> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      equipmentId: '1',
      userId: '1',
      userName: 'Rashad Mammadov',
      rating: 5,
      comment: 'Excellent equipment! Very reliable and well-maintained. The delivery was on time and the staff was professional.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      equipmentId: '1',
      userId: '2',
      userName: 'Leyla Hasanova',
      rating: 4,
      comment: 'Good quality equipment. Had a minor issue but customer support resolved it quickly. Would rent again.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      equipmentId: '1',
      userId: '3',
      userName: 'Elvin Aliyev',
      rating: 5,
      comment: 'Perfect for our construction project. The equipment performed flawlessly throughout the rental period.',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const getEquipmentReviews = (equipmentId: string): Review[] => {
    return reviews.filter(review => review.equipmentId === equipmentId);
  };

  return (
    <ReviewsContext.Provider value={{
      reviews,
      addReview,
      getEquipmentReviews
    }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};