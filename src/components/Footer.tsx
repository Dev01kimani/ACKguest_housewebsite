import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-400" />
                <span>+254 759 750 318</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-400" />
                <span>josekeam01@gmail.com.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-400" />
                <span>123 Drive<br />Nyeri, Kenya</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/rooms" className="text-gray-300 hover:text-amber-400 transition-colors">Rooms & Rates</a></li>
              <li><a href="/gallery" className="text-gray-300 hover:text-amber-400 transition-colors">Gallery</a></li>
              <li><a href="/booking" className="text-gray-300 hover:text-amber-400 transition-colors">Book Now</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Free Wi-Fi</li>
              <li>Breakfast Service</li>
              <li>24/7 Reception</li>
              <li>Tour Arrangements</li>
              <li>Airport Transfer</li>
            </ul>
          </div>

          {/* Social & Booking */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="bg-amber-600 p-2 rounded-full hover:bg-amber-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-amber-600 p-2 rounded-full hover:bg-amber-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://wa.me/254712345678" className="bg-green-600 p-2 rounded-full hover:bg-green-700 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
            <a
              href="https://wa.me/254712345678?text=Hi, I'd like to make a booking at Serenity Haven Guest House"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Booking</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ACK Mt. Kenay Guest House. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;