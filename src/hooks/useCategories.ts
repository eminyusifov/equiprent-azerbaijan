import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import { useToast } from '../components/Toast';
import { Database } from '../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

// Хук для получения всех категорий
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Хук для получения категории по ID
export const useCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// Хук для получения статистики категорий
export const useCategoryStats = () => {
  return useQuery({
    queryKey: ['categories', 'stats'],
    queryFn: categoryService.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Хук для создания категории (админ)
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (category: CategoryInsert) => categoryService.create(category),
    onSuccess: (newCategory) => {
      // Обновляем кеш
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      // Добавляем новую категорию в кеш
      queryClient.setQueryData(['categories', newCategory.id], newCategory);
      
      showToast('success', 'Category created successfully!');
    },
    onError: (error: any) => {
      console.error('Error creating category:', error);
      showToast('error', error.message || 'Failed to create category');
    },
  });
};

// Хук для обновления категории (админ)
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CategoryUpdate }) =>
      categoryService.update(id, updates),
    onSuccess: (updatedCategory, { id }) => {
      // Обновляем кеш
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.setQueryData(['categories', id], updatedCategory);
      
      showToast('success', 'Category updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating category:', error);
      showToast('error', error.message || 'Failed to update category');
    },
  });
};

// Хук для удаления категории (админ)
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: (_, id) => {
      // Удаляем из кеша
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.removeQueries({ queryKey: ['categories', id] });
      
      showToast('success', 'Category deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting category:', error);
      showToast('error', error.message || 'Failed to delete category');
    },
  });
};
