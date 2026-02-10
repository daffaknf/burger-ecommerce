import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Tag,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import api from "../../utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get("/orders/stats/dashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-blue-500",
      link: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Products",
      icon: Package,
      color: "bg-purple-500",
      link: "/admin/products",
    },
    {
      title: "Promotions",
      icon: Tag,
      color: "bg-orange-500",
      link: "/admin/promotions",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <Link
              key={index}
              to={card.link || "#"}
              className="card card-hover p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <card.icon size={24} className="text-white" />
                </div>
                <TrendingUp size={20} className="text-green-500" />
              </div>
              <h3 className="text-dark-600 text-sm mb-1">{card.title}</h3>
              <p className="text-2xl font-bold">{card.value || "View"}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-2xl font-display mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {stats?.recentOrders?.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <div className="font-semibold">{order.order_number}</div>
                    <div className="text-sm text-dark-600">
                      {order.customer_name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-600">
                      ${order.final_amount}
                    </div>
                    <div className="text-xs badge badge-primary">
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/orders" className="btn btn-outline w-full mt-4">
              View All Orders
            </Link>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-display mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/admin/products" className="btn btn-primary w-full">
                Manage Products
              </Link>
              <Link to="/admin/promotions" className="btn btn-primary w-full">
                Manage Promotions
              </Link>
              <Link to="/admin/pos" className="btn btn-primary w-full">
                POS System
              </Link>
              <Link to="/admin/orders" className="btn btn-outline w-full">
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
