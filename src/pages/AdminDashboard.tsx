import React, { useState } from 'react';
import { BarChart3, Users, Package, Calendar, DollarSign, Settings, Plus, Edit, Trash2, Eye, User, Mail, Phone, MapPin, Save, X } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { useEquipment, useCreateEquipment, useUpdateEquipment, useDeleteEquipment } from '../hooks/useEquipment';
import { useToast } from '../components/Toast';
import { Database } from '../types/supabase';

type EquipmentInsert = Database['public']['Tables']['equipment']['Insert'];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { allBookings, bookingStats, updateBookingStatus, isLoading: bookingsLoading } = useBooking();
  const { data: equipment = [], isLoading: equipmentLoading } = useEquipment();
  const createEquipmentMutation = useCreateEquipment();
  const updateEquipmentMutation = useUpdateEquipment();
  const deleteEquipmentMutation = useDeleteEquipment();
  const { showToast } = useToast();
  
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    name_ru: '',
    name_az: '',
    category_id: '',
    description: '',
    description_ru: '',
    description_az: '',
    price_per_day: '',
    price_per_week: '',
    price_per_month: '',
    location: '',
    main_image: '',
    features: '',
    specifications: ''
  });

  // Получаем статистику
  const stats = {
    totalBookings: allBookings?.length || 0,
    activeRentals: allBookings?.filter(b => b.status === 'active').length || 0,
    totalRevenue: allBookings?.reduce((sum, booking) => sum + booking.total_price, 0) || 0,
    availableEquipment: equipment.filter(eq => eq.available).length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEquipmentById = (id: string) => {
    return equipment.find(eq => eq.id === id);
  };

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const equipmentData: EquipmentInsert = {
        name: newEquipment.name,
        name_ru: newEquipment.name_ru || newEquipment.name,
        name_az: newEquipment.name_az || newEquipment.name,
        category_id: newEquipment.category_id,
        description: newEquipment.description,
        description_ru: newEquipment.description_ru || newEquipment.description,
        description_az: newEquipment.description_az || newEquipment.description,
        price_per_day: parseFloat(newEquipment.price_per_day),
        price_per_week: parseFloat(newEquipment.price_per_week) || parseFloat(newEquipment.price_per_day) * 6,
        price_per_month: parseFloat(newEquipment.price_per_month) || parseFloat(newEquipment.price_per_day) * 25,
        location: newEquipment.location,
        main_image: newEquipment.main_image,
        images: newEquipment.main_image ? [newEquipment.main_image] : [],
        features: newEquipment.features ? newEquipment.features.split(',').map(f => f.trim()) : [],
        specifications: newEquipment.specifications ? JSON.parse(newEquipment.specifications) : {},
        available: true
      };

      await createEquipmentMutation.mutateAsync(equipmentData);
      
      setNewEquipment({
        name: '',
        name_ru: '',
        name_az: '',
        category_id: '',
        description: '',
        description_ru: '',
        description_az: '',
        price_per_day: '',
        price_per_week: '',
        price_per_month: '',
        location: '',
        main_image: '',
        features: '',
        specifications: ''
      });
      setShowAddEquipment(false);
    } catch (error) {
      console.error('Error adding equipment:', error);
    }
  };

  const handleEditEquipment = async (id: string) => {
    const equipment = getEquipmentById(id);
    if (equipment) {
      const newName = prompt('Enter new name:', equipment.name);
      const newPrice = prompt('Enter new daily price:', equipment.price_per_day.toString());
      
      if (newName && newPrice) {
        try {
          await updateEquipmentMutation.mutateAsync({
            id,
            updates: {
              name: newName,
              name_ru: newName,
              name_az: newName,
              price_per_day: parseFloat(newPrice),
              price_per_week: parseFloat(newPrice) * 6,
              price_per_month: parseFloat(newPrice) * 25
            }
          });
        } catch (error) {
          console.error('Error updating equipment:', error);
        }
      }
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      try {
        await deleteEquipmentMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting equipment:', error);
      }
    }
  };

  const handleSaveSettings = () => {
    showToast('success', 'Settings saved successfully!');
  };

  if (bookingsLoading || equipmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddEquipment(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Equipment</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Overview</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Bookings</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('equipment')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === 'equipment' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Equipment</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Active Rentals</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeRentals}</p>
                      </div>
                      <Package className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Available Equipment</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.availableEquipment}</p>
                      </div>
                      <Package className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Booking ID</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Equipment</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allBookings?.slice(0, 5).map((booking) => {
                          const equipmentItem = getEquipmentById(booking.equipment_id);
                          return (
                            <tr key={booking.id} className="border-b border-gray-100">
                              <td className="py-3 px-4">#{booking.id.slice(0, 8)}</td>
                              <td className="py-3 px-4">{equipmentItem?.name || 'Unknown'}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">${booking.total_price.toFixed(2)}</td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="text-green-600 hover:text-green-700 transition-colors duration-200">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">All Bookings</h2>
                  <div className="flex space-x-3">
                    <select className="border border-gray-300 rounded-lg px-3 py-2">
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Active</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Booking ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Equipment</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Start Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">End Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allBookings?.map((booking) => {
                        const equipmentItem = getEquipmentById(booking.equipment_id);
                        return (
                          <tr key={booking.id} className="border-b border-gray-100">
                            <td className="py-3 px-4">#{booking.id.slice(0, 8)}</td>
                            <td className="py-3 px-4">{equipmentItem?.name || 'Unknown'}</td>
                            <td className="py-3 px-4">{new Date(booking.start_date).toLocaleDateString()}</td>
                            <td className="py-3 px-4">{new Date(booking.end_date).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <select
                                value={booking.status}
                                onChange={(e) => updateBookingStatus(booking.id, e.target.value as any)}
                                className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(booking.status)}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">${booking.total_price.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-700 transition-colors duration-200">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-700 transition-colors duration-200">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'equipment' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Equipment Management</h2>
                  <button 
                    onClick={() => setShowAddEquipment(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Equipment</span>
                  </button>
                </div>

                {/* Add Equipment Form */}
                {showAddEquipment && (
                  <form onSubmit={handleAddEquipment} className="mb-8 p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Add New Equipment</h3>
                      <button
                        type="button"
                        onClick={() => setShowAddEquipment(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name</label>
                        <input
                          type="text"
                          required
                          value={newEquipment.name}
                          onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter equipment name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category ID</label>
                        <input
                          type="text"
                          required
                          value={newEquipment.category_id}
                          onChange={(e) => setNewEquipment({ ...newEquipment, category_id: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Category UUID"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day ($)</label>
                        <input
                          type="number"
                          required
                          value={newEquipment.price_per_day}
                          onChange={(e) => setNewEquipment({ ...newEquipment, price_per_day: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price per Week ($)</label>
                        <input
                          type="number"
                          value={newEquipment.price_per_week}
                          onChange={(e) => setNewEquipment({ ...newEquipment, price_per_week: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Auto-calculated"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          required
                          value={newEquipment.location}
                          onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Equipment location"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={newEquipment.description}
                        onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Equipment description"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                      <input
                        type="url"
                        required
                        value={newEquipment.main_image}
                        onChange={(e) => setNewEquipment({ ...newEquipment, main_image: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={createEquipmentMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{createEquipmentMutation.isPending ? 'Adding...' : 'Add Equipment'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddEquipment(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {equipment.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={item.main_image || item.images?.[0] || 'https://via.placeholder.com/300x200'}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Daily Rate</span>
                        <span className="font-medium">${item.price_per_day}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.available ? 'Available' : 'Rented'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditEquipment(item.id)}
                          className="flex-1 text-blue-600 hover:text-blue-700 border border-blue-600 hover:bg-blue-50 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteEquipment(item.id)}
                          className="flex-1 text-red-600 hover:text-red-700 border border-red-600 hover:bg-red-50 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>
                
                <div className="space-y-8">
                  {/* General Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          defaultValue="EquipRent Azerbaijan"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          defaultValue="info@equiprent.az"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          defaultValue="+994 12 555 0123"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Currency
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="USD">USD ($)</option>
                          <option value="AZN">AZN (₼)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button 
                      onClick={handleSaveSettings}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
