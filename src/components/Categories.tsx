import React from 'react';
import { HardHat, Factory, Wrench, Zap, Plane as Crane, Lightbulb, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/mockData';

const iconMap = {
  HardHat,
  Factory,
  Wrench,
  Zap,
  Crane,
  Lightbulb,
};

const Categories: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const getCategoryName = (category: any) => {
    switch (language) {
      case 'ru':
        return category.nameRu;
      case 'az':
        return category.nameAz;
      default:
        return category.name;
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/catalog?category=${categoryId}`);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('categories.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our comprehensive collection of professional equipment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];
            
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {getCategoryName(category)}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {category.count} items available
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;