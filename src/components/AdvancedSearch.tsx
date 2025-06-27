import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, MapPin, Calendar, DollarSign, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useLanguage } from '../contexts/LanguageContext';
import { useCategories } from '../hooks/useCategories';

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

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onViewChange?: (view: 'grid' | 'list') => void;
  currentView?: 'grid' | 'list';
  totalResults?: number;
  isLoading?: boolean;
}

const locations = [
  'Baku Center',
  'Baku Port',
  'Sumgayit', 
  'Ganja',
  'Mingachevir',
  'Shirvan',
  'Lankaran'
];

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onFiltersChange,
  onViewChange,
  currentView = 'grid',
  totalResults = 0,
  isLoading = false
}) => {
  const { language } = useLanguage();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    priceRange: [0, 1000],
    available: true,
    dateRange: {
      startDate: '',
      endDate: ''
    }
  });

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const debouncedQuery = useDebounce(filters.query, 300);

  // Подсчет активных фильтров
  useEffect(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.location) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.dateRange.startDate) count++;
    if (filters.dateRange.endDate) count++;
    if (!filters.available) count++;
    setActiveFilterCount(count);
  }, [filters]);

  // Обновление фильтров с debounced поиском
  useEffect(() => {
    onFiltersChange({ ...filters, query: debouncedQuery });
  }, [debouncedQuery, filters, onFiltersChange]);

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Для не-query полей обновляем сразу
    if (key !== 'query') {
      onFiltersChange(newFilters);
    }
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      query: '',
      category: '',
      location: '',
      priceRange: [0, 1000],
      available: true,
      dateRange: {
        startDate: '',
        endDate: ''
      }
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  }, [onFiltersChange]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return '';
    
    switch (language) {
      case 'ru':
        return category.name_ru;
      case 'az':
        return category.name_az;
      default:
        return category.name;
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg mb-8">
      {/* Main Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search equipment..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            {isLoading && (
              <div className="absolute right-4 top-3.5">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <X className="h-5 w-5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            {isLoading ? (
              'Searching...'
            ) : (
              `${totalResults} equipment found`
            )}
          </div>
          
          {/* View Toggle */}
          {onViewChange && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => onViewChange('grid')}
                  className={`p-2 transition-colors ${
                    currentView === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onViewChange('list')}
                  className={`p-2 transition-colors ${
                    currentView === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories...' : 'All Categories'}
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {getCategoryName(category.id)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Price Range (per day)
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => handleFilterChange('priceRange', [
                      parseInt(e.target.value) || 0,
                      filters.priceRange[1]
                    ])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [
                      filters.priceRange[0],
                      parseInt(e.target.value) || 1000
                    ])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [
                    filters.priceRange[0],
                    parseInt(e.target.value)
                  ])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Availability Period
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.startDate}
                  min={getTodayDate()}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    startDate: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={filters.dateRange.endDate}
                  min={filters.dateRange.startDate || getTodayDate()}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    endDate: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.available}
                  onChange={(e) => handleFilterChange('available', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Available only</span>
              </label>
            </div>
            
            <div className="text-sm text-gray-500">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
