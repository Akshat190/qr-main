
import { Minus, Plus, Trash2, Clock } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useStore } from '../store/useStore';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useStore();

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
        <div className="flex items-center text-gray-600 mt-1">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{item.estimatedTime} mins</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};