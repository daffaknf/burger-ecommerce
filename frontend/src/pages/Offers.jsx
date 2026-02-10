import { useEffect, useState } from "react";
import { Clock, Tag, Gift } from "lucide-react";
import api from "../utils/api";

const Offers = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const response = await api.get("/promotions?active=true");
      setPromotions(response.data);
    } catch (error) {
      console.error("Error loading promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display mb-4">
            <Gift className="inline text-primary-600 mr-3" size={48} />
            Special Offers
          </h1>
          <p className="text-dark-600 text-lg">
            Don't miss out on our amazing deals and promotions!
          </p>
        </div>

        {promotions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-500 text-lg">
              No active promotions at the moment
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="card bg-gradient-to-br from-primary-50 via-white to-primary-50 border-2 border-primary-200 hover:border-primary-400 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
                      {promo.discount_type === "percentage"
                        ? `${promo.discount_value}% OFF`
                        : `$${promo.discount_value} OFF`}
                    </div>
                    <Tag className="text-primary-600" size={24} />
                  </div>

                  <h3 className="text-2xl font-display mb-3">{promo.title}</h3>
                  <p className="text-dark-600 mb-4">{promo.description}</p>

                  {promo.code && (
                    <div className="bg-white border-2 border-dashed border-primary-600 rounded-lg p-4 mb-4">
                      <div className="text-xs text-dark-500 mb-1">
                        Promo Code:
                      </div>
                      <div className="text-xl font-bold text-primary-700 tracking-wide">
                        {promo.code}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-dark-600">
                    {promo.min_purchase > 0 && (
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">
                          Min. Purchase:
                        </span>
                        <span>${promo.min_purchase}</span>
                      </div>
                    )}
                    <div className="flex items-center text-xs">
                      <Clock size={14} className="mr-1" />
                      <span>Valid until {formatDate(promo.end_date)}</span>
                    </div>
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

export default Offers;
