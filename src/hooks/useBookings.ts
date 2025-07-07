import { useState } from 'react';
import { supabase, testSupabaseConnection } from '../lib/supabase';
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

      // Test Supabase connection
      const connectionTest = await testSupabaseConnection();
      
      if (!connectionTest) {
        console.log('Supabase not available, simulating booking creation:', bookingData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Store booking in localStorage for demo
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

      // Real Supabase booking logic
      console.log('Creating booking with Supabase...');

      // First check if room is available
      console.log('Checking room availability...');
      const { data: isAvailable, error: availabilityError } = await supabase
        .rpc('check_room_availability', {
          room_id_param: bookingData.roomType,
          check_in_param: bookingData.checkIn,
          check_out_param: bookingData.checkOut
        });

      if (availabilityError) {
        console.error('Availability check error:', availabilityError);
        throw new Error(`Failed to check room availability: ${availabilityError.message}`);
      }

      if (!isAvailable) {
        throw new Error('Room is not available for the selected dates');
      }

      console.log('Room is available, proceeding with booking...');

      // Get room details to calculate total amount
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('price')
        .eq('id', bookingData.roomType)
        .single();

      if (roomError || !roomData) {
        console.error('Room fetch error:', roomError);
        throw new Error(`Failed to get room details: ${roomError?.message || 'Room not found'}`);
      }

      // Calculate total amount
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
      const totalAmount = nights * roomData.price;

      console.log(`Calculated total: ${nights} nights × KSh ${roomData.price} = KSh ${totalAmount}`);

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

      console.log('Inserting booking:', bookingInsert);

      const { error: insertError } = await supabase
        .from('bookings')
        .insert(bookingInsert);

      if (insertError) {
        console.error('Booking insert error:', insertError);
        throw new Error(`Failed to create booking: ${insertError.message}`);
      }

      console.log('Booking created successfully in Supabase');
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

      // Test Supabase connection
      const connectionTest = await testSupabaseConnection();
      
      if (!connectionTest) {
        console.log('Getting demo bookings from localStorage...');
        const demoBookings = JSON.parse(localStorage.getItem('demo_bookings') || '[]');
        
        if (roomId) {
          return demoBookings.filter((booking: any) => booking.roomType === roomId);
        }
        
        return demoBookings;
      }

      // Real Supabase query
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

      if (error) {
        console.error('Bookings fetch error:', error);
        throw new Error(`Failed to fetch bookings: ${error.message}`);
      }

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