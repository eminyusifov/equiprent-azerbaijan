import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, CheckCircle, XCircle, ArrowLeft, Share2, Heart, Truck, Shield, Clock, Phone, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useReviews } from '../contexts/ReviewsContext';
import { equipment } from '../data/mockData';

const EquipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { getEquipmentReviews, addReview } = useReviews();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  const equipmentItem = equipment.find(item => item.id === id);
  const reviews = equipmentItem ? getEquipmentReviews(equipmentItem.id) : [];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!equipmentItem) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Equipment not found</h1>
          <button
            onClick={() => navigate('/catalog')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const getEquipmentName = () => {
    switch (language) {
      case 'ru':
        return equipmentItem.nameRu;
      case 'az':
        return equipmentItem.nameAz;
      default:
        return equipmentItem.name;
    }
  };

  const getEquipmentDescription = () => {
    switch (language) {
      case 'ru':
        return equipmentItem.descriptionRu;
      case 'az':
        return equipmentItem.descriptionAz;
      default:
        return equipmentItem.description;
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${equipmentItem.id}`);
  };

  const handleContactForQuote = () => {
    navigate('/contact');
  };

  const handleFavoriteToggle = () => {
    if (isFavorite(equipmentItem.id)) {
      removeFromFavorites(equipmentItem.id);
    } else {
      addToFavorites(equipmentItem);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getEquipmentName(),
          text: getEquipmentDescription(),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addReview({
      equipmentId: equipmentItem.id,
      userId: user.id,
      userName: user.name,
      rating: reviewData.rating,
      comment: reviewData.comment
    });

    setReviewData({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
              <img
                src={equipmentItem.images[selectedImage]}
                alt={getEquipmentName()}
                className="w-full h-96 object-cover"
              />
              
              {/* Availability Badge */}
              <div className="absolute top-4 right-4">
                {equipmentItem.available ? (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t('equipment.available')}</span>
                  </div>
                ) : (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <XCircle className="w-4 h-4" />
                    <span>{t('equipment.unavailable')}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-2 rounded-full ${
                    isFavorite(equipmentItem.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
                  } shadow-lg hover:scale-110 transition-all duration-200`}
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 bg-white text-gray-600 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {equipmentItem.images.length > 1 && (
              <div className="flex space-x-2">
                {equipmentItem.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    } transition-colors duration-200`}
                  >
                    <img
                      src={image}
                      alt={`${getEquipmentName()} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Equipment Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getEquipmentName()}
              </h1>
              
              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-700">{equipmentItem.rating}</span>
                  <span className="text-gray-500">({reviews.length} reviews)</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{equipmentItem.location}</span>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">
                {getEquipmentDescription()}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rental Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">${equipmentItem.pricePerDay}</div>
                  <div className="text-sm text-gray-600">Per Day</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">${equipmentItem.pricePerWeek}</div>
                  <div className="text-sm text-gray-600">Per Week</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">${equipmentItem.pricePerMonth}</div>
                  <div className="text-sm text-gray-600">Per Month</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {equipmentItem.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Services</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Free delivery within Baku</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Full insurance coverage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">24/7 technical support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">Professional consultation</span>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <div className="space-y-4">
              <button
                onClick={handleBookNow}
                disabled={!equipmentItem.available}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                  equipmentItem.available
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {equipmentItem.available ? 'Book Now' : 'Currently Unavailable'}
              </button>
              
              <button 
                onClick={handleContactForQuote}
                className="w-full py-3 px-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors duration-200"
              >
                Contact for Quote
              </button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(equipmentItem.specifications).map(([key, value]) => (
              <div key={key} className="border-l-4 border-blue-600 pl-4">
                <div className="text-sm text-gray-500 font-medium">{key}</div>
                <div className="text-lg font-semibold text-gray-900">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                Write Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`w-8 h-8 ${
                        star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors duration-200`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                  required
                  rows={4}
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share your experience with this equipment..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Review</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this equipment!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{review.userName.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{review.userName}</div>
                        <div className="text-sm text-gray-500">{formatDate(review.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailPage;