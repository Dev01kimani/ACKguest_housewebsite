import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Wifi,
  Tv,
  Bath,
  CheckCircle,
  Calendar,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import type { RoomWithAvailability } from '../hooks/useRooms';

const Rooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomWithAvailability | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const { rooms, loading, error } = useRooms(checkIn, checkOut);

  const amenityIcons: Record<string, LucideIcon> = {
    'Free Wi-Fi': Wifi,
    'TV': Tv,
    'Private Bathroom': Bath,
    'Desk': Users,
    'Wardrobe': Users,
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
        <p className="text-gray-600">Loading rooms...</p>
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
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 to-amber-700 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Rooms & Rates</h1>
        <p className="text-xl text-amber-100 max-w-3xl mx-auto">
          Choose from our comfortable and affordable room options
        </p>
      </section>

      {/* Dates */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Check Availability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium mb-1">Check-in</label>
                <input
                  type="date"
                  id="checkIn"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium mb-1">Check-out</label>
                <input
                  type="date"
                  id="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={getMinCheckoutDate()}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <button
                  onClick={() => { setCheckIn(''); setCheckOut(''); }}
                  className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md mt-6"
                >
                  Clear Dates
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid gap-8 lg:grid-cols-2">
          {rooms.slice(0, 10).map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="relative">
                <img
                  src={room.image_url ?? ''}
                  alt={room.name}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                  room.available ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                  {room.available ? 'Available' : 'Booked'}
                </span>
              </div>

              <div className="p-6">
                <div className="flex justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
                  <div className="text-sm text-right text-gray-700 space-y-1">
                    <div><strong>Bed Only:</strong> KSh {room.bed_only}</div>
                    <div><strong>B&B:</strong> KSh {room.bb}</div>
                    <div><strong>Half Board:</strong> KSh {room.half_board}</div>
                    <div><strong>Full Board:</strong> KSh {room.full_board}</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{room.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Users className="h-4 w-4" />
                  <span>{room.capacity} Guest{room.capacity > 1 ? 's' : ''}</span>
                </div>

                {room.amenities?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Amenities:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {room.amenities.map((amenity, i) => {
                        const Icon = amenityIcons[amenity] || CheckCircle;
                        return (
                          <div key={i} className="flex items-center space-x-2">
                            <Icon className="h-4 w-4 text-green-500" />
                            <span>{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md"
                  >
                    View
                  </button>
                  {room.available ? (
                    <Link
                      to={`/booking?room=${room.id || room.id}`}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-center"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
                    >
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedRoom.image_url ?? ''}
                alt={selectedRoom.name}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedRoom.name}</h3>
              <p className="text-gray-600 mb-2">{selectedRoom.description}</p>
              <div className="text-sm text-gray-700 space-y-1 mb-4">
                <div><strong>Bed Only:</strong> KSh {selectedRoom.bed_only}</div>
                <div><strong>B&B:</strong> KSh {selectedRoom.bb}</div>
                <div><strong>Half Board:</strong> KSh {selectedRoom.half_board}</div>
                <div><strong>Full Board:</strong> KSh {selectedRoom.full_board}</div>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Children below 3 years stay free if sharing with an adult.</li>
                  <li>Children between 4-12 years sharing the same room with an adult will be charged 50% of the room rate.</li>
                  <li>Children above 13 years will be charged as an adult for the room rate.</li>
                  <li>Payments acceptable in KSh, M-Pesa, cheque.</li>
                  <li>A deposit of half the rate is required to reserve a room.</li>
                </ul>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Conference Rates (KShs)</h4>
                <div className="space-y-2 text-gray-700">
                  <div><strong>Full Board Conference Package:</strong> Single: 3700, Double: 4000</div>
                  <div><strong>Conference Package (per person):</strong> Full Day: 2500, Half Day: 1500, Full Day with Stationeries: 2800, Half Day with Stationeries: 1700</div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md"
                >
                  Close
                </button>
                {selectedRoom.available && (
                  <Link
                    to={`/booking?room=${selectedRoom.id || selectedRoom.id}`}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
                    onClick={() => setSelectedRoom(null)}
                  >
                    Book This Room
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
