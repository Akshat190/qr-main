import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, LogOut, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <UtensilsCrossed className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">QR Menu</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/signin"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-gray-900 px-2"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-600 hover:text-gray-900 px-2"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
