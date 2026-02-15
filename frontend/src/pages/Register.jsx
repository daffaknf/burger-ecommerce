import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import registerbg from "../assets/register.jpg";
import { User, Mail, Phone, Lock } from "lucide-react";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 mx-auto">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* LEFT IMAGE */}
        <div className="hidden md:block relative">
          <img
            src={registerbg}
            alt="Burger"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="p-10">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold">Daftar Sekarang</h2>
            <p className="text-gray-500 text-xl ">
              Dapatkan Promo yang lebih menarik
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-3 pr-10 focus:border-orange-500 focus:outline-none bg-transparent"
                  required
                />
                <User
                  className="absolute right-2 top-3 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-3 pr-10 focus:border-orange-500 focus:outline-none bg-transparent"
                  required
                />
                <Mail
                  className="absolute right-2 top-3 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-3 pr-10 focus:border-orange-500 focus:outline-none bg-transparent"
                />
                <Phone
                  className="absolute right-2 top-3 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-3 pr-10 focus:border-orange-500 focus:outline-none bg-transparent"
                  required
                />
                <Lock
                  className="absolute right-2 top-3 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-3 pr-10 focus:border-orange-500 focus:outline-none bg-transparent"
                  required
                />
                <Lock
                  className="absolute right-2 top-3 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition duration-300 shadow-md"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
