import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";

const AdminPOS = () => {
  return (
    <div className="min-h-screen bg-dark-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display mb-8">
          <CreditCard className="inline mr-3" />
          Point of Sale System
        </h1>
        <div className="card p-8 text-center">
          <p className="text-lg mb-4">
            POS interface for manual order entry - implement cashier interface
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

export default AdminPOS;
