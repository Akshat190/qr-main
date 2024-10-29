import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CartItem } from '../components/CartItem';
import axios from 'axios';

export const Cart = () => {
  const [tableNumber, setTableNumber] = useState('');
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalTime = Math.max(
    ...cart.map((item) => item.estimatedTime)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber || cart.length === 0) return;

    try {
      const order = {
        items: cart.map(item => ({
          menuItem: item.id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          image: item.image // Add this line
        })),
        tableNumber: parseInt(tableNumber),
        totalPrice: totalPrice
      };

      const response = await axios.post('/api/orders', order);
      const orderId = response.data._id;

      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating order:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      // Display an error message to the user
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-600">Estimated Time:</span>
              <span className="font-semibold">{totalTime} mins</span>
            </div>
            <div>
              <span className="text-gray-600">Total:</span>
              <span className="text-2xl font-bold text-gray-900 ml-2">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Table Number
              </label>
              <input
                type="number"
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="1"
                placeholder="Enter your table number"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 font-medium"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
