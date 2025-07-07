import { supabase } from './supabase';
import type { Database } from './supabase';

// Database helper functions for common operations
export class DatabaseService {
  // Room operations
  static async getAllRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('price');
    
    if (error) throw error;
    return data;
  }

  static async getRoomById(id: string) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async checkRoomAvailability(roomId: string, checkIn: string, checkOut: string) {
    const { data, error } = await supabase
      .rpc('check_room_availability', {
        room_id_param: roomId,
        check_in_param: checkIn,
        check_out_param: checkOut
      });
    
    if (error) throw error;
    return data;
  }

  // Booking operations
  static async createBooking(booking: Database['public']['Tables']['bookings']['Insert']) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getBookingsByRoom(roomId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms (
          name,
          price
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getAllBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms (
          name,
          price
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}