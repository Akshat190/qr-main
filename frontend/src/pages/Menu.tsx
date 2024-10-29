import { useState, useEffect } from 'react';
import { ShoppingCart, ChefHat, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MenuCard } from '../components/MenuCard';
import axios from 'axios';

export const Menu = () => {
  const { menuItems, cart, setMenuItems } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(menuItems.map((item) => item.category)));
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('/api/menu-items');
        if (Array.isArray(response.data)) {
          setMenuItems(response.data);
        } else {
          console.error('Fetched data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, [setMenuItems]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 relative">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold mb-3">Explore Our Menu</h1>
              <p className="text-pink-100 text-base max-w-xl mx-auto md:mx-0">
                Dive into a world of flavors with our exquisite dishes, crafted to perfection.
              </p>
            </div>
            <Link
              to="/cart"
              className="mt-6 md:mt-0 flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-md"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold">Cart ({totalItems})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 bg-gradient-to-r from-purple-100 to-pink-100 shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 py-4 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              Try selecting a different category or view all items
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
