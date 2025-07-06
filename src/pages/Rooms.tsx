import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Wifi, Coffee, Car, Tv, Bath, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import type { RoomWithAvailability } from '../hooks/useRooms';

const Rooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomWithAvailability | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  
  const { rooms, loading, error } = useRooms(checkIn, checkOut);

  const amenityIcons: { [key: string]: React.ComponentType<any> } = {
    'Free Wi-Fi': Wifi,
    'TV': Tv,
    'Private Bathroom': Bath,
    'Mini Fridge': Coffee,
    'Coffee Machine': Coffee,
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinCheckoutDate = () => {
    if (checkIn) {
      const checkInDate = new Date(checkIn);
      checkInDate.setDate(checkInDate.getDate() + 1);
      return checkInDate.toISOString().split('T')[0];
    }
    return getMinDate();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error loading rooms: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Rooms & Rates
          </h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Choose from our carefully designed accommodations, each offering comfort and modern amenities
          </p>
        </div>
      </section>

      {/* Date Selection */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Check Availability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  id="checkIn"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  id="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={getMinCheckoutDate()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <button
                  onClick={() => {
                    setCheckIn('');
                    setCheckOut('');
                  }}
                  className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Clear Dates
                </button>
              </div>
            </div>
            {checkIn && checkOut && (
              <p className="mt-4 text-sm text-gray-600">
                Showing availability for {new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={room.image_url || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                    alt={room.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    room.available 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {room.available ? 'Available' : 'Booked'}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h3>
                      <p className="text-gray-600 mb-4">{room.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-amber-600">
                        KSh {room.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{room.capacity} Guest{room.capacity > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Amenities:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {room.amenities.map((amenity, index) => {
                        const IconComponent = amenityIcons[amenity] || CheckCircle;
                        return (
                          <div key={index} className="flex items-center space-x-2">
                            <IconComponent className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      View Details
                    </button>
                    {room.available ? (
                      <Link
                        to={`/booking?room=${room.id}`}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-center transition-colors"
                      >
                        Book Now
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold cursor-not-allowed"
                      >
                        Not Available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedRoom.image_url || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                alt={selectedRoom.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-70"
              >
                ×
              </button>
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                selectedRoom.available 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {selectedRoom.available ? 'Available' : 'Booked'}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedRoom.name}</h3>
              <div className="text-3xl font-bold text-amber-600 mb-4">
                KSh {selectedRoom.price.toLocaleString()}/night
              </div>
              <p className="text-gray-600 mb-6">{selectedRoom.description}</p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Room Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedRoom.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity] || CheckCircle;
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
                {selectedRoom.available ? (
                  <Link
                    to={`/booking?room=${selectedRoom.id}`}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-center transition-colors"
                    onClick={() => setSelectedRoom(null)}
                  >
                    Book This Room
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Not Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Services</h2>
            <p className="text-xl text-gray-600">Enhance your stay with our extra services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Car className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Airport Transfer</h3>
              <p className="text-gray-600 mb-4">Convenient pickup and drop-off service</p>
              <p className="text-2xl font-bold text-amber-600">KSh 2,500</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Coffee className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Breakfast Package</h3>
              <p className="text-gray-600 mb-4">Traditional Kenyan breakfast daily</p>
              <p className="text-2xl font-bold text-amber-600">KSh 800</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Users className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tour Guide</h3>
              <p className="text-gray-600 mb-4">Local attractions and activities</p>
              <p className="text-2xl font-bold text-amber-600">KSh 3,000</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rooms;