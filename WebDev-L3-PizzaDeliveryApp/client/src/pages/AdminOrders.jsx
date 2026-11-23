import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/admin/orders`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await res.json();
    if (res.ok) setOrders(data);
    else toast.error(data.message || "Failed to load orders");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, []);

  const changeStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/admin/orders/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      },
    );
    if (res.ok) {
      toast.success("Status updated");
      fetchOrders();
    } else {
      toast.error("Update failed");
    }
  };

  return (
    <section className="min-h-[80vh] bg-white px-4 py-16 text-[#141414]">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-4xl font-extrabold uppercase">
          Admin <span className="text-[#F7941D]">Orders</span>
        </h2>

        <div className="mt-10 space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-extrabold">
                    #{order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.user?.name} · {order.user?.email}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {order.items.map((i) => i.name).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-[#F7941D]">
                    ₹{order.totalAmount}
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment: {order.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Order Received", "In Kitchen", "Sent to Delivery"].map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => changeStatus(order._id, s)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                        order.status === s
                          ? "bg-[#F7941D] text-white"
                          : "border border-[#F5E6CC] bg-white text-gray-600"
                      }`}
                    >
                      {s}
                    </button>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminOrders;
