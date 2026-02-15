import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginbg from "../assets/login.jpg"; // Bisa ganti gambar login
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 ">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* LEFT IMAGE */}
        <div className="hidden md:block relative">
          <img
            src={loginbg}
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="p-10 flex flex-col justify-center items-center">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold">Welcome Back</h2>
            <p className="text-gray-500 text-xl">Login to your account</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-gray-300 py-3 pr-10 focus:border-orange-500 focus:outline-none bg-transparent"
                  required
                />
                <Mail
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
