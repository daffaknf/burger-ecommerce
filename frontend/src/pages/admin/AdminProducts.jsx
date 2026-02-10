import { Link } from "react-router-dom";
import { Package } from "lucide-react";

const AdminProducts = () => {
  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display mb-8">
          <Package className="inline mr-3" />
          Product Management
        </h1>
        <div className="card p-8 text-center">
          <p className="text-lg mb-4">
            Product management interface - implement CRUD operations here
          </p>
          <Link to="/admin" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
