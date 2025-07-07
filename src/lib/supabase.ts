import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback for development - remove in production
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'placeholder-key';

// Use fallback values if environment variables are not set
const finalUrl = supabaseUrl || defaultUrl;
const finalKey = supabaseAnonKey || defaultKey;

console.log('Supabase Configuration:');
console.log('- URL:', finalUrl);
console.log('- Key exists:', !!finalKey);
console.log('- Using fallback:', !supabaseUrl || !supabaseAnonKey);

export const supabase = createClient(finalUrl, finalKey);

export type Database = {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          capacity: number;
          amenities: string[];
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          price: number;
          capacity?: number;
          amenities?: string[];
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          capacity?: number;
          amenities?: string[];
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          room_id: string;
          guest_name: string;
          guest_email: string;
          guest_phone: string;
          check_in_date: string;
          check_out_date: string;
          number_of_guests: number;
          special_requests: string | null;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          guest_name: string;
          guest_email: string;
          guest_phone: string;
          check_in_date: string;
          check_out_date: string;
          number_of_guests?: number;
          special_requests?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          total_amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          guest_name?: string;
          guest_email?: string;
          guest_phone?: string;
          check_in_date?: string;
          check_out_date?: string;
          number_of_guests?: number;
          special_requests?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      check_room_availability: {
        Args: {
          room_id_param: string;
          check_in_param: string;
          check_out_param: string;
        };
        Returns: boolean;
      };
    };
  };
};