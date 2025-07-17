import React, { useState } from 'react';
import BookingForm from '../components/BookingForm';
import { useRooms } from '../hooks/useRooms';
import type { Room, BookingData } from '../utils/types';

const Rooms: React.FC = () => {
  const { rooms, loading } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBooking = (formData: BookingData) => {
    console.log('Booking submitted:', formData);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedRoom(null);
    }, 3000);
  };

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Our Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{room.name}</h2>
            <p>{room.description}</p>
            <p className="text-green-600 font-medium">Ksh {room.price} per night</p>
            <p className={`mt-2 ${room.available ? 'text-green-500' : 'text-red-500'}`}>
              {room.available ? 'Available' : 'Not Available'}
            </p>
            <button
              className={`mt-2 px-4 py-2 rounded ${
                room.available ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
              //onClick={() => setSelectedRoom(room)}
              disabled={!room.available}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Book: {selectedRoom.name}</h2>
          <BookingForm selectedRoom={selectedRoom.id} onSubmit={handleBooking} />
        </div>
      )}

      {bookingSuccess && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
          Booking successful! We'll contact you soon.
        </div>
      )}
    </div>
  );
};

export default Rooms;
