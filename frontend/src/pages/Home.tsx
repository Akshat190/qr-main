import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, LayoutDashboard, UtensilsCrossed, Star, Clock } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-6xl font-extrabold mb-4">Welcome to QR Menu</h1>
          <p className="text-2xl mb-8 max-w-2xl">
            Experience contactless dining with our digital menu system. Scan, order, and enjoy!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/menu"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-100 flex items-center font-semibold"
            >
              <UtensilsCrossed className="h-5 w-5 mr-2" />
              View Menu
            </Link>
            <Link
              to="/dashboard"
              className="bg-transparent text-white px-8 py-3 rounded-lg border-2 border-white hover:bg-white hover:text-indigo-600 flex items-center font-semibold"
            >
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Restaurant Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <QrCode className="h-16 w-16 mx-auto text-indigo-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Contactless Ordering</h3>
            <p className="text-gray-700">Scan QR code to view menu and place orders directly from your table</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <Clock className="h-16 w-16 mx-auto text-indigo-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-700">Track your order status and get notifications when it's ready</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <Star className="h-16 w-16 mx-auto text-indigo-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Easy Management</h3>
            <p className="text-gray-700">Restaurant owners can manage menu and orders efficiently</p>
          </div>
        </div>
      </div>
    </div>
  );
};