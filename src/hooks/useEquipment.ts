// src/hooks/useEquipment.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService } from '../services/equipmentService';
import { useToast } from '../components/Toast';
import { Database } from '../types/supabase';

type Equipment = Database['public']['Tables']['equipment']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'];
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles: { name: string } | null;
  }>;
};

type EquipmentInsert = Database['public']['Tables']['equipment']['Insert'];
type EquipmentUpdate = Database['public']['Tables']['equipment']['Update'];

// Хук для получения всего оборудования
export const useEquipment = () => {
  return useQuery({
    queryKey: ['equipment'],
    queryFn: equipmentService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Хук для получения оборудования по ID
export const useEquipmentById = (id: string) => {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: () => equipmentService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для поиска оборудования
export const useEquipmentSearch = (query: string, category?: string, available?: boolean) => {
  return useQuery({
    queryKey: ['equipment', 'search', query, category, available],
    queryFn: () => equipmentService.search(query, category, available),
    enabled: query.length > 0 || !!category || available !== undefined,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Хук для создания оборудования (админ)
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (equipment: EquipmentInsert) => equipmentService.create(equipment),
    onSuccess: (newEquipment) => {
      // Обновляем кеш
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      
      // Добавляем новое оборудование в кеш
      queryClient.setQueryData(['equipment', newEquipment.id], newEquipment);
      
      showToast('success', 'Equipment created successfully!');
    },
    onError: (error: any) => {
      console.error('Error creating equipment:', error);
      showToast('error', error.message || 'Failed to create equipment');
    },
  });
};

// Хук для обновления оборудования (админ)
export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: EquipmentUpdate }) =>
      equipmentService.update(id, updates),
    onSuccess: (updatedEquipment, { id }) => {
      // Обновляем кеш
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.setQueryData(['equipment', id], updatedEquipment);
      
      showToast('success', 'Equipment updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating equipment:', error);
      showToast('error', error.message || 'Failed to update equipment');
    },
  });
};

// Хук для удаления оборудования (админ)
export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => equipmentService.delete(id),
    onSuccess: (_, id) => {
      // Удаляем из кеша
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.removeQueries({ queryKey: ['equipment', id] });
      
      showToast('success', 'Equipment deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting equipment:', error);
      showToast('error', error.message || 'Failed to delete equipment');
    },
  });
};

// Хук для проверки доступности оборудования
export const useEquipmentAvailability = (equipmentId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['equipment', equipmentId, 'availability', startDate, endDate],
    queryFn: () => equipmentService.checkAvailability(equipmentId, startDate, endDate),
    enabled: !!(equipmentId && startDate && endDate),
    staleTime: 30 * 1000, // 30 seconds - availability changes frequently
  });
};

// Хук для получения статистики оборудования
export const useEquipmentStats = (equipmentId: string) => {
  return useQuery({
    queryKey: ['equipment', equipmentId, 'stats'],
    queryFn: () => equipmentService.getStats(equipmentId),
    enabled: !!equipmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Предзагрузка популярного оборудования
export const usePrefetchPopularEquipment = () => {
  const queryClient = useQueryClient();

  const prefetchPopular = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['equipment', 'popular'],
      queryFn: async () => {
        const allEquipment = await equipmentService.getAll();
        // Сортируем по рейтингу и количеству отзывов
        return allEquipment
          .sort((a, b) => {
            const aScore = (a.reviews?.length || 0) * 0.1 + ((a.reviews?.reduce((sum, r) => sum + r.rating, 0) || 0) / (a.reviews?.length || 1));
            const bScore = (b.reviews?.length || 0) * 0.1 + ((b.reviews?.reduce((sum, r) => sum + r.rating, 0) || 0) / (b.reviews?.length || 1));
            return bScore - aScore;
          })
          .slice(0, 12); // Топ 12
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  return { prefetchPopular };
};
