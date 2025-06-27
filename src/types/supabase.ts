export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          phone: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          phone?: string | null
          avatar_url?: string | null
          is_admin?: boolean
        }
        Update: {
          name?: string
          phone?: string | null
          avatar_url?: string | null
          is_admin?: boolean
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          name_ru: string
          name_az: string
          icon: string
          created_at: string
        }
        Insert: {
          name: string
          name_ru: string
          name_az: string
          icon: string
        }
        Update: {
          name?: string
          name_ru?: string
          name_az?: string
          icon?: string
        }
      }
      equipment: {
        Row: {
          id: string
          name: string
          name_ru: string
          name_az: string
          category_id: string
          description: string
          description_ru: string
          description_az: string
          specifications: Record<string, string>
          price_per_day: number
          price_per_week: number
          price_per_month: number
          images: string[]
          main_image: string | null
          available: boolean
          location: string
          features: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          name_ru: string
          name_az: string
          category_id: string
          description: string
          description_ru: string
          description_az: string
          specifications?: Record<string, string>
          price_per_day: number
          price_per_week: number
          price_per_month: number
          images?: string[]
          main_image?: string | null
          available?: boolean
          location: string
          features?: string[]
        }
        Update: {
          name?: string
          name_ru?: string
          name_az?: string
          category_id?: string
          description?: string
          description_ru?: string
          description_az?: string
          specifications?: Record<string, string>
          price_per_day?: number
          price_per_week?: number
          price_per_month?: number
          images?: string[]
          main_image?: string | null
          available?: boolean
          location?: string
          features?: string[]
        }
      }
      bookings: {
        Row: {
          id: string
          equipment_id: string
          user_id: string
          start_date: string
          end_date: string
          total_price: number
          status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          delivery_option: 'pickup' | 'delivery'
          delivery_address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          equipment_id: string
          user_id: string
          start_date: string
          end_date: string
          total_price: number
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          delivery_option?: 'pickup' | 'delivery'
          delivery_address?: string | null
          notes?: string | null
        }
        Update: {
          equipment_id?: string
          user_id?: string
          start_date?: string
          end_date?: string
          total_price?: number
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          delivery_option?: 'pickup' | 'delivery'
          delivery_address?: string | null
          notes?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          equipment_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          equipment_id: string
          user_id: string
          rating: number
          comment?: string | null
        }
        Update: {
          rating?: number
          comment?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          equipment_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          equipment_id: string
          user_id: string
        }
        Update: never
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
