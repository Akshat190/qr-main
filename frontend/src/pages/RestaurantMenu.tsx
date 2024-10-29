import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MenuCard } from '../components/MenuCard';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  estimatedTime: number;
  image: string;
  category: string;
}

export const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantMenu = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${restaurantId}/menu`);
        setMenuItems(response.data.menuItems);
        setRestaurantName(response.data.restaurantName);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurantMenu();
    }
  }, [restaurantId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{restaurantName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}; 