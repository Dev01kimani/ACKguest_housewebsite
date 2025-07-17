import React, { useState } from 'react';
import { Calendar, Users, MessageCircle, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import type { BookingData } from '../utils/types';

interface BookingFormProps {
  selectedRoom?: string;
  onSubmit: (data: BookingData) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedRoom, onSubmit }) => {
  const { rooms, getRoomById, getRoomPrice } = useRooms();
  const [formData, setFormData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: selectedRoom ? parseInt(selectedRoom) : 1,
    specialRequests: '',
    mealPlan: 'bed_only'
  });

  const [errors, setErrors] = useState<Partial<BookingData>>({});

  const mealPlans = [
    { id: 'bed_only', name: 'Bed Only', description: 'Room accommodation only' },
    { id: 'bb', name: 'Bed & Breakfast', description: 'Room with breakfast included' },
    { id: 'half_board', name: 'Half Board', description: 'Room with breakfast and dinner' },
    { id: 'full_board', name: 'Full Board', description: 'Room with all meals included' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    if (formData.guests < 1) newErrors.guests = 'At least 1 guest is required';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone format
    const phoneRegex = /^[+]?[\d\s-()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate dates
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
      }

      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Check-out date must be after check-in date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'roomType' || name === 'guests' ? parseInt(value) : value 
    }));

    if (errors[name as keyof BookingData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinCheckoutDate = () => {
    if (formData.checkIn) {
      const checkInDate = new Date(formData.checkIn);
      checkInDate.setDate(checkInDate.getDate() + 1);
      return checkInDate.toISOString().split('T')[0];
    }
    return getMinDate();
  };

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
    
    const roomPrice = getRoomPrice(formData.roomType, formData.mealPlan);
    return nights * roomPrice;
  };

  const selectedRoomData = getRoomById(formData.roomType);
  const totalAmount = calculateTotal();
  const nights = formData.checkIn && formData.checkOut ? 
    Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24)) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Room Selection */}
      <div>
        <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">
          Room Type *
        </label>
        <select
          id="roomType"
          name="roomType"
          value={formData.roomType}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} - KSh {room.price.toLocaleString()}/night
            </option>
          ))}
        </select>
      </div>

      {/* Meal Plan Selection */}
      <div>
        <label htmlFor="mealPlan" className="block text-sm font-medium text-gray-700 mb-1">
          Meal Plan *
        </label>
        <select
          id="mealPlan"
          name="mealPlan"
          value={formData.mealPlan}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {mealPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} - {plan.description}
            </option>
          ))}
        </select>
        {selectedRoomData && (
          <p className="text-sm text-gray-600 mt-1">
            Price: KSh {getRoomPrice(formData.roomType, formData.mealPlan).toLocaleString()}/night
          </p>
        )}
      </div>

      {/* Guest Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+254 712 345 678"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Guests *
          </label>
          <select
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date *
          </label>
          <input
            type="date"
            id="checkIn"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleInputChange}
            min={getMinDate()}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              errors.checkIn ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
        </div>

        <div>
          <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Date *
          </label>
          <input
            type="date"
            id="checkOut"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleInputChange}
            min={getMinCheckoutDate()}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              errors.checkOut ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>}
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
          Special Requests
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Any special requests or requirements..."
        />
      </div>

      {/* Booking Summary */}
      {formData.checkIn && formData.checkOut && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Booking Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Room:</span>
              <span className="font-medium">{selectedRoomData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Meal Plan:</span>
              <span className="font-medium">
                {mealPlans.find(p => p.id === formData.mealPlan)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Dates:</span>
              <span className="font-medium">
                {new Date(formData.checkIn).toLocaleDateString()} - {new Date(formData.checkOut).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Nights:</span>
              <span className="font-medium">{nights}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span className="font-medium">{formData.guests}</span>
            </div>
            <div className="flex justify-between">
              <span>Rate per night:</span>
              <span className="font-medium">KSh {getRoomPrice(formData.roomType, formData.mealPlan).toLocaleString()}</span>
            </div>
            <hr className="border-amber-300" />
            <div className="flex justify-between text-lg font-bold text-amber-900">
              <span>Total Amount:</span>
              <span>KSh {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Important Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Important Information
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• A 50% deposit is required to confirm your booking</li>
          <li>• Check-in time: 2:00 PM | Check-out time: 11:00 AM</li>
          <li>• Children below 3 years stay free when sharing with adults</li>
          <li>• Children 4-12 years are charged 50% of the room rate</li>
          <li>• Free cancellation up to 24 hours before check-in</li>
        </ul>
      </div>

      {/* Contact Methods */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-3">How to Complete Your Booking:</h4>
        <p className="text-sm text-green-800 mb-3">
          After submitting this form, you'll be redirected to contact us directly via:
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center text-sm text-green-700">
            <MessageCircle className="h-4 w-4 mr-1" />
            WhatsApp (Recommended)
          </div>
          <div className="flex items-center text-sm text-green-700">
            <Phone className="h-4 w-4 mr-1" />
            Phone Call
          </div>
          <div className="flex items-center text-sm text-green-700">
            <Mail className="h-4 w-4 mr-1" />
            Email
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
      >
        <Calendar className="h-5 w-5" />
        <span>Prepare Booking Request</span>
      </button>
    </form>
  );
};

export default BookingForm;