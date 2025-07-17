import React, { useState } from 'react';
import { useRooms } from '../hooks/useRooms';
import type { BookingData } from '../utils/types';

interface BookingFormProps {
  selectedRoom?: number | string;
  onSubmit: (data: BookingData) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedRoom, onSubmit }) => {
  const { rooms } = useRooms();

  const initialRoomType = selectedRoom ? Number(selectedRoom) : 1;

  const [formData, setFormData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: initialRoomType,
    specialRequests: '',
    mealPlan: 'bed_only',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' || name === 'roomType' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        name="checkIn"
        value={formData.checkIn}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        name="checkOut"
        value={formData.checkOut}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        name="guests"
        placeholder="Number of Guests"
        value={formData.guests}
        onChange={handleChange}
        min={1}
        className="w-full p-2 border rounded"
      />
      <select
        name="roomType"
        value={formData.roomType}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        {rooms.map(room => (
          <option key={room.id} value={room.id}>
            {room.name}
          </option>
        ))}
      </select>
      <select
        name="mealPlan"
        value={formData.mealPlan}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="bed_only">Bed Only</option>
        <option value="bed_breakfast">Bed and Breakfast</option>
        <option value="full_board">Full Board</option>
      </select>
      <textarea
        name="specialRequests"
        placeholder="Special Requests"
        value={formData.specialRequests}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;
