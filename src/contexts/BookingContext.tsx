// src/contexts/BookingContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { useToast } from '../components/Toast';
import { useAuth } from './AuthContext';
import { Database } from '../types/supabase';

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  equipment?: {
    id: string;
    name: string;
    main_image: string | null;
    location: string;
    price_per_day: number;
  };
  profiles?: {
    id: string;
    name: string;
    phone: string | null;
  };
};

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

interface BookingContextType {
  // Queries
  userBookings: Booking[] | undefined;
  allBookings: Booking[] | undefined;
  bookingStats: any;
  isLoading: boolean;
  isError: boolean;
  
  // Mutations
  createBooking: (booking: BookingInsert) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
  updateBooking: (bookingId: string, updates: BookingUpdate) => Promise<void>;
  deleteBooking: (bookingId: string) => Promise<void>;
  
  // Utility functions
  getBookingById: (bookingId: string) => Booking | undefined;
  getBookingsByEquipment: (equipmentId: string) => Booking[];
  getUserBookingsCount: () => number;
  getPendingBookingsCount: () => number;
  
  // Refetch functions
  refetchUserBookings: () => void;
  refetchAllBookings: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Query для получения бронирований пользователя
  const {
    data: userBookings,
    isLoading: userBookingsLoading,
    isError: userBookingsError,
    refetch: refetchUserBookings,
  } = useQuery({
    queryKey: ['bookings', 'user', user?.id],
    queryFn: () => user?.id ? bookingService.getUserBookings(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Query для получения всех бронирований (только для админа)
  const {
    data: allBookings,
    isLoading: allBookingsLoading,
    isError: allBookingsError,
    refetch: refetchAllBookings,
  } = useQuery({
    queryKey: ['bookings', 'all'],
    queryFn: bookingService.getAll,
    enabled: isAdmin,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Query для статистики бронирований (только для админа)
  const { data: bookingStats } = useQuery({
    queryKey: ['bookings', 'stats'],
    queryFn: bookingService.getStats,
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation для создания бронирования
  const createBookingMutation = useMutation({
    mutationFn: (booking: BookingInsert) => bookingService.create(booking),
    onSuccess: (newBooking) => {
      // Обновляем кеш пользовательских бронирований
      queryClient.invalidateQueries({ queryKey: ['bookings', 'user', user?.id] });
      
      // Если админ, обновляем и общий кеш
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ['bookings', 'all'] });
        queryClient.invalidateQueries({ queryKey: ['bookings', 'stats'] });
      }
      
      // Обновляем доступность оборудования
      queryClient.invalidateQueries({ 
        queryKey: ['equipment', newBooking.equipment_id, 'availability'] 
      });
      
      showToast('success', 'Booking created successfully!');
    },
    onError: (error: any) => {
      console.error('Error creating booking:', error);
      showToast('error', error.message || 'Failed to create booking');
    },
  });

  // Mutation для обновления статуса бронирования
  const updateStatusMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: Booking['status'] }) =>
      bookingService.updateStatus(bookingId, status),
    onSuccess: (updatedBooking, { bookingId }) => {
      // Обновляем кеши
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      // Обновляем конкретное бронирование в кеше
      queryClient.setQueryData(['bookings', bookingId], updatedBooking);
      
      showToast('success', 'Booking status updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating booking status:', error);
      showToast('error', error.message || 'Failed to update booking status');
    },
  });

  // Mutation для обновления бронирования
  const updateBookingMutation = useMutation({
    mutationFn: ({ bookingId, updates }: { bookingId: string; updates: BookingUpdate }) =>
      bookingService.update(bookingId, updates),
    onSuccess: (updatedBooking, { bookingId }) => {
      // Обновляем кеши
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.setQueryData(['bookings', bookingId], updatedBooking);
      
      showToast('success', 'Booking updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating booking:', error);
      showToast('error', error.message || 'Failed to update booking');
    },
  });

  // Mutation для удаления бронирования
  const deleteBookingMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.delete(bookingId),
    onSuccess: (_, bookingId) => {
      // Удаляем из кешей
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.removeQueries({ queryKey: ['bookings', bookingId] });
      
      showToast('success', 'Booking deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting booking:', error);
      showToast('error', error.message || 'Failed to delete booking');
    },
  });

  // Wrapper functions for mutations
  const createBooking = async (booking: BookingInsert): Promise<Booking> => {
    const result = await createBookingMutation.mutateAsync(booking);
    return result;
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<void> => {
    await updateStatusMutation.mutateAsync({ bookingId, status });
  };

  const updateBooking = async (bookingId: string, updates: BookingUpdate): Promise<void> => {
    await updateBookingMutation.mutateAsync({ bookingId, updates });
  };

  const deleteBooking = async (bookingId: string): Promise<void> => {
    await deleteBookingMutation.mutateAsync(bookingId);
  };

  // Utility functions
  const getBookingById = (bookingId: string): Booking | undefined => {
    // Сначала ищем в пользовательских бронированиях
    let booking = userBookings?.find(b => b.id === bookingId);
    
    // Если не найдено и есть доступ к всем бронированиям, ищем там
    if (!booking && isAdmin && allBookings) {
      booking = allBookings.find(b => b.id === bookingId);
    }
    
    return booking;
  };

  const getBookingsByEquipment = (equipmentId: string): Booking[] => {
    const bookings = isAdmin ? allBookings : userBookings;
    return bookings?.filter(b => b.equipment_id === equipmentId) || [];
  };

  const getUserBookingsCount = (): number => {
    return userBookings?.length || 0;
  };

  const getPendingBookingsCount = (): number => {
    const bookings = isAdmin ? allBookings : userBookings;
    return bookings?.filter(b => b.status === 'pending').length || 0;
  };

  // Общий статус загрузки и ошибок
  const isLoading = userBookingsLoading || (isAdmin && allBookingsLoading);
  const isError = userBookingsError || (isAdmin && allBookingsError);

  const contextValue: BookingContextType = {
    // Data
    userBookings,
    allBookings: isAdmin ? allBookings : undefined,
    bookingStats: isAdmin ? bookingStats : undefined,
    isLoading,
    isError,
    
    // Mutations
    createBooking,
    updateBookingStatus,
    updateBooking,
    deleteBooking,
    
    // Utilities
    getBookingById,
    getBookingsByEquipment,
    getUserBookingsCount,
    getPendingBookingsCount,
    
    // Refetch
    refetchUserBookings,
    refetchAllBookings,
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// Дополнительные хуки для специфических случаев
export const useBookingById = (bookingId: string) => {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => bookingService.getById(bookingId),
    enabled: !!bookingId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useBookingsByEquipment = (equipmentId: string) => {
  return useQuery({
    queryKey: ['bookings', 'equipment', equipmentId],
    queryFn: () => bookingService.getByEquipment(equipmentId),
    enabled: !!equipmentId,
    staleTime: 1 * 60 * 1000,
  });
};
