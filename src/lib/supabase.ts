import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Configuration:');
console.log('- URL:', supabaseUrl);
console.log('- Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('rooms').select('count').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    console.log('Supabase connection test successful');
    return true;
  } catch (err) {
    console.error('Supabase connection test error:', err);
    return false;
  }
};

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