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
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 ">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl">🍔</span>
              </div>
              <span className="text-xl font-bold text-white">Burger House</span>
            </div>

            <p className="text-sm leading-relaxed text-gray-400">
              Freshly grilled burgers made with premium ingredients. Experience
              the best taste in town with every bite.
            </p>

            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-5 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Home", path: "/" },
                { name: "Menu", path: "/menu" },
                { name: "Special Offers", path: "/offers" },
                { name: "Cart", path: "/cart" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="hover:text-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* OPENING HOURS */}
          <div>
            <h3 className="text-white font-semibold mb-5 tracking-wide">
              Opening Hours
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>10AM - 10PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>11AM - 11PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>11AM - 9PM</span>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-5 tracking-wide">
              Contact
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <MapPin size={18} className="text-primary-500 mt-1" />
                <span>123 Burger Street, Food City</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-primary-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-primary-500" />
                <span>hello@burgerhouse.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Burger House. All rights reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <Link to="#" className="hover:text-primary-500">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-primary-500">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
