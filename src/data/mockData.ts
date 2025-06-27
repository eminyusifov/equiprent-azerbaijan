import { Equipment, Category } from '../types';

export const categories: Category[] = [
  {
    id: 'construction',
    name: 'Construction',
    nameRu: 'Строительное',
    nameAz: 'Tikinti',
    icon: 'HardHat',
    count: 24
  },
  {
    id: 'industrial',
    name: 'Industrial',
    nameRu: 'Промышленное',
    nameAz: 'Sənaye',
    icon: 'Factory',
    count: 18
  },
  {
    id: 'diy',
    name: 'DIY Tools',
    nameRu: 'DIY инструменты',
    nameAz: 'DIY alətləri',
    icon: 'Wrench',
    count: 32
  },
  {
    id: 'power',
    name: 'Power Tools',
    nameRu: 'Электроинструменты',
    nameAz: 'Elektrik alətləri',
    icon: 'Zap',
    count: 28
  },
  {
    id: 'lifting',
    name: 'Lifting Equipment',
    nameRu: 'Подъемное оборудование',
    nameAz: 'Qaldırıcı avadanlıq',
    icon: 'Crane',
    count: 12
  },
  {
    id: 'electrical',
    name: 'Electrical',
    nameRu: 'Электрооборудование',
    nameAz: 'Elektrik avadanlığı',
    icon: 'Lightbulb',
    count: 15
  }
];

// Create a global equipment array that can be modified
export let equipment: Equipment[] = [
  {
    id: '1',
    name: 'Mini Excavator CAT 301.7D',
    nameRu: 'Мини-экскаватор CAT 301.7D',
    nameAz: 'Mini ekskavator CAT 301.7D',
    category: 'construction',
    description: 'Compact excavator perfect for small construction projects and landscaping work.',
    descriptionRu: 'Компактный экскаватор, идеальный для небольших строительных проектов и ландшафтных работ.',
    descriptionAz: 'Kiçik tikinti layihələri və landşaft işləri üçün mükəmməl kompakt ekskavator.',
    specifications: {
      'Operating Weight': '1,700 kg',
      'Engine Power': '13.5 kW',
      'Bucket Capacity': '0.025 m³',
      'Max Dig Depth': '2.4 m'
    },
    pricePerDay: 150,
    pricePerWeek: 900,
    pricePerMonth: 3500,
    image: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
    images: [
      'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
      'https://images.pexels.com/photos/162568/construction-site-build-construction-work-162568.jpeg'
    ],
    available: true,
    location: 'Baku Center',
    rating: 4.8,
    reviewCount: 24,
    features: ['GPS Tracking', 'Fuel Efficient', 'Easy Operation']
  },
  {
    id: '2',
    name: 'Tower Crane 80T',
    nameRu: 'Башенный кран 80Т',
    nameAz: 'Qüllə kraní 80T',
    category: 'lifting',
    description: 'Heavy-duty tower crane for large construction projects with excellent lifting capacity.',
    descriptionRu: 'Тяжелый башенный кран для крупных строительных проектов с отличной грузоподъемностью.',
    descriptionAz: 'Böyük tikinti layihələri üçün əla qaldırma qabiliyyəti olan ağır qüllə kraní.',
    specifications: {
      'Max Load': '8,000 kg',
      'Jib Length': '60 m',
      'Hook Height': '180 m',
      'Power': '380V'
    },
    pricePerDay: 800,
    pricePerWeek: 5000,
    pricePerMonth: 18000,
    image: 'https://images.pexels.com/photos/236698/pexels-photo-236698.jpeg',
    images: [
      'https://images.pexels.com/photos/236698/pexels-photo-236698.jpeg',
      'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg'
    ],
    available: true,
    location: 'Baku Port',
    rating: 4.9,
    reviewCount: 12,
    features: ['Professional Operator', 'Safety Systems', 'Remote Control']
  },
  {
    id: '3',
    name: 'Industrial Generator 100kW',
    nameRu: 'Промышленный генератор 100кВт',
    nameAz: 'Sənaye generatoru 100kW',
    category: 'industrial',
    description: 'Reliable industrial generator for continuous power supply during construction or events.',
    descriptionRu: 'Надежный промышленный генератор для непрерывного электроснабжения во время строительства или мероприятий.',
    descriptionAz: 'Tikinti və ya tədbirlər zamanı davamlı enerji təchizatı üçün etibarlı sənaye generatoru.',
    specifications: {
      'Power Output': '100 kW',
      'Fuel Type': 'Diesel',
      'Fuel Consumption': '22 L/h',
      'Noise Level': '65 dB'
    },
    pricePerDay: 120,
    pricePerWeek: 700,
    pricePerMonth: 2800,
    image: 'https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg',
    images: [
      'https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg'
    ],
    available: true,
    location: 'Sumgayit',
    rating: 4.7,
    reviewCount: 18,
    features: ['Auto Start', 'Weather Protection', '24/7 Support']
  },
  {
    id: '4',
    name: 'Professional Drill Set',
    nameRu: 'Профессиональный набор дрелей',
    nameAz: 'Peşəkar qazma dəsti',
    category: 'power',
    description: 'Complete set of professional drills and bits for various construction and DIY projects.',
    descriptionRu: 'Полный набор профессиональных дрелей и сверл для различных строительных и DIY проектов.',
    descriptionAz: 'Müxtəlif tikinti və DIY layihələri üçün peşəkar qazma və ucluqların tam dəsti.',
    specifications: {
      'Battery': '18V Li-ion',
      'Chuck Size': '13mm',
      'Torque': '60 Nm',
      'Drill Bits': '50 pieces'
    },
    pricePerDay: 25,
    pricePerWeek: 140,
    pricePerMonth: 500,
    image: 'https://images.pexels.com/photos/5691642/pexels-photo-5691642.jpeg',
    images: [
      'https://images.pexels.com/photos/5691642/pexels-photo-5691642.jpeg'
    ],
    available: true,
    location: 'Baku Center',
    rating: 4.6,
    reviewCount: 32,
    features: ['Cordless', 'LED Light', 'Carrying Case']
  },
  {
    id: '5',
    name: 'Concrete Mixer 350L',
    nameRu: 'Бетономешалка 350Л',
    nameAz: 'Beton qarışdırıcısı 350L',
    category: 'construction',
    description: 'Electric concrete mixer perfect for medium-scale construction projects.',
    descriptionRu: 'Электрическая бетономешалка, идеальная для строительных проектов среднего масштаба.',
    descriptionAz: 'Orta miqyaslı tikinti layihələri üçün mükəmməl elektrik beton qarışdırıcısı.',
    specifications: {
      'Capacity': '350 L',
      'Motor Power': '2.2 kW',
      'Mixing Time': '3-5 min',
      'Weight': '180 kg'
    },
    pricePerDay: 45,
    pricePerWeek: 250,
    pricePerMonth: 950,
    image: 'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg',
    images: [
      'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg'
    ],
    available: false,
    location: 'Ganja',
    rating: 4.5,
    reviewCount: 15,
    features: ['Electric Motor', 'Easy Transport', 'Quick Setup']
  },
  {
    id: '6',
    name: 'Welding Equipment Set',
    nameRu: 'Набор сварочного оборудования',
    nameAz: 'Qaynaq avadanlığı dəsti',
    category: 'electrical',
    description: 'Professional welding equipment with all necessary accessories for metal work.',
    descriptionRu: 'Профессиональное сварочное оборудование со всеми необходимыми принадлежностями для работы с металлом.',
    descriptionAz: 'Metal işləri üçün bütün lazımi aksesuarları olan peşəkar qaynaq avadanlığı.',
    specifications: {
      'Current': '200A',
      'Voltage': '220V',
      'Duty Cycle': '60%',
      'Electrode': '2-4mm'
    },
    pricePerDay: 35,
    pricePerWeek: 200,
    pricePerMonth: 750,
    image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
    images: [
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg'
    ],
    available: true,
    location: 'Baku Center',
    rating: 4.8,
    reviewCount: 21,
    features: ['Safety Gear', 'Multiple Electrodes', 'Portable']
  }
];

// Function to add new equipment
export const addEquipment = (newEquipment: Equipment) => {
  equipment.push(newEquipment);
};

// Function to update equipment
export const updateEquipment = (id: string, updatedEquipment: Partial<Equipment>) => {
  const index = equipment.findIndex(eq => eq.id === id);
  if (index !== -1) {
    equipment[index] = { ...equipment[index], ...updatedEquipment };
  }
};

// Function to delete equipment
export const deleteEquipment = (id: string) => {
  const index = equipment.findIndex(eq => eq.id === id);
  if (index !== -1) {
    equipment.splice(index, 1);
  }
};