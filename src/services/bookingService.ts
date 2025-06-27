import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export const bookingService = {
  // Создать бронирование
  async create(booking: BookingInsert) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select(`
        *,
        equipment (
          id,
          name,
          main_image,
          price_per_day
        ),
        profiles (
          id,
          name,
          phone
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Получить бронирования пользователя
  async getUserBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        equipment (
          id,
          name,
          main_image,
          location
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Получить все бронирования (для админа)
  async getAll() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        equipment (
          id,
          name,
          main_image
        ),
        profiles (
          id,
          name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Получить бронирование по ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        equipment (
          id,
          name,
          main_image,
          location,
          price_per_day
        ),
        profiles (
          id,
          name,
          phone
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Обновить статус бронирования
  async updateStatus(id: string, status: Booking['status']) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновить бронирование
  async update(id: string, updates: BookingUpdate) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Удалить бронирование
  async delete(id: string) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Получить статистику бронирований
  async getStats() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) throw error;

    const totalBookings = data.length;
    const activeRentals = data.filter(b => b.status === 'active').length;
    const pendingBookings = data.filter(b => b.status === 'pending').length;
    const completedBookings = data.filter(b => b.status === 'completed').length;
    const totalRevenue = data
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.total_price, 0);

    return {
      totalBookings,
      activeRentals,
      pendingBookings,
      completedBookings,
      totalRevenue
    };
  },

  // Получить бронирования по оборудованию
  async getByEquipment(equipmentId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles (
          id,
          name,
          phone
        )
      `)
      .eq('equipment_id', equipmentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
