import React from 'react';
import { Search, CreditCard, Truck, RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const steps = [
    {
      icon: Search,
      title: t('how-it-works.step1.title'),
      description: t('how-it-works.step1.desc'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: CreditCard,
      title: t('how-it-works.step2.title'),
      description: t('how-it-works.step2.desc'),
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: Truck,
      title: t('how-it-works.step3.title'),
      description: t('how-it-works.step3.desc'),
      color: 'from-amber-500 to-amber-600',
    },
    {
      icon: RotateCcw,
      title: t('how-it-works.step4.title'),
      description: t('how-it-works.step4.desc'),
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const handleBrowseEquipment = () => {
    navigate('/catalog');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('how-it-works.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, fast, and secure equipment rental process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center group"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform translate-x-4 z-0"></div>
              )}
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <step.icon className="w-12 h-12 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us with their equipment rental needs.
            </p>
            <button 
              onClick={handleBrowseEquipment}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Browse Equipment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;