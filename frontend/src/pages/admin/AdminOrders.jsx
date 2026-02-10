import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const AdminOrders = () => {
  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display mb-8">
          <ShoppingCart className="inline mr-3" />
          Order Management
        </h1>
        <div className="card p-8 text-center">
          <p className="text-lg mb-4">
            Order tracking and status management - implement order operations
            here
          </p>
          <Link to="/admin" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
