import React, { useState, useEffect } from 'react';
import {  PlusCircle, Clock, Download, Loader } from 'lucide-react';
import { useStore } from '../store/useStore';
import { QRCodeGenerator } from '../components/QRCodeGenerator';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { MenuItem, Order } from '../types';
// import { generateOrdersExcel } from '../utils/excelExport';
import toast from 'react-hot-toast';

axios.defaults.baseURL = 'http://localhost:5000'; // Update this to match your backend server's URL

// interface OrderItem {
//   menuItem: string;
//   name: string;
//   quantity: number;
//   price: number;
//   image?: string;
// }

export const Dashboard = () => {
  const { updateOrderStatus, addMenuItem, user, updateTotalRevenue } = useStore();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    estimatedTime: '',
    category: '',
    image: '',
  });

  const [categories] = useState([
    'Appetizers', 
    'Soups', 
    'Salads', 
    'Main Courses', 
    'Desserts', 
    'Beverages', 
    'Specials'
  ]);

  const totalRevenue = useStore((state) => state.totalRevenue);

  const [isExporting, setIsExporting] = useState(false);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const newItemWithId = {
        id: uuidv4(),
        name: newItem.name,
        description: newItem.description,
        price: Number(newItem.price),
        estimatedTime: Number(newItem.estimatedTime),
        category: newItem.category,
        image: newItem.image,
      };
      
      const response = await axios.post(
        '/api/menu-items',
        newItemWithId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      addMenuItem(response.data);
      setMenuItems(prev => [...prev, response.data]);
      setIsAddingItem(false);
      setNewItem({
        name: '',
        description: '',
        price: '',
        estimatedTime: '',
        category: '',
        image: '',
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Failed to add menu item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    // console.log('Deleting item with id:', id); 
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/menu-items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
    };
  };

  const fetchActiveOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders/active', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('Active orders:', response.data);
      setActiveOrders(response.data);
      useStore.getState().setOrders(response.data);
    } catch (error) {
      console.error('Error fetching active orders:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setActiveOrders((prevOrders) => prevOrders.filter((o) => o._id !== orderId));
      const filteredOrders = useStore.getState().orders.filter((o) => o._id !== orderId);
      useStore.getState().setOrders(filteredOrders);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Please try again.');
    }
  };

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
    fetchActiveOrders();
  }, []);

  const handleExportMonthlyOrders = async () => {
    try {
      setIsExporting(true);
      toast.loading('Generating monthly report...');
      
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders/monthly', {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `monthly-report-${new Date().toISOString().slice(0, 7)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.dismiss();
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export monthly report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {user && user.role === 'owner' && user.restaurantName && (
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
          Welcome back, {user.restaurantName}!
        </h1>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Menu Items
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            {menuItems.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Pending Orders
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            {activeOrders.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Active Orders</h2>
            </div>
            <div className="grid gap-4 sm:gap-6">
              {activeOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-indigo-500 transition-all"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex gap-3 sm:gap-4 items-center">
                      <div className="bg-indigo-100 p-2 sm:p-3 rounded-lg">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-base sm:text-lg text-gray-900">Table {order.tableNumber}</span>
                          <span className="bg-indigo-100 text-indigo-700 text-xs sm:text-sm px-2 py-1 rounded-full">
                            #{order._id.slice(-4)}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {new Date(order.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={async () => {
                          try {
                            await updateOrderStatus(order._id, 'completed');
                            updateTotalRevenue(order.totalPrice);
                            setActiveOrders((prevOrders) => prevOrders.filter((o) => o._id !== order._id));
                            useStore.getState().setOrders((prevOrders) => prevOrders.filter((o) => o._id !== order._id));
                          } catch (error) {
                            console.error('Error updating order status:', error);
                          }
                        }}
                        className="flex-1 sm:flex-none bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm font-medium"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="flex-1 sm:flex-none border border-red-500 text-red-500 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-xs sm:text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                    {order.items.map((item: { menuItem: string; name: string; price: number; quantity: number; image?: string }) => (
                      <div key={item.menuItem} className="flex items-center gap-3 sm:gap-4 bg-white p-2 sm:p-3 rounded-lg">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm sm:text-base text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                Unit Price: ${(item.price / item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full self-start">
                              <p className="text-gray-700 font-medium text-xs sm:text-sm">
                                x{item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm sm:text-base text-gray-500">
                      Items: {order.items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0)}
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8 mb-8">
          <QRCodeGenerator 
            url={window.location.origin} 
            restaurantId={user?.id}
            restaurantName={user?.restaurantName} 
          />
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Menu Management</h2>
              <button
                onClick={() => setIsAddingItem(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                Add Item
              </button>
            </div>

            {isAddingItem && (
              <form onSubmit={handleAddItem} className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Estimated time (minutes)"
                    value={newItem.estimatedTime}
                    onChange={(e) => setNewItem({ ...newItem, estimatedTime: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Save Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingItem(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 space-y-4">
              {menuItems.map((item: MenuItem) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">{item.description}</p>
                    <p className="text-gray-500">${Number(item.price).toFixed(2)}</p>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Reports</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Export detailed monthly reports including order statistics, revenue, and product performance.
          </p>
          <button
            onClick={handleExportMonthlyOrders}
            disabled={isExporting}
            className={`flex items-center justify-center gap-2 w-full sm:w-auto 
              ${isExporting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
              } text-white px-6 py-2 rounded-lg transition-colors`}
          >
            {isExporting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export Monthly Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
