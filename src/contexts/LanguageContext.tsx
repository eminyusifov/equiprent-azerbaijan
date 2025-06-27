import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ru' | 'az';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.how-it-works': 'How It Works',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.account': 'Account',
    
    // Hero Section
    'hero.title': 'Equipment Rental in Baku',
    'hero.subtitle': 'Professional equipment for construction, industry, and DIY projects',
    'hero.cta': 'Find Equipment',
    'hero.search.placeholder': 'Search equipment...',
    
    // Categories
    'categories.title': 'Equipment Categories',
    'categories.construction': 'Construction',
    'categories.industrial': 'Industrial',
    'categories.diy': 'DIY Tools',
    'categories.power': 'Power Tools',
    'categories.lifting': 'Lifting Equipment',
    'categories.electrical': 'Electrical',
    
    // How It Works
    'how-it-works.title': 'How It Works',
    'how-it-works.step1.title': 'Search & Select',
    'how-it-works.step1.desc': 'Browse our catalog and find the perfect equipment for your needs',
    'how-it-works.step2.title': 'Book & Pay',
    'how-it-works.step2.desc': 'Choose your rental dates and make secure payment online',
    'how-it-works.step3.title': 'Pick Up or Delivery',
    'how-it-works.step3.desc': 'Get your equipment delivered or pick it up from our location',
    'how-it-works.step4.title': 'Use & Return',
    'how-it-works.step4.desc': 'Use professionally maintained equipment and return when done',
    
    // Equipment
    'equipment.book-now': 'Book Now',
    'equipment.per-day': 'per day',
    'equipment.specifications': 'Specifications',
    'equipment.reviews': 'Reviews',
    'equipment.available': 'Available',
    'equipment.unavailable': 'Unavailable',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.price': 'Price',
    'common.category': 'Category',
    'common.location': 'Location',
    'common.availability': 'Availability',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.catalog': 'Каталог',
    'nav.how-it-works': 'Как это работает',
    'nav.pricing': 'Цены',
    'nav.contact': 'Контакты',
    'nav.login': 'Войти',
    'nav.account': 'Аккаунт',
    
    // Hero Section
    'hero.title': 'Аренда оборудования в Баку',
    'hero.subtitle': 'Профессиональное оборудование для строительства, промышленности и DIY проектов',
    'hero.cta': 'Найти оборудование',
    'hero.search.placeholder': 'Поиск оборудования...',
    
    // Categories
    'categories.title': 'Категории оборудования',
    'categories.construction': 'Строительное',
    'categories.industrial': 'Промышленное',
    'categories.diy': 'DIY инструменты',
    'categories.power': 'Электроинструменты',
    'categories.lifting': 'Подъемное оборудование',
    'categories.electrical': 'Электрооборудование',
    
    // How It Works
    'how-it-works.title': 'Как это работает',
    'how-it-works.step1.title': 'Поиск и выбор',
    'how-it-works.step1.desc': 'Просмотрите наш каталог и найдите идеальное оборудование',
    'how-it-works.step2.title': 'Бронирование и оплата',
    'how-it-works.step2.desc': 'Выберите даты аренды и произведите безопасную оплату онлайн',
    'how-it-works.step3.title': 'Самовывоз или доставка',
    'how-it-works.step3.desc': 'Получите оборудование с доставкой или заберите из нашего офиса',
    'how-it-works.step4.title': 'Использование и возврат',
    'how-it-works.step4.desc': 'Используйте профессионально обслуживаемое оборудование',
    
    // Equipment
    'equipment.book-now': 'Забронировать',
    'equipment.per-day': 'в день',
    'equipment.specifications': 'Характеристики',
    'equipment.reviews': 'Отзывы',
    'equipment.available': 'Доступно',
    'equipment.unavailable': 'Недоступно',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.price': 'Цена',
    'common.category': 'Категория',
    'common.location': 'Местоположение',
    'common.availability': 'Доступность',
  },
  az: {
    // Navigation
    'nav.home': 'Ana səhifə',
    'nav.catalog': 'Kataloq',
    'nav.how-it-works': 'Necə işləyir',
    'nav.pricing': 'Qiymətlər',
    'nav.contact': 'Əlaqə',
    'nav.login': 'Giriş',
    'nav.account': 'Hesab',
    
    // Hero Section
    'hero.title': 'Bakıda avadanlıq icarəsi',
    'hero.subtitle': 'Tikinti, sənaye və DIY layihələri üçün peşəkar avadanlıq',
    'hero.cta': 'Avadanlıq tap',
    'hero.search.placeholder': 'Avadanlıq axtarın...',
    
    // Categories
    'categories.title': 'Avadanlıq kateqoriyaları',
    'categories.construction': 'Tikinti',
    'categories.industrial': 'Sənaye',
    'categories.diy': 'DIY alətləri',
    'categories.power': 'Elektrik alətləri',
    'categories.lifting': 'Qaldırıcı avadanlıq',
    'categories.electrical': 'Elektrik avadanlığı',
    
    // How It Works
    'how-it-works.title': 'Necə işləyir',
    'how-it-works.step1.title': 'Axtarış və seçim',
    'how-it-works.step1.desc': 'Kataloqmuza baxın və ehtiyaclarınız üçün mükəmməl avadanlıq tapın',
    'how-it-works.step2.title': 'Rezervasiya və ödəniş',
    'how-it-works.step2.desc': 'İcarə tarixlərini seçin və onlayn təhlükəsiz ödəniş edin',
    'how-it-works.step3.title': 'Götürmə və ya çatdırılma',
    'how-it-works.step3.desc': 'Avadanlığınızı çatdırın və ya bizim yerləşdiyimiz yerdən götürün',
    'how-it-works.step4.title': 'İstifadə və qaytarma',
    'how-it-works.step4.desc': 'Peşəkar şəkildə saxlanılan avadanlıqdan istifadə edin',
    
    // Equipment
    'equipment.book-now': 'İndi rezervasiya et',
    'equipment.per-day': 'gündə',
    'equipment.specifications': 'Xüsusiyyətlər',
    'equipment.reviews': 'Rəylər',
    'equipment.available': 'Mövcuddur',
    'equipment.unavailable': 'Mövcud deyil',
    
    // Common
    'common.loading': 'Yüklənir...',
    'common.search': 'Axtarış',
    'common.filter': 'Filtr',
    'common.price': 'Qiymət',
    'common.category': 'Kateqoriya',
    'common.location': 'Yer',
    'common.availability': 'Mövcudluq',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};