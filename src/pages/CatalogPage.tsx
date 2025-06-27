import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Loader } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useEquipment } from '../hooks/useEquipment';
import { useToast } from '../components/Toast';
import { useSearchParams } from 'react-router-dom';
import EquipmentCard from '../components/EquipmentCard';
import AdvancedSearch from '../components/AdvancedSearch';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorBoundary from '../components/ErrorBoundary';
import { Database } from '../types/supabase';

type Equipment = Database['public']['Tables']['equipment']['Row'] & {
  categories?: Database['public']['Tables']['categories']['Row'];
};

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  priceRange: [number, number];
  available: boolean;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

const CatalogPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    priceRange: [0, 1000],
    available: true,
    dateRange: {
      startDate: '',
      endDate: ''
    }
  });

  // Используем React Query для получения данных из Supabase
  const { data: equipment = [], isLoading, isError, error } = useEquipment();

  // Обновление URL параметров при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.category) params.set('category', filters.category);
    if (filters.location) params.set('location', filters.location);
    
    setSearchParams(params, { replace: true });
  }, [filters.query, filters.category, filters.location, setSearchParams]);

  // Фильтрация и сортировка оборудования
  const filteredAndSortedEquipment = useMemo(() => {
    if (!equipment) return [];

    let filtered = equipment.filter((item: Equipment) => {
      // Текстовый поиск
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const searchableText = `${item.name} ${item.name_ru} ${item.name_az} ${item.description} ${item.description_ru} ${item.description_az} ${item.features?.join(' ') || ''}`.toLowerCase();
        if (!searchableText.includes(query)) return false;
      }

      // Фильтр по категории
      if (filters.category && item.category_id !== filters.category) return false;
      
      // Фильтр по цене
      if (item.price_per_day < filters.priceRange[0] || item.price_per_day > filters.priceRange[1]) {
        return false;
      }
      
      // Фильтр по местоположению
      if (filters.location && item.location !== filters.location) return false;
      
      // Фильтр по доступности
      if (filters.available && !item.available) return false;
      
      return true;
    });

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price_per_day - b.price_per_day;
        case 'price-high':
          return b.price_per_day - a.price_per_day;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [equipment, filters, sortBy]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleViewChange = (view: 'grid' | 'list') => {
    setViewMode(view);
  };

  // Обработка ошибок
  if (isError) {
    showToast('error', 'Failed to load equipment. Please try again.');
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Equipment Catalog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our extensive collection of professional equipment for rent
            </p>
          </div>

          {/* Advanced Search */}
          <AdvancedSearch
            onFiltersChange={handleFiltersChange}
            onViewChange={handleViewChange}
            currentView={viewMode}
            totalResults={filteredAndSortedEquipment.length}
            isLoading={isLoading}
          />

          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {filteredAndSortedEquipment.length > 0 && (
              <div className="text-sm text-gray-600">
                Showing {filteredAndSortedEquipment.length} of {equipment.length} items
              </div>
            )}
          </div>

          {/* Equipment Grid/List */}
          {isLoading ? (
            <LoadingSkeleton type="card" count={8} className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`} />
          ) : filteredAndSortedEquipment.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredAndSortedEquipment.map((item) => (
                <div
                  key={item.id}
                  className={viewMode === 'list' ? 'transform hover:scale-[1.02] transition-transform' : ''}
                >
                  <EquipmentCard
                    equipment={{
                      id: item.id,
                      name: item.name,
                      nameRu: item.name_ru,
                      nameAz: item.name_az,
                      category: item.category_id || '',
                      description: item.description,
                      descriptionRu: item.description_ru,
                      descriptionAz: item.description_az,
                      specifications: item.specifications as Record<string, string>,
                      pricePerDay: item.price_per_day,
                      pricePerWeek: item.price_per_week,
                      pricePerMonth: item.price_per_month,
                      image: item.main_image || item.images?.[0] || '',
                      images: item.images || [],
                      available: item.available,
                      location: item.location,
                      rating: 4.5, // TODO: Calculate from reviews
                      reviewCount: 0, // TODO: Get from reviews
                      features: item.features || []
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* No Results */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No equipment found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to see more results
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => handleFiltersChange({
                    query: '',
                    category: '',
                    location: '',
                    priceRange: [0, 1000],
                    available: true,
                    dateRange: { startDate: '', endDate: '' }
                  })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}

          {/* Load More Button (для будущей пагинации) */}
          {filteredAndSortedEquipment.length > 0 && filteredAndSortedEquipment.length >= 20 && (
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  // Здесь можно добавить логику загрузки дополнительных элементов
                  showToast('info', 'Load more functionality coming soon!');
                }}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Load More Equipment
              </button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CatalogPage;
