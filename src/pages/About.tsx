import React from 'react';
import { Users, Heart, Award, MapPin, Clock, Coffee, Phone } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Hospitality',
      description: 'We treat every guest like family, ensuring a warm and welcoming experience from arrival to departure.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in accommodation, service, and cleanliness to exceed your expectations.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We support our local community and provide guests with authentic cultural experiences.'
    }
  ];

  const facilities = [
    'Free high-speed Wi-Fi throughout the property',
    'Complimentary breakfast with local and continental options',
    'Secure parking for all guests',
    '24/7 reception and security service',
    'Laundry service available',
    'Tour and activity arrangements',
    'Airport transfer service',
    'Beautiful garden and outdoor seating areas'
  ];

  const teamMembers = [
    {
      name: 'Grace Wanjiku',
      role: 'General Manager',
      description: 'With over 10 years in hospitality, Grace ensures every guest has an exceptional experience.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    },
    {
      name: 'James Mwangi',
      role: 'Guest Relations',
      description: 'James helps coordinate tours and activities, sharing his extensive knowledge of the Naivasha region.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    },
    {
      name: 'Mary Njeri',
      role: 'Head of Housekeeping',
      description: 'Mary maintains our high standards of cleanliness and comfort in all our accommodations.',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About ACK Mt. Kenya Guest House, Nyeri
          </h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Discover the story behind Nyeri's most welcoming guest house
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  ACK Mt. Kenya Guest House, Nyeri was born from a simple dream: to create a peaceful retreat 
                  where travelers could experience the true warmth of Kenyan hospitality while exploring 
                  the breathtaking beauty of the Naivasha region.
                </p>
                <p>
                  Founded in 2018 by the Kimani family, who have deep roots in the Nyeri community, 
                  our guest house combines modern comfort with traditional values. We believe that every 
                  journey should be more than just a place to sleep – it should be a home away from home.
                </p>
                <p>
                  Located just minutes from Nyeri town and surrounded by stunning landscapes, we offer 
                  our guests the perfect base to explore the region's natural wonders.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Guest house exterior"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold">6+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at ACK Mt. Kenya Guest House
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Surroundings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.pexels.com/photos/2506947/pexels-photo-2506947.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Lake Naivasha view"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-6 w-6 text-amber-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Perfect Location
                </h2>
              </div>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Strategically located in the heart of Nyeri, we're perfectly positioned for 
                  exploring the region's many attractions while maintaining a peaceful, residential feel.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Insert something about nyeri</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Another one</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Another one</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>How many hours drive from nairobi</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Facilities & Services
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for accommodation, events, and conferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {facilities.map((facility, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                <div className="bg-green-100 p-2 rounded-full">
                  <Coffee className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">{facility}</span>
              </div>
            ))}
          </div>

          {/* Hall Hire & Catering Services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hall Hire */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-amber-600 text-white p-6">
                <h3 className="text-2xl font-bold">Hall Hire Only</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">50–200 pax</span>
                    <span className="text-xl font-bold text-amber-600">KSh 10,000</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">20–50 pax</span>
                    <span className="text-xl font-bold text-amber-600">KSh 5,000</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">20–30 pax</span>
                    <span className="text-xl font-bold text-amber-600">KSh 3,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">7–9 pax</span>
                    <span className="text-xl font-bold text-amber-600">KSh 2,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meals */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-green-600 text-white p-6">
                <h3 className="text-2xl font-bold">Meals – Per Person</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Breakfast</span>
                    <span className="text-xl font-bold text-green-600">KSh 500</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Tea/Coffee with Snacks</span>
                    <span className="text-xl font-bold text-green-600">KSh 300</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Buffet Lunch</span>
                    <span className="text-xl font-bold text-green-600">KSh 800</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Buffet Dinner</span>
                    <span className="text-xl font-bold text-green-600">KSh 800</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">High Tea</span>
                    <span className="text-xl font-bold text-green-600">KSh 600</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catering Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Outside Catering Services
            </h2>
            <p className="text-xl text-gray-600">
              Professional catering for all your special events
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Corporate Events',
              'Weddings',
              'Birthday Parties',
              'Ruracio Events',
              'Burials',
              'Graduation',
              'Church Events',
              'Public/Community Meetings'
            ].map((service, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{service}</h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">Contact for Catering Services</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:+254735756923"
                  className="flex items-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span>0735 756923</span>
                </a>
                <p className="text-amber-800">
                  📍 Nyeri, opposite Wamuti Distributors on your way to King'ong'o near Chania Bridge
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The friendly faces behind your exceptional experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-lg shadow-md">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-amber-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Experience Our Hospitality
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Join the many satisfied guests who have made ACK Mt. Kenya Guest house their home in Nyeri
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/booking"
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Book Your Stay
            </a>
            <a
              href="/contact"
              className="border-2 border-white hover:bg-white hover:text-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;