import { z } from 'zod';

// Схема для аутентификации
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().regex(/^\+994\s\d{2}\s\d{3}\s\d{4}$/, 'Invalid phone format (+994 XX XXX XXXX)').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Схема для профиля пользователя
export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+994\s\d{2}\s\d{3}\s\d{4}$/, 'Invalid phone format (+994 XX XXX XXXX)').optional(),
});

// Схема для оборудования
export const equipmentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  nameRu: z.string().min(3, 'Russian name must be at least 3 characters'),
  nameAz: z.string().min(3, 'Azerbaijani name must be at least 3 characters'),
  categoryId: z.string().uuid('Please select a valid category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  descriptionRu: z.string().min(10, 'Russian description must be at least 10 characters'),
  descriptionAz: z.string().min(10, 'Azerbaijani description must be at least 10 characters'),
  pricePerDay: z.number().min(1, 'Price must be greater than 0'),
  pricePerWeek: z.number().min(1, 'Price must be greater than 0'),
  pricePerMonth: z.number().min(1, 'Price must be greater than 0'),
  location: z.string().min(2, 'Location is required'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  mainImage: z.string().url('Please provide a valid image URL').optional(),
  features: z.array(z.string()).default([]),
  specifications: z.record(z.string()).default({}),
  available: z.boolean().default(true),
});

// Схема для бронирования
export const bookingSchema = z.object({
  equipmentId: z.string().uuid('Invalid equipment ID'),
  startDate: z.string().refine((date) => {
    const startDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return startDate >= today;
  }, {
    message: 'Start date must be today or in the future',
  }),
  endDate: z.string(),
  deliveryOption: z.enum(['pickup', 'delivery']),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine((data) => {
  if (data.deliveryOption === 'delivery') {
    return data.deliveryAddress && data.deliveryAddress.length > 0;
  }
  return true;
}, {
  message: 'Delivery address is required for delivery option',
  path: ['deliveryAddress'],
});

// Схема для отзыва
export const reviewSchema = z.object({
  equipmentId: z.string().uuid('Invalid equipment ID'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment must be at most 1000 characters').optional(),
});

// Схема для контактной формы
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

// Схема для поиска
export const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  available: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).refine((data) => {
  if (data.priceMin !== undefined && data.priceMax !== undefined) {
    return data.priceMax >= data.priceMin;
  }
  return true;
}, {
  message: 'Maximum price must be greater than or equal to minimum price',
  path: ['priceMax'],
});

// Типы для TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type EquipmentFormData = z.infer<typeof equipmentSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
