import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const statusColor = {
  "Order Received": "bg-yellow-100 text-yellow-700",
  "In Kitchen": "bg-blue-100 text-blue-700",
  "Sent to Delivery": "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const steps = ["Order Received", "In Kitchen", "Sent to Delivery"];

const statusNote = {
  "Order Received": "We've got your order and will start on it shortly.",
  "In Kitchen": "Your pizza is being made right now.",
  "Sent to Delivery": "It's on its way to you. Enjoy!",
  Cancelled: "This order was cancelled. Please contact us if you need help.",
};

/* ---------- Animations (plain CSS, no extra packages) ---------- */
const styles = `
@keyframes moFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes moPop { 0% { opacity: 0; transform: scale(.7); } 70% { transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
@keyframes moGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes moBlink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }

.mo-reveal { opacity: 0; }
.mo-reveal.mo-in { animation: moFadeUp .6s cubic-bezier(.2,.7,.2,1) both; }
.mo-pop { animation: moPop .4s ease both; }
.mo-grow { transform-origin: left; animation: moGrow .9s cubic-bezier(.2,.7,.2,1) .2s both; }
.mo-blink { animation: moBlink 1.6s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .mo-reveal { opacity: 1; }
  .mo-reveal.mo-in, .mo-pop, .mo-grow, .mo-blink { animation: none; }
}
`;

// fades a block in the first time it scrolls into view
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`mo-reveal ${shown ? "mo-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

// simple 3-step progress: Received -> Kitchen -> Delivery
const Timeline = ({ status }) => {
  const found = steps.indexOf(status);
  const current = found === -1 ? 0 : found;
  const fill = (current / (steps.length - 1)) * 100;

  return (
    <div className="relative mt-6">
      {/* track runs between the first and last circle centers */}
      <div className="absolute left-[16.66%] right-[16.66%] top-[15px] h-1 rounded-full bg-[#F5E6CC]">
        <div
          key={status}
          className="mo-grow h-full rounded-full bg-[#F7941D]"
          style={{ width: `${fill}%` }}
        />
      </div>

      <div className="relative grid grid-cols-3">
        {steps.map((label, i) => {
          const reached = i <= current;
          const active = i === current;
          return (
            <div key={label} className="flex flex-col items-center text-center">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-extrabold transition-colors duration-500 ${
                  reached
                    ? "border-[#F7941D] bg-[#F7941D] text-white"
                    : "border-[#F5E6CC] bg-white text-gray-400"
                } ${active ? "ring-4 ring-[#F7941D]/25" : ""}`}
              >
                {i + 1}
              </span>
              <span
                className={`mt-2 px-1 text-[11px] font-semibold leading-tight sm:text-xs ${
                  reached ? "text-[#141414]" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderCard = ({ order, index, onCancel, onRemove }) => {
  const names = order.items.map((i) => i.name);
  const paid = String(order.paymentStatus).toLowerCase() === "paid";
  const cancelled = order.status === "Cancelled";
  const canCancel = !paid && order.status === "Order Received";
  const canRemove =
    cancelled ||
    (!paid && order.status === "Order Received") ||
    order.status === "Sent to Delivery";

  return (
    <Reveal delay={Math.min(index, 5) * 80}>
      <article className="rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#F7941D] hover:shadow-[0_20px_40px_-15px_rgba(247,148,29,0.45)] sm:p-7">
        {/* header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Order
            </p>
            <p className="text-2xl font-extrabold uppercase text-[#141414]">
              #{order._id.slice(-6)}
            </p>
          </div>
          <span
            key={order.status}
            className={`mo-pop rounded-full px-4 py-1.5 text-xs font-bold ${
              statusColor[order.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* friendly one-liner */}
        <p className="mt-3 text-sm text-gray-500">
          {statusNote[order.status] || "We're working on your order."}
        </p>

        {/* ke cancel korlo */}
        {cancelled && order.cancelledBy && (
          <p className="mt-2 text-sm font-semibold text-red-600">
            {order.cancelledBy === "user"
              ? "Cancelled by you"
              : "Cancelled by Pizza Dot"}
          </p>
        )}

        {!cancelled && <Timeline status={order.status} />}

        {/* items */}
        <div className="mt-6 border-t border-[#F5E6CC] pt-5">
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
            What's in it ({names.length} {names.length === 1 ? "item" : "items"}
            )
          </p>
          <div className="flex flex-wrap gap-2">
            {names.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="rounded-full border border-[#F5E6CC] bg-white px-3 py-1 text-sm text-gray-700"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* delivery address */}
        {(order.phone || order.address?.details) && (
          <div className="mt-6 rounded-2xl bg-white p-4 text-sm">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Deliver to
            </p>
            {order.phone && (
              <p className="mt-2 text-gray-700">Phone: {order.phone}</p>
            )}
            {order.address?.details && (
              <p className="text-gray-700">
                {order.address.details}, {order.address.city},{" "}
                {order.address.state}, {order.address.country}
              </p>
            )}
          </div>
        )}

        {/* footer */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-3xl font-extrabold text-[#F7941D]">
              ₹{order.totalAmount}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString([], {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="mt-1 text-sm">
              <span className="text-gray-500">Payment: </span>
              <span
                className={
                  paid
                    ? "font-semibold text-green-600"
                    : "font-semibold text-yellow-600"
                }
              >
                {order.paymentStatus}
              </span>
            </p>
          </div>
        </div>

        {/* cancel button — shudhu unpaid + Order Received hole */}
        {canCancel && (
          <button
            type="button"
            onClick={() => onCancel(order._id)}
            className="mt-5 w-full rounded-full border-2 border-red-200 bg-white py-2.5 text-sm font-bold uppercase text-red-600 transition hover:bg-red-600 hover:text-white"
          >
            Cancel Order
          </button>
        )}

        {/* remove from list button */}
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(order._id)}
            className="mt-3 w-full rounded-full border-2 border-gray-200 bg-white py-2.5 text-sm font-bold uppercase text-gray-500 transition hover:border-gray-400 hover:text-gray-700"
          >
            Remove from List
          </button>
        )}
      </article>
    </Reveal>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const cancelOrder = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/orders/${id}/cancel`,
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
    } catch {
      toast.error("Server error. Please try again.");
    }
  };

  const removeOrder = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/orders/${id}/hide`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Removed from your list");
        fetchOrders();
      } else {
        toast.error(data.message || "Remove failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, 5000); // 5 sec por por status refresh
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-[80vh] bg-white px-4 py-16 text-[#141414] sm:py-20">
      <style>{styles}</style>

      <div className="mx-auto max-w-4xl">
        {/* heading */}
        <Reveal className="text-center">
          <p className="text-xl italic text-[#F7941D] sm:text-2xl">
            Track Your Pizza
          </p>
          <h2 className="mt-2 text-4xl font-extrabold uppercase sm:text-5xl md:text-6xl">
            My <span className="text-[#F7941D]">Orders</span>
          </h2>
          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="mo-blink inline-block h-2 w-2 rounded-full bg-green-500" />
            Updates automatically, no need to refresh
          </p>
        </Reveal>

        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <Reveal className="mt-14">
            <div className="rounded-3xl border-2 border-dashed border-[#F5E6CC] bg-[#FFF9ED] px-6 py-14 text-center">
              <p className="text-2xl font-extrabold uppercase">
                Nothing here yet
              </p>
              <p className="mx-auto mt-2 max-w-sm text-gray-500">
                You haven't ordered anything so far. Build your first pizza and
                it will show up here, so you can follow it from kitchen to door.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 space-y-5">
            {orders.map((order, i) => (
              <OrderCard
                key={order._id}
                order={order}
                index={i}
                onCancel={cancelOrder}
                onRemove={removeOrder}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrders;
