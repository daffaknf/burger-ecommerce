import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-dark-300 mb-4" />
          <h2 className="text-3xl font-display mb-2">Your cart is empty</h2>
          <p className="text-dark-600 mb-6">
            Add some delicious burgers to get started!
          </p>
          <Link to="/menu" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="card p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-display text-lg">{item.name}</h3>
                        <p className="text-dark-600 text-sm line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-dark-100 hover:bg-dark-200 flex items-center justify-center transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-dark-500">
                          ${item.price.toFixed(2)} each
                        </div>
                        <div className="text-xl font-bold text-primary-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 font-semibold flex items-center space-x-2"
            >
              <Trash2 size={18} />
              <span>Clear Cart</span>
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-display mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-dark-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-dark-600">
                  <span>Tax (10%)</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ${(total * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <Link to="/checkout" className="btn btn-primary w-full mb-3">
                Proceed to Checkout
              </Link>

              <Link to="/menu" className="btn btn-outline w-full">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
