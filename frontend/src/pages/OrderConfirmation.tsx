import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Utensils, Bell } from 'lucide-react';
import axios from 'axios';

interface OrderData {
  tableNumber: number;
  items: Array<{
    name: string;
    quantity: number;
    image?: string;
    price: number;
  }>;
  totalPrice: number;
}

export const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrderData(response.data);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Your order has been placed successfully. Enjoy your meal!
        </p>
        <div className="bg-indigo-50 rounded-md p-6 mb-8 text-center">
          <Utensils className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
          <p className="text-sm text-indigo-600 mb-2">Your Table Number</p>
          <p className="text-4xl font-bold text-indigo-700">{orderData.tableNumber}</p>
        </div>
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
          <div className="space-y-4">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-6 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">${orderData.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center space-x-4 mb-8 bg-yellow-50 p-4 rounded-md">
          <Bell className="w-8 h-8 text-yellow-500" />
          <p className="text-sm text-yellow-700">
            We'll notify you when your order is ready!
          </p>
        </div>
        <Link
          to="/menu"
          className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-md text-center font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
};
