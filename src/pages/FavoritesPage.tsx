import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import EquipmentCard from '../components/EquipmentCard';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            My Favorites
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Equipment you've saved for later
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start exploring our equipment catalog to save your favorites.</p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Browse Equipment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((equipment) => (
              <EquipmentCard
                key={equipment.id}
                equipment={equipment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;