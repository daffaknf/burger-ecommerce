import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍔</span>
              </div>
              <span className="text-xl font-display">BURGER HOUSE</span>
            </div>
            <p className="text-dark-300 text-sm">
              The best burgers in town. Made fresh daily with premium
              ingredients and served with love.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display mb-4">Quick Links</h3>
            <ul className="space-y-2 text-dark-300">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="hover:text-primary-500 transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="hover:text-primary-500 transition-colors"
                >
                  Special Offers
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-primary-500 transition-colors"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-display mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-dark-300 text-sm">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>10:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>11:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>11:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-display mb-4">Contact Us</h3>
            <ul className="space-y-3 text-dark-300 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span>123 Burger Street, Food City, FC 12345</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} />
                <span>hello@burgerhouse.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-dark-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Burger House. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
