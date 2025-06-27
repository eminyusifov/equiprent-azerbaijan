import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Equipment = Database['public']['Tables']['equipment']['Row'];
type EquipmentInsert = Database['public']['Tables']['equipment']['Insert'];
type EquipmentUpdate = Database['public']['Tables']['equipment']['Update'];

export const equipmentService = {
  // Получить все оборудование
  async getAll() {
    const { data, error } = await supabase
      .from('equipment')
      .select(`
        *,
        categories (
          id,
          name,
          name_ru,
          name_az,
          icon
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Получить оборудование по ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('equipment')
      .select(`
        *,
        categories (
          id,
          name,
          name_ru,
          name_az,
          icon
        ),
        reviews (
          id,
          rating,
          comment,
          created_at,
          profiles (
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Поиск оборудования
  async search(query: string, category?: string, available?: boolean) {
    let queryBuilder = supabase
      .from('equipment')
      .select(`
        *,
        categories (
          id,
          name,
          name_ru,
          name_az,
          icon
        )
      `);

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (category) {
      queryBuilder = queryBuilder.eq('category_id', category);
    }

    if (available !== undefined) {
      queryBuilder = queryBuilder.eq('available', available);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Создать оборудование
  async create(equipment: EquipmentInsert) {
    const { data, error } = await supabase
      .from('equipment')
      .insert(equipment)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновить оборудование
  async update(id: string, updates: EquipmentUpdate) {
    const { data, error } = await supabase
      .from('equipment')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Удалить оборудование
  async delete(id: string) {
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Проверить доступность оборудования
  async checkAvailability(equipmentId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('equipment_id', equipmentId)
      .in('status', ['confirmed', 'active'])
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

    if (error) throw error;
    return data.length === 0;
  },

  // Получить статистику оборудования
  async getStats(equipmentId: string) {
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('total_price, status')
      .eq('equipment_id', equipmentId);

    if (bookingsError) throw bookingsError;

    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('equipment_id', equipmentId);

    if (reviewsError) throw reviewsError;

    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.total_price, 0);
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    return {
      totalBookings,
      totalRevenue,
      avgRating,
      reviewCount: reviews.length
    };
  }
};
