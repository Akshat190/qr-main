export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: number;
  image: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;  
  _id: string;
  items: OrderItem[];
  tableNumber: number;
  totalPrice: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
  restaurantId: string;
}

export interface OrderItem {
  menuItem: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'owner';
  restaurantName?: string;
}
