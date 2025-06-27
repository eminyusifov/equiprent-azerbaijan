import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export const categoryService = {
  // Получить все категории
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Получить категорию по ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Создать категорию (только для админа)
  async create(category: CategoryInsert) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновить категорию (только для админа)
  async update(id: string, updates: CategoryUpdate) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Удалить категорию (только для админа)
  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Получить статистику категорий
  async getStats() {
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) throw categoriesError;

    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .select('category_id');

    if (equipmentError) throw equipmentError;

    // Подсчитываем количество оборудования в каждой категории
    const categoryStats = categories.map(category => {
      const equipmentCount = equipment.filter(eq => eq.category_id === category.id).length;
      return {
        ...category,
        equipmentCount
      };
    });

    return categoryStats;
  }
};
