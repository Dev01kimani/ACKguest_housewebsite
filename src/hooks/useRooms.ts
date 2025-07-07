import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

export interface RoomWithAvailability extends Room {
  available: boolean;
}

export const useRooms = (checkIn?: string, checkOut?: string) => {
  const [rooms, setRooms] = useState<RoomWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFallbackRooms = (): RoomWithAvailability[] => {
    return [
      {
        id: '1',
        name: 'Standard Single Room',
        description: 'Cozy and comfortable single room perfect for solo travelers',
        price: 3500,
        capacity: 1,
        amenities: ['Free Wi-Fi', 'Private Bathroom', 'TV', 'Desk', 'Wardrobe'],
        image_url: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        available: true
      },
      {
        id: '2',
        name: 'Deluxe Double Room',
        description: 'Spacious double room with modern amenities and garden view',
        price: 5500,
        capacity: 2,
        amenities: ['Free Wi-Fi', 'Private Bathroom', 'TV', 'Mini Fridge', 'Balcony', 'Work Desk'],
        image_url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        available: true
      },
      {
        id: '3',
        name: 'Family Suite',
        description: 'Perfect for families with separate sleeping areas and living space',
        price: 8500,
        capacity: 4,
        amenities: ['Free Wi-Fi', 'Private Bathroom', 'TV', 'Mini Fridge', 'Seating Area', 'Kitchenette'],
        image_url: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        available: true
      },
      {
        id: '4',
        name: 'Executive Room',
        description: 'Premium room with lake view and enhanced amenities',
        price: 7500,
        capacity: 2,
        amenities: ['Free Wi-Fi', 'Private Bathroom', 'TV', 'Mini Fridge', 'Lake View', 'Work Desk', 'Coffee Machine'],
        image_url: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        available: true
      }
    ];
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have valid Supabase configuration
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log('Supabase URL:', supabaseUrl);
      console.log('Supabase Key exists:', !!supabaseKey);

      // Use fallback data if Supabase is not properly configured
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl.includes('placeholder') || 
          supabaseKey.includes('placeholder') ||
          supabaseUrl === 'your_supabase_project_url' ||
          supabaseKey === 'your_supabase_anon_key') {
        
        console.warn('Using fallback room data - Supabase not configured properly');
        setRooms(getFallbackRooms());
        return;
      }

      // Try to fetch from Supabase
      console.log('Attempting to fetch rooms from Supabase...');
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('price');

      if (roomsError) {
        console.error('Supabase error:', roomsError);
        console.warn('Falling back to static room data due to Supabase error');
        setRooms(getFallbackRooms());
        return;
      }

      if (!roomsData || roomsData.length === 0) {
        console.warn('No rooms data received from Supabase, using fallback');
        setRooms(getFallbackRooms());
        return;
      }

      console.log('Successfully fetched rooms from Supabase:', roomsData.length);

      // Check availability for each room if dates are provided
      const roomsWithAvailability: RoomWithAvailability[] = [];

      for (const room of roomsData) {
        let available = true;

        if (checkIn && checkOut) {
          try {
            const { data: availabilityData, error: availabilityError } = await supabase
              .rpc('check_room_availability', {
                room_id_param: room.id,
                check_in_param: checkIn,
                check_out_param: checkOut
              });

            if (availabilityError) {
              console.error('Availability check error:', availabilityError);
              // Default to available if check fails
              available = true;
            } else {
              available = availabilityData || false;
            }
          } catch (err) {
            console.error('Error checking availability for room:', room.id, err);
            // Default to available if check fails
            available = true;
          }
        }

        roomsWithAvailability.push({
          ...room,
          available
        });
      }

      setRooms(roomsWithAvailability);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      console.warn('Using fallback room data due to error');
      setRooms(getFallbackRooms());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [checkIn, checkOut]);

  return { rooms, loading, error, refetch: fetchRooms };
};