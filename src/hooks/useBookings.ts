import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import type { BookingData } from '../utils/types';

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: BookingData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // First check if room is available
      const { data: isAvailable, error: availabilityError } = await supabase
        .rpc('check_room_availability', {
          room_id_param: bookingData.roomType,
          check_in_param: bookingData.checkIn,
          check_out_param: bookingData.checkOut
        });

      if (availabilityError) {
        throw new Error('Failed to check room availability');
      }

      if (!isAvailable) {
        throw new Error('Room is not available for the selected dates');
      }

      // Get room details to calculate total amount
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('price')
        .eq('id', bookingData.roomType)
        .single();

      if (roomError || !roomData) {
        throw new Error('Failed to get room details');
      }

      // Calculate total amount
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
      const totalAmount = nights * roomData.price;

      // Create booking
      const bookingInsert: BookingInsert = {
        room_id: bookingData.roomType,
        guest_name: bookingData.name,
        guest_email: bookingData.email,
        guest_phone: bookingData.phone,
        check_in_date: bookingData.checkIn,
        check_out_date: bookingData.checkOut,
        number_of_guests: bookingData.guests,
        special_requests: bookingData.specialRequests || null,
        total_amount: totalAmount,
        status: 'pending'
      };

      const { error: insertError } = await supabase
        .from('bookings')
        .insert(bookingInsert);

      if (insertError) {
        throw insertError;
      }

      return true;
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBookings = async (roomId?: string) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('bookings')
        .select(`
          *,
          rooms (
            name,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (roomId) {
        query = query.eq('room_id', roomId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    getBookings,
    loading,
    error
  };
};