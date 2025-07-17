import { useState, useEffect, useCallback } from 'react';
import { supabase, testSupabaseConnection } from '../lib/supabase';
import type { Database } from '../lib/supabase';

// Base room type from Supabase schema
type Room = Database['public']['Tables']['rooms']['Row'];

// Extended with custom fields
export interface RoomWithAvailability extends Room {
  available: boolean;
  bed_only: number;
  bb: number;
  half_board: number;
  full_board: number;
}

const fallbackRooms: RoomWithAvailability[] = (() => {
  const now = new Date().toISOString();
  return [
    {
      id: '1',
      name: 'Single Room',
      description: 'Simple single bed room with private bathroom and Wi-Fi.',
      bed_only: 1000,
      bb: 1200,
      half_board: 2500,
      full_board: 3500,
      capacity: 1,
      amenities: ['TV', 'Desk', 'Free Wi-Fi', 'Private Bathroom', 'Wardrobe'],
      image_url: 'https://zsayrztvhbduflijzefb.supabase.co/storage/v1/object/public/imagesbucket//ACKbed.jpeg',
      created_at: now,
      updated_at: now,
      available: true
    },
    {
      id: '2',
      name: 'Double Room',
      description: 'Double bed room ideal for couples. Comes with private bath and fridge.',
      bed_only: 1200,
      bb: 1500,
      half_board: 2800,
      full_board: 4300,
      capacity: 2,
      amenities: ['Desk', 'Wardrobe', 'Private Bathroom', 'Free Wi-Fi', 'TV', 'Mini Fridge'],
      image_url: 'https://zsayrztvhbduflijzefb.supabase.co/storage/v1/object/public/imagesbucket//ACKbedmain.jpeg',
      created_at: now,
      updated_at: now,
      available: true
    },
    {
      id: '3',
      name: 'Double Room + Extra Bed',
      description: 'Spacious room with extra bed for kids or third guest.',
      bed_only: 2500,
      bb: 2900,
      half_board: 4300,
      full_board: 6300,
      capacity: 3,
      amenities: ['Desk', 'Wardrobe', 'Private Bathroom', 'Free Wi-Fi', 'TV', 'Mini Fridge', 'Seating Area'],
      image_url: 'https://zsayrztvhbduflijzefb.supabase.co/storage/v1/object/public/imagesbucket//ACKbedview.jpeg',
      created_at: now,
      updated_at: now,
      available: true
    }
  ];
})();

export const useRooms = (checkIn?: string, checkOut?: string) => {
  const [rooms, setRooms] = useState<RoomWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const connected = await testSupabaseConnection();
      if (!connected) {
        console.warn('Supabase connection failed. Using fallback data.');
        setRooms(fallbackRooms);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .order('price');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!data || data.length === 0) {
        console.warn('No rooms found. Using fallback data.');
        setRooms(fallbackRooms);
        return;
      }

      const enrichedRooms: RoomWithAvailability[] = data.map((room) => ({
        ...room,
        available: true,
        image_url: room.image_url || '', // fallback if missing
        bed_only: room.bed_only || 0,
        bb: room.bb || 0,
        half_board: room.half_board || 0,
        full_board: room.full_board || 0
      }));

      setRooms(enrichedRooms);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Room fetch failed:', message);
      setError(message);
      setRooms(fallbackRooms);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, refetch: fetchRooms };
};
