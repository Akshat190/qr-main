import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Cart } from './pages/Cart';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import PrivateRoute from './components/ProtectedRoute';
import { checkAuth } from './utils/auth';
import { RestaurantMenu } from './pages/RestaurantMenu';

function App() {
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/menu/:restaurantId" element={<RestaurantMenu />} />
          <Route path="/restaurant/:restaurantId/menu" element={<RestaurantMenu />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
