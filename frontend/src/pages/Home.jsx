import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, TrendingUp, Sparkles, Clock } from "lucide-react";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import bombay from "../assets/bombay.png";
import burger from "../assets/burger.png";
import keju from "../assets/keju.png";
import selada from "../assets/selada.png";
import timun from "../assets/timun.png";
import tomat from "../assets/tomat.png";
import paketburger from "../assets/paket burger.png";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [featuredRes, popularRes, promotionsRes] = await Promise.all([
        api.get("/products?featured=true&status=active"),
        api.get("/products?popular=true&status=active"),
        api.get("/promotions?active=true"),
      ]);

      setFeaturedProducts(featuredRes.data.slice(0, 4));
      setPopularProducts(popularRes.data.slice(0, 6));
      setPromotions(promotionsRes.data.slice(0, 3));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-[#FDF6EC] flex items-center justify-center overflow-hidden">
        <div className="absolute top-15  text-center z-20">
          <h1 className="text-5xl font-poppins font-bold text-gray-900">
            Delicious <br /> <span className="text-orange-600">Burger</span>{" "}
            Delivered
          </h1>
        </div>

        <img
          src={burger}
          alt="Burger"
          className="w-[891px] md:w-[891px] md:h-[634px] z-10"
        />

        <img
          src={selada}
          className="absolute left-20 top-20 w-[337px] md:w-[337px] md:h-[225px] rotate-[-12deg]"
        />

        <img
          src={tomat}
          className="absolute left-10 bottom-32 w-[206px] md:w-[206px] md:h-[206px] rotate-[8deg]"
        />
        <img
          src={timun}
          className="absolute left-[30px] bottom-60 
          w-[147px] md:w-[373px]
          rotate-[10deg]"
        />

        <img
          src={keju}
          className="absolute right-20 top-10 w-[382px] md:w-[382px] md:h-[410px] rotate-[10deg]"
        />

        <img
          src={bombay}
          className="absolute right-60 bottom-28 w-[192px] md:w-[200px] md:h-[190px] rotate-[-8deg]"
        />
      </section>

      {/* Special Offers Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          {/* Heading */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Dapatkan Penawaran Special
            </h2>
            <p className="text-gray-600">
              Nikmati penawaran disetiap gigitannya
            </p>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-3 items-center gap-8">
            {/* Left Promo */}
            <div>
              <h3 className="text-2xl font-bold mb-3">Penawaran Spesial</h3>
              <p className="text-gray-600 mb-6">
                Rasakan cita rasa burger premium yang dibuat dengan bahan-bahan
                terbaik.
              </p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition">
                Ambil promo
              </button>
            </div>

            {/* Middle Image */}
            <div className="flex justify-center">
              <img
                src={paketburger}
                alt="Burger"
                className="w-72 object-contain"
              />
            </div>

            {/* Right Promo */}
            <div className="border-l-2 border-red-300 pl-8">
              <h3 className="text-2xl font-bold mb-3">Buy 2 get 1</h3>
              <p className="text-gray-600 mb-6">
                Nikmati burger premium dengan bahan-bahan segar dan nikmati
                pengiriman cepat.
              </p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition">
                Ambil promo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      {/* Popular Products Section */}
      {popularProducts.length > 0 && (
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-6">
            {/* Heading Center */}
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900">
                Burger Terpopuler
              </h2>
              <p className="text-gray-600 mt-2">pilihan burger terbaik kami</p>
            </div>

            {/* Sub Heading */}
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Koleksi Burger</h3>
              <Link
                to="/menu"
                className="text-red-500 font-semibold hover:text-red-600"
              >
                Lihat semua
              </Link>
            </div>

            {/* Product Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                  {/* Favorite Icon */}
                  <div className="flex justify-end">
                    <button className="text-gray-400 hover:text-red-500 text-xl">
                      ♡
                    </button>
                  </div>

                  {/* Image */}
                  <div className="flex justify-center mb-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-40 h-40 object-contain"
                    />
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center text-orange-400 mb-2">
                    ★★★★☆
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-center mb-2">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm text-center mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <p className="text-red-500 font-bold text-center mb-4">
                    Rp {product.price}
                  </p>

                  {/* Quantity Control */}
                  <div className="flex items-center justify-center gap-4">
                    <button className="w-8 h-8 border rounded-full">-</button>
                    <span>0</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-8 h-8 border rounded-full"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-dark-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-display mb-4">Hungry? Order Now!</h2>
          <p className="text-xl text-dark-300 mb-8">
            Get your favorite burgers delivered fresh to your doorstep
          </p>
          <Link
            to="/menu"
            className="btn btn-primary bg-primary-600 hover:bg-primary-700 text-lg px-8"
          >
            Browse Full Menu <ChevronRight className="inline ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
