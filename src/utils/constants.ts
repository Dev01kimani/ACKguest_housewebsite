// Contact Information
export const CONTACT_INFO = {
  phone: '+254 759 750 318',
  email: 'josekeam01@gmail.com',
  whatsapp: '+254759750318',
  address: {
    street: 'ACK Mt. Kenya Guest House',
    city: 'Nyeri',
    country: 'Kenya'
  }
};

// Business Hours
export const BUSINESS_HOURS = {
  reception: '24 Hours Daily',
  checkin: '2:00 PM',
  checkout: '11:00 AM'
};

// Room Categories
export const ROOM_CATEGORIES = {
  STANDARD: 'standard',
  DELUXE: 'deluxe',
  FAMILY: 'family',
  EXECUTIVE: 'executive'
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const;

// Common amenities
export const COMMON_AMENITIES = [
  'Free Wi-Fi',
  'Private Bathroom',
  'TV',
  'Mini Fridge',
  'Work Desk',
  'Wardrobe',
  'Balcony',
  'Lake View',
  'Coffee Machine',
  'Seating Area',
  'Kitchenette'
];

// Pricing
export const ADDITIONAL_SERVICES = {
  AIRPORT_TRANSFER: 2500,
  BREAKFAST_PACKAGE: 800,
  TOUR_GUIDE: 3000
};

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: '#',
  instagram: '#',
  whatsapp: `https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}`
};