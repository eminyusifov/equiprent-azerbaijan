import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, CreditCard, Truck, User, Phone, Mail, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { equipment } from '../data/mockData';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { addBooking } = useBooking();

  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    deliveryOption: 'pickup' as 'pickup' | 'delivery',
    deliveryAddress: '',
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    specialRequests: '',
    paymentMethod: 'card' as 'card' | 'bank' | 'cash'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const equipmentItem = equipment.find(item => item.id === id);

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

  const calculateDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const days = calculateDays();
    if (days === 0) return 0;
    
    let price = equipmentItem.pricePerDay;
    if (days >= 30) {
      price = equipmentItem.pricePerMonth / 30;
    } else if (days >= 7) {
      price = equipmentItem.pricePerWeek / 7;
    }
    
    const subtotal = price * days;
    const deliveryFee = bookingData.deliveryOption === 'delivery' ? 50 : 0;
    const tax = subtotal * 0.18; // 18% VAT
    
    return {
      subtotal,
      deliveryFee,
      tax,
      total: subtotal + deliveryFee + tax
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const pricing = calculateTotal();
      const bookingId = addBooking({
        equipmentId: equipmentItem.id,
        userId: user!.id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalPrice: pricing.total,
        status: 'pending',
        deliveryOption: bookingData.deliveryOption,
        deliveryAddress: bookingData.deliveryAddress
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate('/booking-confirmation', { 
        state: { 
          bookingId,
          equipment: equipmentItem,
          bookingData,
          pricing
        }
      });
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricing = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Equipment</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Equipment Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={equipmentItem.image}
                      alt={getEquipmentName()}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{getEquipmentName()}</h3>
                      <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{equipmentItem.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rental Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.startDate}
                      onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.endDate}
                      onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                      min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Delivery Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Truck className="w-4 h-4 inline mr-1" />
                    Delivery Option
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="pickup"
                        checked={bookingData.deliveryOption === 'pickup'}
                        onChange={(e) => setBookingData({ ...bookingData, deliveryOption: e.target.value as 'pickup' | 'delivery' })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Self Pickup</div>
                        <div className="text-sm text-gray-500">Free - Pick up from our location</div>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="delivery"
                        checked={bookingData.deliveryOption === 'delivery'}
                        onChange={(e) => setBookingData({ ...bookingData, deliveryOption: e.target.value as 'pickup' | 'delivery' })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Delivery</div>
                        <div className="text-sm text-gray-500">$50 - We deliver to your location</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Delivery Address */}
                {bookingData.deliveryOption === 'delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      required
                      value={bookingData.deliveryAddress}
                      onChange={(e) => setBookingData({ ...bookingData, deliveryAddress: e.target.value })}
                      placeholder="Enter full delivery address..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.contactName}
                        onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={bookingData.contactPhone}
                        onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingData.contactEmail}
                      onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    placeholder="Any special requirements or requests..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'card', label: 'Credit/Debit Card', desc: 'Pay securely online' },
                      { value: 'bank', label: 'Bank Transfer', desc: 'Transfer to our bank account' },
                      { value: 'cash', label: 'Cash on Delivery', desc: 'Pay when equipment is delivered' }
                    ].map((method) => (
                      <label key={method.value} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={bookingData.paymentMethod === method.value}
                          onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value as any })}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{method.label}</div>
                          <div className="text-sm text-gray-500">{method.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rental Period</span>
                  <span className="font-medium">{calculateDays()} days</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Rate</span>
                  <span className="font-medium">${equipmentItem.pricePerDay}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
                </div>
                
                {bookingData.deliveryOption === 'delivery' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">${pricing.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">${pricing.tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">${pricing.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                form="booking-form"
                disabled={isSubmitting || calculateDays() === 0}
                onClick={handleSubmit}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  isSubmitting || calculateDays() === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                By booking, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;