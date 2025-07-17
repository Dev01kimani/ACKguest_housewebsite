import React, { useState } from 'react';
import { useRooms } from '../hooks/useRooms';
import type { BookingData } from '../utils/types';

interface BookingFormProps {
  selectedRoom?: number;
  onSubmit: (data: BookingData) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedRoom, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<BookingData, 'mealPlan'>>({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: selectedRoom || 0,
    specialRequests: '',
  });

  const [mealPlan, setMealPlan] = useState<BookingData['mealPlan']>('bed_only');
  const [errors, setErrors] = useState<Partial<BookingData>>({});
  const { rooms, loading: roomsLoading } = useRooms(formData.checkIn, formData.checkOut);

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    if (!formData.roomType) newErrors.roomType = 'Please select a room type';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[+]?\d{7,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

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
    if (!validateForm()) return;

    // Send to backend (optional)
    onSubmit({ ...formData, mealPlan });

    const room = rooms.find(r => r.id === formData.roomType);
    const mealPlanLabel = {
      bed_only: 'Bed Only',
      bb: 'Bed & Breakfast',
      half_board: 'Half Board',
      full_board: 'Full Board',
    }[mealPlan];

    const message = `
Hello, I would like to make a room booking:

• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Check-in: ${formData.checkIn}
• Check-out: ${formData.checkOut}
• Guests: ${formData.guests}
• Room Type: ${room?.name || 'N/A'}
• Meal Plan: ${mealPlanLabel}
• Special Requests: ${formData.specialRequests || 'None'}

Please let me know if it's available. Thank you!
    `;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '+254759750318';
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'mealPlan') {
      setMealPlan(value as BookingData['mealPlan']);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]:
          name === 'roomType' || name === 'guests'
            ? Number(value)
            : value,
      }));

      if (errors[name as keyof BookingData]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (roomsLoading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <section className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Make a Reservation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Full Name"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Email Address"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Phone Number"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

        <input
          type="date"
          name="checkIn"
          value={formData.checkIn}
          min={getMinDate()}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        {errors.checkIn && <p className="text-red-500 text-sm">{errors.checkIn}</p>}

        <input
          type="date"
          name="checkOut"
          value={formData.checkOut}
          min={formData.checkIn}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        {errors.checkOut && <p className="text-red-500 text-sm">{errors.checkOut}</p>}

        <input
          type="number"
          name="guests"
          value={formData.guests}
          min={1}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Number of Guests"
        />

        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value={0}>Select a Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        {errors.roomType && <p className="text-red-500 text-sm">{errors.roomType}</p>}

        <select
          name="mealPlan"
          value={mealPlan}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="bed_only">Bed Only</option>
          <option value="bb">Bed & Breakfast</option>
          <option value="half_board">Half Board</option>
          <option value="full_board">Full Board</option>
        </select>

        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Special Requests (Optional)"
        />

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Submit & Continue on WhatsApp
        </button>
      </form>
    </section>
  );
};

export default BookingForm;
