import { useState, useEffect } from 'react';

// Room interface for WhatsApp booking system
export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  image_url: string;
  available: boolean;
  bed_only: number;
  bb: number;
  half_board: number;
  full_board: number;
}

// Booking interface to replace `any`
interface Booking {
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'cancelled' | 'pending'; // Customize as needed
}

// Static room data for WhatsApp booking
const ROOMS_DATA: Room[] = [
  {
    id: '1',
    name: 'Single Room',
    description: 'Ideal for solo travelers. Includes one bed and access to essential amenities.',
    price: 3500,
    bed_only: 1000,
    bb: 1200,
    half_board: 2500,
    full_board: 3500,
    capacity: 1,
    amenities: ['TV', 'Desk', 'Free Wi-Fi'],
    image_url: 'https://jekjzdfuuudzdmdmzyjw.supabase.co/storage/v1/object/public/imagesbucket//ACKbed.jpeg',
    available: true
  },
  {
    id: '2',
    name: 'Double Room',
    description: 'Perfect for couples or friends. Comes with a double bed and cozy atmosphere.',
    price: 5500,
    bed_only: 1200,
    bb: 1500,
    half_board: 2800,
    full_board: 4300,
    capacity: 2,
    amenities: ['Desk', 'Wardrobe', 'Private Bathroom', 'Free Wi-Fi', 'TV'],
    image_url: 'https://jekjzdfuuudzdmdmzyjw.supabase.co/storage/v1/object/public/imagesbucket//ACKbedmain.jpeg',
    available: true
  },
  {
    id: '3',
    name: 'Double Room + Extra Bed',
    description: 'Spacious enough for a small family or group. Includes an additional bed for extra comfort.',
    price: 8500,
    bed_only: 2500,
    bb: 2900,
    half_board: 4300,
    full_board: 6300,
    capacity: 3,
    amenities: ['Desk', 'Wardrobe', 'Private Bathroom', 'Free Wi-Fi', 'TV'],
    image_url: 'https://zsayrztvhbduflijzefb.supabase.co/storage/v1/object/public/imagesbucket//ACKbedview.jpeg',
    available: true
  }
];

export const useRooms = (checkIn?: string, checkOut?: string) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        await new Promise(resolve => setTimeout(resolve, 500)); // simulate API delay

        let availableRooms = [...ROOMS_DATA];

        if (checkIn && checkOut) {
          const existingBookings: Booking[] = JSON.parse(localStorage.getItem('whatsapp_bookings') || '[]');

          availableRooms = availableRooms.map(room => {
            const isBooked = existingBookings.some((booking: Booking) =>
              booking.roomType === room.id &&
              booking.status !== 'cancelled' &&
              ((checkIn >= booking.checkIn && checkIn < booking.checkOut) ||
               (checkOut > booking.checkIn && checkOut <= booking.checkOut) ||
               (checkIn <= booking.checkIn && checkOut >= booking.checkOut))
            );

            return {
              ...room,
              available: !isBooked
            };
          });
        }

        setRooms(availableRooms);
      } catch (err) {
        console.error('Error loading rooms:', err);
        setError('Failed to load rooms');
        setRooms(ROOMS_DATA); // fallback data
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [checkIn, checkOut]);

  const getRoomById = (id: number): Room | undefined => {
    return rooms.find(room => room.id === id.toString());
  };

  const getAvailableRooms = (): Room[] => {
    return rooms.filter(room => room.available);
  };

  const getRoomPrice = (
    roomId: number,
    mealPlan: 'bed_only' | 'bb' | 'half_board' | 'full_board' = 'bed_only'
  ): number => {
    const room = getRoomById(roomId);
    if (!room) return 0;
    return room[mealPlan] || room.price;
  };

  return {
    rooms,
    loading,
    error,
    getRoomById,
    getAvailableRooms,
    getRoomPrice
  };
};
