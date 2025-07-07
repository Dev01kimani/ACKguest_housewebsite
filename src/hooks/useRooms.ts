import { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from '../lib/supabase';
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

      // Test Supabase connection first
      const connectionTest = await testSupabaseConnection();
      
      if (!connectionTest) {
        console.warn('Supabase connection failed, using fallback data');
        setRooms(getFallbackRooms());
        return;
      }

      // Fetch rooms from Supabase
      console.log('Fetching rooms from Supabase...');
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('price');

      if (roomsError) {
        console.error('Supabase rooms query error:', roomsError);
        throw new Error(`Failed to fetch rooms: ${roomsError.message}`);
      }

      if (!roomsData || roomsData.length === 0) {
        console.warn('No rooms found in database, using fallback data');
        setRooms(getFallbackRooms());
        return;
      }

      console.log(`Successfully fetched ${roomsData.length} rooms from Supabase`);

      // Check availability for each room if dates are provided
      const roomsWithAvailability: RoomWithAvailability[] = [];

      for (const room of roomsData) {
        let available = true;

        if (checkIn && checkOut) {
          try {
            console.log(`Checking availability for room ${room.id}...`);
            const { data: availabilityData, error: availabilityError } = await supabase
              .rpc('check_room_availability', {
                room_id_param: room.id,
                check_in_param: checkIn,
                check_out_param: checkOut
              });

            if (availabilityError) {
              console.error('Availability check error for room', room.id, ':', availabilityError);
              // Default to available if check fails
              available = true;
            } else {
              available = availabilityData === true;
              console.log(`Room ${room.id} availability:`, available);
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
      console.error('Error in fetchRooms:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rooms';
      setError(errorMessage);
      
      // Use fallback data on error
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