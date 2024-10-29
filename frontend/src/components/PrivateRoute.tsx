import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useStore((state) => state.user);
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token || !!user;

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};
