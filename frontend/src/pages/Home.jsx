import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, TrendingUp, Sparkles, Clock } from "lucide-react";
import api from "../utils/api";
import { useCart } from "../context/CartContext";

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
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <div className="inline-block">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  🔥 New Menu Items Available
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-display leading-tight">
                THE BEST
                <br />
                <span className="text-yellow-300">BURGERS</span>
                <br />
                IN TOWN
              </h1>
              <p className="text-xl text-white/90">
                Handcrafted burgers made with premium ingredients, served fresh
                daily. Experience the taste of perfection!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/menu"
                  className="btn btn-primary bg-white text-primary-700 hover:bg-yellow-300"
                >
                  Order Now <ChevronRight className="inline ml-2" size={20} />
                </Link>
                <Link
                  to="/offers"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700"
                >
                  View Offers
                </Link>
              </div>
            </div>

            <div className="relative animate-float">
              <div className="absolute inset-0 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop"
                alt="Featured Burger"
                className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
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
