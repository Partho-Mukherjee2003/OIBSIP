import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
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
    const data = await res.json();
    if (res.ok) {
      toast.success("Status updated");
      fetchOrders();
    } else {
      toast.error(data.message || "Update failed");
    }
  };

  const cancelOrder = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/admin/orders/${id}/cancel`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await res.json();
    if (res.ok) {
      toast.success("Order cancelled");
      fetchOrders();
    } else {
      toast.error(data.message || "Cancel failed");
    }
  };

  const removeOrder = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/admin/orders/${id}/hide`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await res.json();
    if (res.ok) {
      toast.success("Removed from list");
      fetchOrders();
    } else {
      toast.error(data.message || "Remove failed");
    }
  };

  return (
    <section className="min-h-[80vh] bg-white px-4 py-16 text-[#141414]">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-4xl font-extrabold uppercase">
          Admin <span className="text-[#F7941D]">Orders</span>
        </h2>

        {loading ? (
          <Loader />
        ) : (
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
                    <p className="text-sm font-bold">
                      Status:{" "}
                      <span
                        className={
                          order.status === "Cancelled"
                            ? "text-red-600"
                            : "text-gray-700"
                        }
                      >
                        {order.status}
                      </span>
                    </p>
                    {order.status === "Cancelled" && order.cancelledBy && (
                      <p className="mt-1 text-sm font-bold text-red-600">
                        {order.cancelledBy === "user"
                          ? "Cancelled by User"
                          : "Cancelled by Admin"}
                      </p>
                    )}
                  </div>
                </div>

                {(order.phone || order.address?.details) && (
                  <div className="mt-4 rounded-2xl bg-white p-4 text-sm">
                    <p className="font-extrabold uppercase text-[#141414]">
                      Delivery Address
                    </p>
                    {order.phone && (
                      <p className="mt-1 text-gray-600">Phone: {order.phone}</p>
                    )}
                    {order.address?.details && (
                      <p className="text-gray-600">
                        {order.address.details}, {order.address.city},{" "}
                        {order.address.state}, {order.address.country}
                      </p>
                    )}
                  </div>
                )}

                {order.status !== "Cancelled" && (
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

                    {order.paymentStatus === "Pending" && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-red-700"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                )}

                {(order.status === "Cancelled" ||
                  (order.paymentStatus === "Paid" &&
                    order.status === "Sent to Delivery")) && (
                  <button
                    onClick={() => removeOrder(order._id)}
                    className="mt-3 rounded-full border-2 border-gray-200 bg-white px-4 py-1.5 text-xs font-bold text-gray-500 transition hover:border-gray-400 hover:text-gray-700"
                  >
                    Remove from List
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminOrders;
