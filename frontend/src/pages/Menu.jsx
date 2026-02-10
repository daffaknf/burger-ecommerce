import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import api from "../utils/api";
import { useCart } from "../context/CartContext";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const categoryParam =
        selectedCategory !== "all" ? `?category=${selectedCategory}` : "";
      const [productsRes, categoriesRes] = await Promise.all([
        api.get(`/products${categoryParam}&status=active`),
        api.get("/categories"),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error loading menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display mb-4">Our Menu</h1>
          <p className="text-dark-600 text-lg">
            Discover our delicious selection of burgers and more
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search burgers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400"
                size={20}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input pl-10"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card card-hover group">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.is_featured && (
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Featured
                    </div>
                  )}
                  {product.is_popular && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Popular
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-primary-600 font-semibold">
                      {product.category_name}
                    </span>
                  </div>
                  <h3 className="text-lg font-display mb-2">{product.name}</h3>
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
        )}
      </div>
    </div>
  );
};

export default Menu;
