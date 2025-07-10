import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Phone, MessageCircle } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import type { BookingData } from '../utils/types';

const Booking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<BookingData | null>(null);
  
  const selectedRoom = searchParams.get('room');

  const handleBookingSubmit = (data: BookingData) => {
    setSubmittedData(data);
    setIsSubmitted(true);
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  const calculateBookingTotal = () => {
    if (!submittedData) return 0;
    const nights = Math.ceil((new Date(submittedData.checkOut).getTime() - new Date(submittedData.checkIn).getTime()) / (1000 * 3600 * 24));
    // This would normally come from room data, using a default price for demo
    const roomPrice = 5000; // Default price
    return nights * roomPrice;
  };

  const calculateDepositAmount = () => {
    const total = calculateBookingTotal();
    return Math.ceil((total * 0.5) / 50) * 50; // 50% rounded to nearest 50 KSh
  };

  if (isSubmitted && submittedData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Success Message */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Booking Request Submitted!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Thank you for your booking request. We've received your information and will contact you shortly to confirm your reservation.
              </p>

              {/* Booking Details Summary */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {submittedData.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {submittedData.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {submittedData.phone}
                  </div>
                  <div>
                    <span className="font-medium">Guests:</span> {submittedData.guests}
                  </div>
                  <div>
                    <span className="font-medium">Check-in:</span> {new Date(submittedData.checkIn).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Check-out:</span> {new Date(submittedData.checkOut).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Total Amount:</span> KSh {calculateBookingTotal().toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Deposit Required:</span> KSh {calculateDepositAmount().toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-amber-900 mb-4">Payment Information</h3>
                <div className="space-y-2 text-amber-800">
                  <p>✅ Your booking has been created successfully</p>
                  <p>💳 A 50% deposit payment has been processed</p>
                  <p>📧 You will receive a confirmation email shortly</p>
                  <p>💰 Remaining balance can be paid during check-in</p>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-4 mb-8">
                <p className="text-gray-600">
                  For immediate assistance or to confirm your booking faster:
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+254712345678"
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Call Us</span>
                  </a>
                  
                  <a
                    href={`https://wa.me/254712345678?text=Hi, I just submitted a booking request. Here are my details:%0A%0AName: ${submittedData.name}%0ACheck-in: ${submittedData.checkIn}%0ACheck-out: ${submittedData.checkOut}%0AGuests: ${submittedData.guests}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>

              <button
                onClick={resetForm}
                className="text-amber-600 hover:text-amber-700 font-semibold"
              >
                Make Another Booking
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Book Your Stay
          </h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Reserve your comfortable accommodation at ACK Mt. Kenya Guest House
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Reservation Details
              </h2>
              <p className="text-gray-600">
                Fill in the form below to make your booking request. We'll contact you shortly to confirm availability and finalize your reservation.
              </p>
            </div>

            <BookingForm 
              selectedRoom={selectedRoom || undefined}
              onSubmit={handleBookingSubmit}
            />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help with Your Booking?</h2>
            <p className="text-xl text-gray-600">Our friendly staff is here to assist you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Phone className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak directly with our reservations team</p>
              <a
                href="tel:+254712345678"
                className="text-amber-600 hover:text-amber-700 font-semibold"
              >
                +254 712 345 678
              </a>
            </div>
            
            <div className="text-center p-6 border border-amber-200 rounded-lg bg-amber-50">
              <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">WhatsApp Booking</h3>
              <p className="text-gray-600 mb-4">Quick and easy booking via WhatsApp</p>
              <a
                href="https://wa.me/254712345678?text=Hi, I'd like to make a booking at Serenity Haven Guest House"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat Now</span>
              </a>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quick Response</h3>
              <p className="text-gray-600 mb-4">We typically respond within 2 hours during business hours</p>
              <span className="text-blue-600 font-semibold">8 AM - 8 PM EAT</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;