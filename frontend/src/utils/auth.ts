import axios from 'axios';
import { useStore } from '../store/useStore';

export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      useStore.getState().setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      useStore.getState().setUser(null);
      return false;
    }
  }
  return false;
};
