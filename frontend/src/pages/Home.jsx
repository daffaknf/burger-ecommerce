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
        <div class="absolute top-15  text-center z-20">
          <h1 class="text-5xl font-poppins font-bold text-gray-900">
            Juicy Burger
          </h1>
          <p class="mt-2 text-lg  text-gray-600">Fresh • Tasty • Handmade</p>
        </div>

        <img
          src={burger}
          alt="Burger"
          class="w-[891px] md:w-[891px] md:h-[634px] z-10"
        />

        <img
          src={selada}
          class="absolute left-20 top-20 w-[337px] md:w-[337px] md:h-[225px] rotate-[-12deg]"
        />

        <img
          src={tomat}
          class="absolute left-10 bottom-32 w-[206px] md:w-[206px] md:h-[206px] rotate-[8deg]"
        />
        <img
          src={timun}
          class="absolute left-[30px] bottom-60 
          w-[147px] md:w-[373px]
          rotate-[10deg]"
        />

        <img
          src={keju}
          class="absolute right-20 top-10 w-[382px] md:w-[382px] md:h-[410px] rotate-[10deg]"
        />

        <img
          src={bombay}
          class="absolute right-60 bottom-28 w-[192px] md:w-[200px] md:h-[190px] rotate-[-8deg]"
        />
      </section>

      {/* Special Offers Section */}
      {promotions.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-display mb-2">
                <Sparkles className="inline text-primary-600 mr-2" />
                Special Offers
              </h2>
              <p className="text-dark-500">
                Limited time deals you don't want to miss!
              </p>
            </div>
            <Link
              to="/offers"
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
            >
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="card bg-gradient-to-br from-primary-50 to-primary-100 p-6 border-2 border-primary-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {promo.discount_type === "percentage"
                      ? `${promo.discount_value}% OFF`
                      : `$${promo.discount_value} OFF`}
                  </div>
                  <div className="flex items-center text-xs text-dark-600">
                    <Clock size={14} className="mr-1" />
                    Limited Time
                  </div>
                </div>
                <h3 className="text-xl font-display mb-2">{promo.title}</h3>
                <p className="text-dark-600 text-sm mb-4">
                  {promo.description}
                </p>
                {promo.code && (
                  <div className="bg-white border-2 border-dashed border-primary-600 rounded-lg p-3 text-center">
                    <span className="text-xs text-dark-500">Use code:</span>
                    <div className="text-lg font-bold text-primary-700">
                      {promo.code}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="bg-dark-50 py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-display mb-2">Featured Menu</h2>
                <p className="text-dark-500">
                  Our chef's special recommendations
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="card card-hover group">
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-display mb-2">
                      {product.name}
                    </h3>
                    <p className="text-dark-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        ${product.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-primary text-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Products Section */}
      {popularProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-display mb-2">
                <TrendingUp className="inline text-primary-600 mr-2" />
                Popular Picks
              </h2>
              <p className="text-dark-500">
                Customer favorites that keep selling out!
              </p>
            </div>
            <Link
              to="/menu"
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
            >
              View All Menu <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProducts.map((product) => (
              <div key={product.id} className="card card-hover">
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg mb-1">
                      {product.name}
                    </h3>
                    <p className="text-dark-600 text-sm line-clamp-2 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">
                        ${product.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
