import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="bg-dark-900 text-black
     shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-l font-display">🍔</span>
            </div>
            <span className="text-2xl font-display font-semibold tracking-wider">
              burgerss!
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="hover:text-primary-500 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="hover:text-primary-500 transition-colors font-medium"
            >
              Menu
            </Link>
            <Link
              to="/offers"
              className="hover:text-primary-500 transition-colors font-medium"
            >
              Special Offers
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User size={18} />
                    <span className="text-sm">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 hover:text-primary-500 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            )}

            <Link
              to="/cart"
              className="relative flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-red-500 text-black
                 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse"
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-slide-up border-t border-dark-700">
            <Link
              to="/"
              className="block py-2 hover:text-primary-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="block py-2 hover:text-primary-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/offers"
              className="block py-2 hover:text-primary-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Special Offers
            </Link>

            {user ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 py-2 text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <div className="pt-3 border-t border-dark-700">
                  <div className="flex items-center space-x-2 py-2">
                    <User size={18} />
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 py-2 text-red-400"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-dark-700 space-y-2">
                <Link
                  to="/login"
                  className="block py-2 hover:text-primary-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-primary-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}

            <Link
              to="/cart"
              className="flex items-center space-x-2 py-2 text-primary-500"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart size={18} />
              <span>Cart ({cartCount})</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
