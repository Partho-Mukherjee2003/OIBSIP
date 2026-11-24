import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useCart } from "../context/useCart";
import OrderDialog from "../components/OrderDialog";

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart, totalItems, totalPrice } =
    useCart();
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    setShowDialog(true);
  };

  const handleConfirm = async (delivery) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    setShowDialog(false);

    try {
      // 1. Cart order banao
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/orders/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            address: delivery.address,
            phone: delivery.phone,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Order failed");

      // 2. Razorpay order banao
      const payRes = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId: data.order._id }),
        },
      );
      const payData = await payRes.json();

      // 3. Razorpay popup kholo
      const options = {
        key: payData.keyId,
        amount: payData.amount,
        currency: "INR",
        name: "Pizza Dot",
        description: "Cart Order",
        order_id: payData.razorpayOrderId,
        handler: async (response) => {
          const verifyRes = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/api/payment/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ ...response, orderId: data.order._id }),
            },
          );
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            clearCart();
            toast.success("Payment successful! Order placed.");
            navigate("/my-orders");
          } else {
            toast.error(verifyData.message || "Payment failed");
          }
        },
        theme: { color: "#F7941D" },
      };
      new window.Razorpay(options).open();
    } catch {
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <section className="min-h-[80vh] bg-white px-4 py-16 text-[#141414] sm:py-20">
      <div className="mx-auto max-w-5xl">
        {/* heading */}
        <div className="text-center">
          <p className="text-xl italic text-[#F7941D] sm:text-2xl">
            Your Selections
          </p>
          <h2 className="mt-2 text-4xl font-extrabold uppercase sm:text-5xl md:text-6xl">
            Your <span className="text-[#F7941D]">Cart</span>
          </h2>
          <p className="mt-4 text-sm text-gray-500 sm:text-base">
            {totalItems === 0
              ? "Nothing here yet — pick a pizza from the menu."
              : `${totalItems} ${totalItems === 1 ? "item" : "items"} waiting for you`}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="mx-auto mt-14 max-w-md rounded-3xl border-2 border-dashed border-[#F5E6CC] bg-[#FFF9ED] px-6 py-14 text-center">
            <FaShoppingCart className="mx-auto text-5xl text-[#F7941D]" />
            <p className="mt-4 text-2xl font-extrabold uppercase">
              Cart is empty
            </p>
            <p className="mt-2 text-gray-500">
              Add a pizza from the menu and it will show up here.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-block rounded-full bg-[#F7941D] px-8 py-3 font-bold uppercase text-black transition hover:bg-[#141414] hover:text-white"
            >
              Go to Menu
            </Link>
          </div>
        ) : (
          <>
            {/* pizza cards */}
            <div className="mt-12 space-y-5">
              {cart.map((item) => (
                <article
                  key={item._id}
                  className="flex flex-col gap-4 rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#F7941D] hover:shadow-[0_20px_40px_-15px_rgba(247,148,29,0.45)] sm:flex-row sm:items-center sm:p-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-32 w-full rounded-2xl object-cover sm:h-24 sm:w-32"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xl font-extrabold">{item.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {item.description}
                    </p>
                    <p className="mt-2 text-lg font-extrabold text-[#F7941D]">
                      ₹{item.price}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        each
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-3 rounded-full border-2 border-[#F5E6CC] bg-white px-2 py-1">
                      <button
                        type="button"
                        onClick={() => updateQty(item._id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF9ED] text-sm font-bold transition hover:bg-[#F7941D] hover:text-white"
                      >
                        <FaMinus />
                      </button>
                      <span className="w-6 text-center font-extrabold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item._id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF9ED] text-sm font-bold transition hover:bg-[#F7941D] hover:text-white"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <p className="text-xl font-extrabold">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(item._id);
                        toast.success(`${item.name} removed from cart`);
                      }}
                      className="flex items-center gap-1 text-sm font-bold text-red-600 transition hover:text-red-700"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* summary */}
            <div className="mt-8 rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">
                  Total ({totalItems} {totalItems === 1 ? "item" : "items"})
                </p>
                <p className="text-3xl font-extrabold text-[#F7941D]">
                  ₹{totalPrice}
                </p>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="flex-1 rounded-full bg-[#F7941D] px-8 py-3.5 font-bold uppercase text-black transition hover:bg-[#141414] hover:text-white"
                >
                  Proceed to Checkout
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    toast.success("Cart cleared");
                  }}
                  className="rounded-full border-2 border-[#F5E6CC] bg-white px-8 py-3.5 font-bold uppercase text-gray-600 transition hover:border-red-400 hover:text-red-600"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delivery address dialog */}
      <OrderDialog
        open={showDialog}
        total={totalPrice}
        onClose={() => setShowDialog(false)}
        onConfirm={handleConfirm}
      />
    </section>
  );
};

export default Cart;
