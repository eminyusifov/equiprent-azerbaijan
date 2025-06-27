export interface Equipment {
  id: string;
  name: string;
  nameRu: string;
  nameAz: string;
  category: string;
  description: string;
  descriptionRu: string;
  descriptionAz: string;
  specifications: Record<string, string>;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  image: string;
  images: string[];
  available: boolean;
  location: string;
  rating: number;
  reviewCount: number;
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  nameRu: string;
  nameAz: string;
  icon: string;
  count: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

export interface Booking {
  id: string;
  equipmentId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  deliveryOption: 'pickup' | 'delivery';
  deliveryAddress?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  equipmentId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Language {
  code: 'en' | 'ru' | 'az';
  name: string;
  flag: string;
}