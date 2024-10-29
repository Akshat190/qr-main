import React, { useState } from 'react';
import { Clock, Plus, Minus, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../types';
import { useStore } from '../store/useStore';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard = ({ item }: MenuCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    setQuantity(1);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{item.name}</h3>
          <span className="bg-white px-3 py-1 rounded-full text-indigo-600 font-semibold shadow-lg">
            ${item.price.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        <div className="flex items-center text-gray-500 mb-4">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{item.estimatedTime} mins</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 hover:bg-gray-200 rounded-md transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 hover:bg-gray-200 rounded-md transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
