import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Wifi, Coffee, Car, Tv, Bath, CheckCircle } from 'lucide-react';
import type { Room } from '../utils/types';

const Rooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const rooms: Room[] = [
    {
      id: '1',
      name: 'Standard Single Room',
      description: 'Cozy and comfortable single room perfect for solo travelers',
      price: 3500,
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      amenities: ['Free Wi-Fi', 'Private Bathroom', 'TV', 'Desk', 'Wardrobe'],
      capacity: 1,
      available: true
    },
    {
      id: '2',
      name: 'Deluxe Double Room',
      description: 'Spacious double room with modern amenities and garden view',
      price: 5500,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      amenities: ['Free Wi-Fi', 'Private Bathroom', 'TV', 'Mini Fridge', 'Balcony', 'Work Desk'],
      capacity: 2,
      available: true
    },
    {
      id: '3',
      name: 'Family Suite',
      description: 'Perfect for families with separate sleeping areas and living space',
      price: 8500,
      image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      amenities: ['Free Wi-Fi', 'Private Bathroom', 'TV', 'Mini Fridge', 'Seating Area', 'Kitchenette'],
      capacity: 4,
      available: true
    },
    {
      id: '4',
      name: 'Executive Room',
      description: 'Premium room with lake view and enhanced amenities',
      price: 7500,
      image: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      amenities: ['Free Wi-Fi', 'Private Bathroom', 'TV', 'Mini Fridge', 'Lake View', 'Work Desk', 'Coffee Machine'],
      capacity: 2,
      available: true
    }
  ];

  const amenityIcons: { [key: string]: React.ComponentType<any> } = {
    'Free Wi-Fi': Wifi,
    'TV': Tv,
    'Private Bathroom': Bath,
    'Mini Fridge': Coffee,
    'Coffee Machine': Coffee,
  };

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

      {/* Rooms Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-64 object-cover"
                  />
                  {room.available && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Available
                    </div>
                  )}
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
                    <Link
                      to={`/booking?room=${room.id}`}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-center transition-colors"
                    >
                      Book Now
                    </Link>
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
                src={selectedRoom.image}
                alt={selectedRoom.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-70"
              >
                ×
              </button>
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
                <Link
                  to={`/booking?room=${selectedRoom.id}`}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-center transition-colors"
                  onClick={() => setSelectedRoom(null)}
                >
                  Book This Room
                </Link>
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