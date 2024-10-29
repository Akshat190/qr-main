import React from 'react';
import { Users, Heart, Coffee } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-xl text-gray-600">
            Revolutionizing the dining experience through innovative technology
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352"
            alt="Restaurant"
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-6">
              Founded in 2024, QR Menu was born from a simple idea: make dining more
              efficient and enjoyable for both customers and restaurant owners. We
              believe in leveraging technology to create seamless experiences that
              enhance the traditional dining experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                <h3 className="font-semibold mb-1">500+</h3>
                <p className="text-gray-600">Restaurants</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                <h3 className="font-semibold mb-1">50,000+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <Coffee className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                <h3 className="font-semibold mb-1">1M+</h3>
                <p className="text-gray-600">Orders Served</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            We're committed to transforming the restaurant industry by providing
            innovative solutions that make dining out more enjoyable and efficient.
            Our platform helps restaurants streamline their operations while
            offering customers a modern, contactless ordering experience.
          </p>
        </div>
      </div>
    </div>
  );
};