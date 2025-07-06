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

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all rooms
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*')
          .order('price');

        if (roomsError) throw roomsError;

        // Check availability for each room if dates are provided
        const roomsWithAvailability: RoomWithAvailability[] = [];

        for (const room of roomsData || []) {
          let available = true;

          if (checkIn && checkOut) {
            const { data: availabilityData, error: availabilityError } = await supabase
              .rpc('check_room_availability', {
                room_id_param: room.id,
                check_in_param: checkIn,
                check_out_param: checkOut
              });

            if (availabilityError) {
              console.error('Error checking availability:', availabilityError);
              available = true; // Default to available if check fails
            } else {
              available = availabilityData;
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
        setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [checkIn, checkOut]);

  return { rooms, loading, error, refetch: () => fetchRooms() };
};