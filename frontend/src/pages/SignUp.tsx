import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { signup } from '../api/auth';
import { useStore } from '../store/useStore';

// Password regex: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const SignUp = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    restaurantName: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Password validation
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.role === 'owner' && !formData.restaurantName.trim()) {
      setError('Restaurant name is required for restaurant owners.');
      return;
    }

    try {
      const response = await signup(
        formData.email, 
        formData.password, 
        formData.role,
        formData.restaurantName
      );
      setUser(response.user);
      localStorage.setItem('token', response.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create an account');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us to start your journey</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Create a password"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must contain at least 8 characters, including uppercase, lowercase, number and special character.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                I am a...
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="customer">Customer</option>
                <option value="owner">Restaurant Owner</option>
              </select>
            </div>

            {/* Restaurant Name Field - Only shown for restaurant owners */}
            {formData.role === 'owner' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your restaurant name"
                  required
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transform transition-all active:scale-95 font-medium"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
