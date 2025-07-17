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
<<<<<<< HEAD
=======
  // Meal plan pricing
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
  bed_only: number;
  bb: number;
  half_board: number;
  full_board: number;
}

<<<<<<< HEAD
// Booking interface to replace `any`
interface Booking {
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'cancelled' | 'pending'; // Customize as needed
=======
// Add this interface for rooms with availability checking
export interface RoomWithAvailability extends Room {
  available: boolean;
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
}

// Static room data for WhatsApp booking
const ROOMS_DATA: Room[] = [
  {
    id: '1',
<<<<<<< HEAD
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
=======
    name: 'Standard Single Room',
    description: 'Comfortable single room with modern amenities and private bathroom.',
    price: 2500,
    capacity: 1,
    amenities: ['Free Wi-Fi', 'Private Bathroom', 'TV', 'Air Conditioning', 'Desk'],
    image_url: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
    available: true,
    bed_only: 2500,
    bb: 2800,
    half_board: 3500,
    full_board: 4200
  },
  {
    id: '2',
    name: 'Standard Double Room',
    description: 'Spacious double room perfect for couples with queen-size bed.',
    price: 3500,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Private Bathroom', 'TV', 'Air Conditioning', 'Mini Fridge', 'Balcony'],
    image_url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    available: true,
    bed_only: 3500,
    bb: 3800,
    half_board: 4500,
    full_board: 5200
  },
  {
    id: '3',
    name: 'Deluxe Room',
    description: 'Luxurious room with premium amenities and city view.',
    price: 4500,
    capacity: 2,
    amenities: ['Free Wi-Fi', 'Private Bathroom', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'City View', 'Work Desk'],
    image_url: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
    available: true,
    bed_only: 4500,
    bb: 4800,
    half_board: 5500,
    full_board: 6200
  },
  {
    id: '4',
    name: 'Executive Suite',
    description: 'Premium suite with separate living area and executive amenities.',
    price: 6500,
    capacity: 3,
    amenities: ['Free Wi-Fi', 'Private Bathroom', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Living Area', 'Executive Lounge Access'],
    image_url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    available: true,
    bed_only: 6500,
    bb: 6800,
    half_board: 7500,
    full_board: 8200
  },
  {
    id: '5',
    name: 'Family Room',
    description: 'Large family room with multiple beds, perfect for families with children.',
    price: 5500,
    capacity: 4,
    amenities: ['Free Wi-Fi', 'Private Bathroom', 'TV', 'Air Conditioning', 'Mini Fridge', 'Extra Beds', 'Family Amenities'],
    image_url: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg',
    available: true,
    bed_only: 5500,
    bb: 5800,
    half_board: 6500,
    full_board: 7200
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
  }
];

export const useRooms = (checkIn?: string, checkOut?: string) => {
<<<<<<< HEAD
  const [rooms, setRooms] = useState<Room[]>([]);
=======
  const [rooms, setRooms] = useState<RoomWithAvailability[]>([]);
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
<<<<<<< HEAD
=======
    // Simulate loading delay for better UX
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
    const loadRooms = async () => {
      try {
        setLoading(true);
        setError(null);
<<<<<<< HEAD

        await new Promise(resolve => setTimeout(resolve, 500)); // simulate API delay

        let availableRooms = [...ROOMS_DATA];

        if (checkIn && checkOut) {
          const existingBookings: Booking[] = JSON.parse(localStorage.getItem('whatsapp_bookings') || '[]');

          availableRooms = availableRooms.map(room => {
            const isBooked = existingBookings.some((booking: Booking) =>
=======
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter rooms based on availability (you can add custom logic here)
        let availableRooms: RoomWithAvailability[] = [...ROOMS_DATA];
        
        // If dates are provided, you could add availability checking logic here
        if (checkIn && checkOut) {
          // For now, all rooms are available
          // In a real scenario, you might check against local storage bookings
          const existingBookings = JSON.parse(localStorage.getItem('whatsapp_bookings') || '[]');
          
          availableRooms = availableRooms.map(room => {
            // Simple availability check against local bookings
            const isBooked = existingBookings.some((booking: any) => 
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
              booking.roomType === room.id &&
              booking.status !== 'cancelled' &&
              ((checkIn >= booking.checkIn && checkIn < booking.checkOut) ||
               (checkOut > booking.checkIn && checkOut <= booking.checkOut) ||
               (checkIn <= booking.checkIn && checkOut >= booking.checkOut))
            );
<<<<<<< HEAD

=======
            
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
            return {
              ...room,
              available: !isBooked
            };
          });
        }
<<<<<<< HEAD

=======
        
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
        setRooms(availableRooms);
      } catch (err) {
        console.error('Error loading rooms:', err);
        setError('Failed to load rooms');
<<<<<<< HEAD
        setRooms(ROOMS_DATA); // fallback data
=======
        // Still provide fallback data on error
        setRooms(ROOMS_DATA);
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [checkIn, checkOut]);

  const getRoomById = (id: number): Room | undefined => {
    return rooms.find(room => room.id === id.toString());
  };

<<<<<<< HEAD
  const getAvailableRooms = (): Room[] => {
    return rooms.filter(room => room.available);
  };

  const getRoomPrice = (
    roomId: number,
    mealPlan: 'bed_only' | 'bb' | 'half_board' | 'full_board' = 'bed_only'
  ): number => {
=======
  const getAvailableRooms = (): RoomWithAvailability[] => {
    return rooms.filter(room => room.available);
  };

  const getRoomPrice = (roomId: number, mealPlan: 'bed_only' | 'bb' | 'half_board' | 'full_board' = 'bed_only'): number => {
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
    const room = getRoomById(roomId);
    if (!room) return 0;
    return room[mealPlan] || room.price;
  };

<<<<<<< HEAD
  return {
    rooms,
    loading,
    error,
=======
  return { 
    rooms, 
    loading, 
    error, 
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
    getRoomById,
    getAvailableRooms,
    getRoomPrice
  };
<<<<<<< HEAD
};
=======
};
>>>>>>> 5b635d6ff0da3076e717578c254499e1f558c89a
