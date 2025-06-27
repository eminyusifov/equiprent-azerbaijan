import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Phone, Mail, Download, ArrowRight } from 'lucide-react';

const BookingConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, equipment, bookingData, pricing } = location.state || {};

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">Your equipment rental has been successfully booked</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
            
            <div className="space-y-6">
              {/* Booking ID */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium">Booking ID</div>
                <div className="text-lg font-bold text-blue-900">#{bookingId}</div>
              </div>

              {/* Equipment Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{equipment.name}</h3>
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{equipment.location}</span>
                  </div>
                </div>
              </div>

              {/* Rental Period */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Start Date</span>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {new Date(bookingData.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">End Date</span>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {new Date(bookingData.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Delivery Option */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-1">Delivery Option</div>
                <div className="font-semibold text-gray-900 capitalize">
                  {bookingData.deliveryOption}
                  {bookingData.deliveryOption === 'delivery' && bookingData.deliveryAddress && (
                    <div className="text-sm text-gray-600 mt-1">{bookingData.deliveryAddress}</div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-2">Contact Information</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{bookingData.contactPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{bookingData.contactEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
              </div>
              
              {pricing.deliveryFee > 0 && (
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
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Paid</span>
                  <span className="text-green-600">${pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg mb-6">
              <div className="text-sm text-green-600 font-medium">Payment Method</div>
              <div className="text-green-900 font-semibold capitalize">{bookingData.paymentMethod}</div>
              <div className="text-sm text-green-600 mt-1">Payment Status: Confirmed</div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                <Download className="w-5 h-5" />
                <span>Download Receipt</span>
              </button>
              
              <button
                onClick={() => navigate('/account')}
                className="w-full flex items-center justify-center space-x-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
              >
                <span>View in My Account</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Confirmation Call</h3>
              <p className="text-gray-600 text-sm">We'll call you within 2 hours to confirm details and schedule delivery/pickup.</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Equipment Preparation</h3>
              <p className="text-gray-600 text-sm">Our team will prepare and inspect the equipment before delivery/pickup.</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery/Pickup</h3>
              <p className="text-gray-600 text-sm">Equipment will be delivered or ready for pickup on your selected date.</p>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="mb-6">Our customer support team is available 24/7 to assist you with your rental.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <a
              href="tel:+994125550123"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Call: +994 12 555 0123
            </a>
            <a
              href="mailto:support@equiprent.az"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Email: support@equiprent.az
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;