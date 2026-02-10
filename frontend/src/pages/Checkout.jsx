import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Tag, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    promoCode: "",
    notes: "",
  });

  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const discountAmount = discount?.discount_amount || 0;
  const total = subtotal + tax - discountAmount;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode.trim()) return;

    try {
      setPromoLoading(true);
      const response = await api.post("/promotions/validate", {
        code: formData.promoCode,
        totalAmount: subtotal,
      });
      setDiscount(response.data.promotion);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid promo code");
      setDiscount(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    if (!formData.name || !formData.phone) {
      alert("Please fill in your name and phone number");
      return;
    }

    try {
      setLoading(true);

      // Create order in database
      const orderData = {
        user_id: user?.id,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        promotion_id: discount?.id,
        notes: formData.notes,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/orders", orderData);
      const { orderNumber, finalAmount } = response.data;

      // Generate WhatsApp message
      let message = `🍔 *New Order from Burger House*\n\n`;
      message += `📝 Order #: ${orderNumber}\n`;
      message += `👤 Name: ${formData.name}\n`;
      message += `📞 Phone: ${formData.phone}\n\n`;
      message += `*Order Items:*\n`;

      cartItems.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x${item.quantity} - $${(
          item.price * item.quantity
        ).toFixed(2)}\n`;
      });

      message += `\n*Order Summary:*\n`;
      message += `Subtotal: $${subtotal.toFixed(2)}\n`;
      message += `Tax (10%): $${tax.toFixed(2)}\n`;
      if (discountAmount > 0) {
        message += `Discount: -$${discountAmount.toFixed(2)}\n`;
      }
      message += `*Total: $${finalAmount.toFixed(2)}*\n\n`;

      if (formData.notes) {
        message += `📌 Notes: ${formData.notes}\n`;
      }

      // Open WhatsApp
      const whatsappNumber = "1234567890"; // Replace with restaurant's WhatsApp number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");

      // Clear cart and redirect
      clearCart();
      alert("Order placed successfully! You will be redirected to WhatsApp.");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Order error:", error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="card p-6">
              <h2 className="text-2xl font-display mb-4">
                Customer Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Order Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="input"
                    placeholder="Special requests, allergies, etc."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="card p-6">
              <h2 className="text-2xl font-display mb-4">Promo Code</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  className="input flex-1"
                  placeholder="Enter promo code"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoLoading}
                  className="btn btn-outline"
                >
                  {promoLoading ? "Checking..." : "Apply"}
                </button>
              </div>
              {discount && (
                <div className="mt-3 flex items-center text-green-600">
                  <Check size={18} className="mr-2" />
                  <span>Promo code applied successfully!</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-display mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-dark-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-dark-600">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                disabled={loading}
                className="btn btn-primary w-full mt-6 flex items-center justify-center"
              >
                <MessageCircle size={20} className="mr-2" />
                {loading ? "Processing..." : "Order via WhatsApp"}
              </button>

              <p className="text-xs text-dark-500 text-center mt-4">
                You'll be redirected to WhatsApp to confirm your order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
