import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { BookingData, BookingInsert } from '../types';

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testSupabaseConnection = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from("rooms").select("id").limit(1);
      return !error;
    } catch {
      return false;
    }
  };

  const createBooking = async (bookingData: BookingData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const connectionTest = await testSupabaseConnection();

      // === OFFLINE FALLBACK ===
      if (!connectionTest) {
        console.log('Supabase not available, simulating booking creation:', bookingData);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const existingBookings = JSON.parse(localStorage.getItem('demo_bookings') || '[]');
        const newBooking = {
          id: Date.now().toString(),
          ...bookingData,
          status: 'pending',
          created_at: new Date().toISOString()
        };
        existingBookings.push(newBooking);
        localStorage.setItem('demo_bookings', JSON.stringify(existingBookings));

        console.log('Demo booking stored locally:', newBooking);
        return true;
      }

      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);

      // === ROOM AVAILABILITY CHECK ===
      const { data: overlappingBookings, error: availabilityError } = await supabase
        .from('bookings')
        .select('id')
        .eq('room_id', Number(bookingData.roomType))
        .or(`and(check_in,lte.${bookingData.checkOut},check_out,gte.${bookingData.checkIn})`);

      if (availabilityError) {
        console.error('Availability check error:', availabilityError);
        throw new Error(`Failed to check room availability: ${availabilityError.message}`);
      }

      if (overlappingBookings && overlappingBookings.length > 0) {
        throw new Error('❌ Room is not available for the selected dates.');
      }

      console.log('Room is available, proceeding with booking...');

      // === GET ROOM PRICE ===
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('price')
        .eq('id', Number(bookingData.roomType))
        .single();

      if (roomError || !roomData) {
        throw new Error(`Failed to get room details: ${roomError?.message || 'Room not found'}`);
      }

      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
      const totalAmount = nights * roomData.price;

      // === CREATE BOOKING ===
      const bookingInsert: BookingInsert = {
        room_id: Number(bookingData.roomType),
        guest_name: bookingData.name,
        guest_email: bookingData.email,
        guest_phone: bookingData.phone,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        number_of_guests: bookingData.guests,
        special_requests: bookingData.specialRequests || null,
        total_amount: totalAmount,
        status: 'pending'
      };

      const { error: insertError } = await supabase
        .from('bookings')
        .insert([bookingInsert]);

      if (insertError) {
        throw new Error(`Failed to create booking: ${insertError.message}`);
      }

      console.log('✅ Booking created successfully in Supabase');
      return true;
    } catch (err) {
      console.error('❌ Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBookings = async (): Promise<BookingInsert[]> => {
    try {
      setLoading(true);
      setError(null);

      const connectionTest = await testSupabaseConnection();

      if (!connectionTest) {
        console.log('Supabase offline, reading from local storage');
        const demoBookings = localStorage.getItem('demo_bookings');
        return demoBookings ? JSON.parse(demoBookings) : [];
      }

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(`Failed to fetch bookings: ${fetchError.message}`);
      }

      return data as BookingInsert[];
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
