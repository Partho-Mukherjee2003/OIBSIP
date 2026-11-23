import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => console.log(err));
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/admin/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => console.log(err));
  }, [navigate]);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStock = items.filter((i) => i.stock < 20);

  return (
    <section className="min-h-[80vh] bg-white px-4 py-16 text-[#141414]">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-4xl font-extrabold uppercase">
          Admin <span className="text-[#F7941D]">Dashboard</span>
        </h2>

        {/* Stat cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-6 text-center">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-4xl font-extrabold text-[#F7941D]">
              {orders.length}
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-6 text-center">
            <p className="text-sm text-gray-500">Revenue (Paid)</p>
            <p className="text-4xl font-extrabold text-[#F7941D]">
              ₹{totalRevenue}
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-6 text-center">
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-4xl font-extrabold text-red-500">
              {lowStock.length}
            </p>
          </div>
        </div>

        {/* Action cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin/orders"
            className="rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-6 transition hover:-translate-y-1 hover:border-[#F7941D]"
          >
            <p className="text-xl font-extrabold uppercase">Manage Orders</p>
            <p className="mt-1 text-sm text-gray-500">
              See all orders and change their status
            </p>
          </Link>
          <Link
            to="/admin/inventory"
            className="rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-6 transition hover:-translate-y-1 hover:border-[#F7941D]"
          >
            <p className="text-xl font-extrabold uppercase">Manage Inventory</p>
            <p className="mt-1 text-sm text-gray-500">
              Update stock of bases, sauces, cheeses and vegetables
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
