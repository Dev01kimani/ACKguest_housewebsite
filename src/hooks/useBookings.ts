import { useState } from 'react';
import type { BookingData } from '../utils/types';

// Local types for the WhatsApp booking system
interface StoredBooking extends BookingData {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  total_amount?: number;
}

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock room data for price calculation
  const ROOMS = [
    { 
      id: 1, 
      name: 'Standard Single Room', 
      bed_only: 2500, 
      bb: 2800, 
      half_board: 3500, 
      full_board: 4200 
    },
    { 
      id: 2, 
      name: 'Standard Double Room', 
      bed_only: 3500, 
      bb: 3800, 
      half_board: 4500, 
      full_board: 5200 
    },
    { 
      id: 3, 
      name: 'Deluxe Room', 
      bed_only: 4500, 
      bb: 4800, 
      half_board: 5500, 
      full_board: 6200 
    },
    { 
      id: 4, 
      name: 'Executive Suite', 
      bed_only: 6500, 
      bb: 6800, 
      half_board: 7500, 
      full_board: 8200 
    },
    { 
      id: 5, 
      name: 'Family Room', 
      bed_only: 5500, 
      bb: 5800, 
      half_board: 6500, 
      full_board: 7200 
    },
  ];

  const createBooking = async (bookingData: BookingData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get room details for price calculation
      const room = ROOMS.find(r => r.id === bookingData.roomType);
      if (!room) {
        throw new Error('Selected room not found');
      }

      // Calculate total amount based on meal plan
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
      const roomPrice = room[bookingData.mealPlan] || room.bed_only;
      const totalAmount = nights * roomPrice;

      // Store booking locally
      const existingBookings = JSON.parse(localStorage.getItem('whatsapp_bookings') || '[]');
      const newBooking: StoredBooking = {
        id: Date.now().toString(),
        ...bookingData,
        status: 'pending',
        created_at: new Date().toISOString(),
        total_amount: totalAmount
      };
      
      existingBookings.push(newBooking);
      localStorage.setItem('whatsapp_bookings', JSON.stringify(existingBookings));

      console.log('Booking stored locally:', newBooking);
      return true;
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBookings = async (): Promise<StoredBooking[]> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const storedBookings = localStorage.getItem('whatsapp_bookings');
      const bookings = storedBookings ? JSON.parse(storedBookings) : [];
      
      // Sort by creation date (newest first)
      return bookings.sort((a: StoredBooking, b: StoredBooking) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled'): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const storedBookings = JSON.parse(localStorage.getItem('whatsapp_bookings') || '[]');
      const updatedBookings = storedBookings.map((booking: StoredBooking) =>
        booking.id === bookingId ? { ...booking, status } : booking
      );

      localStorage.setItem('whatsapp_bookings', JSON.stringify(updatedBookings));
      return true;
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const storedBookings = JSON.parse(localStorage.getItem('whatsapp_bookings') || '[]');
      const filteredBookings = storedBookings.filter((booking: StoredBooking) => booking.id !== bookingId);

      localStorage.setItem('whatsapp_bookings', JSON.stringify(filteredBookings));
      return true;
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearAllBookings = (): void => {
    localStorage.removeItem('whatsapp_bookings');
  };

  return {
    createBooking,
    getBookings,
    updateBookingStatus,
    deleteBooking,
    clearAllBookings,
    loading,
    error
  };
};