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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Accommodation Rates</h2>
            <p className="text-xl text-gray-600">Choose the package that best suits your needs</p>
          </div>
          
          {/* Accommodation Rates Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="bg-amber-600 text-white p-6">
              <h3 className="text-2xl font-bold">Accommodation Rates (KSh)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed Only</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">B&B</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Half Board</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Board</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Single</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 1,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 1,200</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 2,500</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 3,500</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Double</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 1,200</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 1,500</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 2,800</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 4,300</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Double Extended</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 2,500</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 2,900</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 4,300</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh 6,300</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">Important Notes</h4>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <span>Children below 3 years stay free if sharing with an adult</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <span>Children aged 4–12 sharing with an adult are charged 50% of the room rate</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <span>Children above 13 are charged as adults</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <span>Payments: Acceptable in cash, M-Pesa, or cheque</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <span>A deposit of 50% is required to reserve a room</span>
              </li>
            </ul>
          </div>

          {/* Conference Rates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-green-600 text-white p-6">
                <h3 className="text-xl font-bold">Conference Rates (KSh)</h3>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Full Board Conference Package</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Single Room</span>
                    <span className="font-semibold">KSh 3,700</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Double Room</span>
                    <span className="font-semibold">KSh 4,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-green-600 text-white p-6">
                <h3 className="text-xl font-bold">Conference Package (Per Person)</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Full Day Conference</span>
                    <span className="font-semibold">KSh 2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Half Day Conference</span>
                    <span className="font-semibold">KSh 1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Full Day with Stationery</span>
                    <span className="font-semibold">KSh 2,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Half Day with Stationery</span>
                    <span className="font-semibold">KSh 1,700</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rooms;