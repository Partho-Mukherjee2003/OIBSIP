import { useEffect, useRef, useState } from "react";
import { GiWheat } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// base name onujayi real pic (Whole Wheat-e wheat icon)
const baseVisual = {
  "Thin Crust": "/images/icon/thincrust-removebg-preview.png",
  "Thick Crust": "/images/icon/thiscrust-removebg-preview.png",
  "Cheese Burst Base": "/images/icon/chessebrust-removebg-preview.png",
  "Garlic Base": "/images/icon/garlic-removebg-preview.png",
  "Whole Wheat": GiWheat,
};

// vegetable name onujayi real pic
const vegVisual = {
  Onion: "/images/veg-onion-slice.png",
  Jalapeno: "/images/veg-chili-whole.png",
  Mushroom: "/images/icon/masroom-removebg-preview.png",
  Tomato: "/images/icon/tomato-removebg-preview.png",
  "Sweet Corn": "/images/icon/sweetcorn-removebg-preview.png",
  Olives: "/images/icon/olives-removebg-preview.png",
  Capsicum: "/images/icon/cansicum-removebg-preview.png",
  Paneer: "/images/icon/panner-removebg-preview.png",
};

// sauce name onujayi real pic
const sauceVisual = {
  "Tomato Sauce": "/images/icon/tsauseicon.png",
  "BBQ Sauce": "/images/icon/bbqsauseIcon.png",
  "Peri Peri Sauce": "/images/icon/perisauseIcon.png",
  "Cheese Sauce": "/images/icon/cheesssauseicon.png",
  "Mint Sauce": "/images/icon/mintsauseicon..png",
};

// cheese name onujayi real pic
const cheeseVisual = {
  Mozzarella: "/images/icon/mozerelaicon.png",
  Cheddar: "/images/icon/cheddaricon-removebg-preview.png",
  Parmesan: "/images/icon/parmeson-removebg-preview.png",
};

/* ---------- Animations (plain CSS, no extra packages) ---------- */
const styles = `
@keyframes pbFadeUp { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pbBob { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-5px) rotate(-4deg); } }
@keyframes pbPill { from { opacity: 0; transform: translateY(6px) scale(.8); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes pbRow { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pbSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.pb-reveal { opacity: 0; }
.pb-reveal.pb-in { animation: pbFadeUp .65s cubic-bezier(.2,.7,.2,1) both; }
.pb-bob { animation: pbBob 2.4s ease-in-out infinite; }
.pb-pill { animation: pbPill .3s ease both; }
.pb-row { animation: pbRow .35s ease both; }
.pb-bar { animation: pbSlideUp .5s cubic-bezier(.2,.7,.2,1) both; }

@media (prefers-reduced-motion: reduce) {
  .pb-reveal { opacity: 1; }
  .pb-reveal.pb-in, .pb-bob, .pb-pill, .pb-row, .pb-bar { animation: none; }
}
`;

/* ---------- Helpers ---------- */
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
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`pb-reveal ${shown ? "pb-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

// smooth number change for the total
const useCountUp = (value, duration = 450) => {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
};

const getVisual = (item) => {
  if (item.category === "base") return baseVisual[item.name];
  if (item.category === "sauce") return sauceVisual[item.name];
  if (item.category === "cheese") return cheeseVisual[item.name];
  return vegVisual[item.name];
};

/* ---------- Card (outside Builder so it doesn't remount on every render) ---------- */
const Card = ({ item, selected, onClick, index }) => {
  const visual = getVisual(item);
  const isImage = typeof visual === "string";
  const isWheat = visual === GiWheat;
  const out = item.stock <= 0;
  const low = !out && item.stock <= 5;

  return (
    <Reveal delay={index * 70}>
      <button
        type="button"
        onClick={onClick}
        disabled={out}
        aria-pressed={selected}
        className={`group relative flex h-full w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300 sm:flex-col sm:items-start sm:gap-0 ${
          out
            ? "cursor-not-allowed border-[#262626] bg-[#1f1f1f] opacity-40"
            : selected
              ? "-translate-y-1 border-[#F7941D] bg-[#2a2013]"
              : "border-[#262626] bg-[#1f1f1f] hover:-translate-y-1.5 hover:border-[#F7941D]/70 hover:bg-[#242424]"
        } active:scale-[0.97]`}
      >
        {selected && (
          <span className="pb-pill absolute right-3 top-3 rounded-full bg-[#F7941D] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-black">
            Selected
          </span>
        )}

        {/* picture sits on a round "plate" */}
        <div
          className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:mb-4 sm:h-24 sm:w-24 ${
            selected
              ? "border-[#F7941D] bg-[#141414]"
              : "border-[#2e2e2e] bg-[#181818] group-hover:border-[#F7941D]/50"
          }`}
        >
          {isImage ? (
            <img
              src={visual}
              alt={item.name}
              loading="lazy"
              className={`h-14 w-14 object-contain transition-transform duration-300 sm:h-16 sm:w-16 ${
                selected
                  ? "pb-bob"
                  : "group-hover:scale-110 group-hover:-rotate-6"
              }`}
            />
          ) : isWheat ? (
            <GiWheat
              className={`text-5xl text-[#F7941D] transition-transform duration-300 ${
                selected ? "pb-bob" : "group-hover:scale-110"
              }`}
            />
          ) : (
            <FaLeaf
              className={`text-4xl text-green-500 transition-transform duration-300 ${
                selected ? "pb-bob" : "group-hover:scale-110"
              }`}
            />
          )}
        </div>

        <div className="min-w-0 flex-1 sm:w-full">
          <p className="text-base font-bold leading-snug text-white">
            {item.name}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="text-lg font-extrabold text-[#F7941D]">
              ₹{item.price}
            </p>
            <p
              className={`text-xs ${
                out ? "text-red-400" : low ? "text-yellow-400" : "text-gray-500"
              }`}
            >
              {out
                ? "Out of stock"
                : low
                  ? `Only ${item.stock} left`
                  : `${item.stock} in stock`}
            </p>
          </div>
        </div>
      </button>
    </Reveal>
  );
};

const StepHeader = ({ number, title, hint, done }) => (
  <Reveal className="mb-6 mt-14 first:mt-0">
    <div className="flex items-end gap-4">
      <span
        className={`select-none text-6xl font-black leading-none transition-colors duration-500 sm:text-7xl ${
          done ? "text-[#F7941D]" : "text-transparent"
        }`}
        style={done ? undefined : { WebkitTextStroke: "2px #F7941D" }}
      >
        {number}
      </span>
      <div className="pb-1">
        <h3 className="text-2xl font-extrabold uppercase text-white sm:text-3xl">
          {title}
        </h3>
        <p className="mt-0.5 text-sm text-gray-500">{hint}</p>
      </div>
    </div>
    <div className="mt-4 h-px w-full bg-[#262626]" />
  </Reveal>
);

/* ---------- Main component ---------- */
const Builder = () => {
  const [items, setItems] = useState([]);
  const [base, setBase] = useState(null);
  const [sauce, setSauce] = useState(null);
  const [cheese, setCheese] = useState(null);
  const [vegs, setVegs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/inventory`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.log(err));
  }, []);

  const bases = items.filter((i) => i.category === "base");
  const sauces = items.filter((i) => i.category === "sauce");
  const cheeses = items.filter((i) => i.category === "cheese");
  const vegetables = items.filter((i) => i.category === "veg");

  const toggleVeg = (item) => {
    if (vegs.find((v) => v._id === item._id)) {
      setVegs(vegs.filter((v) => v._id !== item._id));
    } else {
      setVegs([...vegs, item]);
    }
  };

  const total =
    (base?.price || 0) +
    (sauce?.price || 0) +
    (cheese?.price || 0) +
    vegs.reduce((sum, v) => sum + v.price, 0);

  const animatedTotal = useCountUp(total);
  const ready = base && sauce && cheese;
  const done = [base, sauce, cheese].filter(Boolean).length;

  const handleOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      // 1. Order banao
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          baseId: base._id,
          sauceId: sauce._id,
          cheeseId: cheese._id,
          vegIds: vegs.map((v) => v._id),
        }),
      });

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
        description: "Custom Pizza Order",
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

  const nextHint = !base
    ? "Start by choosing a base"
    : !sauce
      ? "Now pick a sauce"
      : !cheese
        ? "Almost there, choose a cheese"
        : "Looks great! Add veggies if you like";

  const rows = [
    ["Base", base],
    ["Sauce", sauce],
    ["Cheese", cheese],
  ];

  return (
    <section className="bg-[#141414] px-4 pb-32 pt-16 text-white sm:py-20 lg:pb-20">
      <style>{styles}</style>

      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <Reveal className="mb-14 text-center">
          <p className="text-xl italic text-[#F7941D] sm:text-2xl">
            Your Pizza, Your Way
          </p>
          <h2 className="mt-2 text-4xl font-extrabold uppercase sm:text-5xl md:text-6xl">
            Build Your <span className="text-[#F7941D]">Pizza</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-gray-400 sm:text-base">
            Four easy steps. Pick what you love and watch your total update as
            you go.
          </p>
        </Reveal>

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_340px]">
          {/* Steps */}
          <div>
            <StepHeader
              number="1"
              title="Choose Base"
              hint="Pick one, this is where it all starts"
              done={!!base}
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {bases.map((item, i) => (
                <Card
                  key={item._id}
                  index={i}
                  item={item}
                  selected={base?._id === item._id}
                  onClick={() => setBase(item)}
                />
              ))}
            </div>

            <StepHeader
              number="2"
              title="Choose Sauce"
              hint="Pick one that matches your mood"
              done={!!sauce}
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sauces.map((item, i) => (
                <Card
                  key={item._id}
                  index={i}
                  item={item}
                  selected={sauce?._id === item._id}
                  onClick={() => setSauce(item)}
                />
              ))}
            </div>

            <StepHeader
              number="3"
              title="Choose Cheese"
              hint="Pick one, the gooey part"
              done={!!cheese}
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {cheeses.map((item, i) => (
                <Card
                  key={item._id}
                  index={i}
                  item={item}
                  selected={cheese?._id === item._id}
                  onClick={() => setCheese(item)}
                />
              ))}
            </div>

            <StepHeader
              number="4"
              title="Add Vegetables"
              hint="Optional, add as many as you want"
              done={vegs.length > 0}
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {vegetables.map((item, i) => (
                <Card
                  key={item._id}
                  index={i}
                  item={item}
                  selected={!!vegs.find((v) => v._id === item._id)}
                  onClick={() => toggleVeg(item)}
                />
              ))}
            </div>
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-6">
            <Reveal>
              <div className="rounded-3xl border-2 border-[#262626] bg-[#1f1f1f] p-6">
                <h3 className="text-xl font-extrabold uppercase">Your Pizza</h3>
                <p className="mt-1 text-sm text-gray-500">{nextHint}</p>

                {/* 3 simple progress segments */}
                <div className="mt-4 flex gap-2">
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                        n < done ? "bg-[#F7941D]" : "bg-[#2e2e2e]"
                      }`}
                    />
                  ))}
                </div>

                <ul className="mt-5 text-sm">
                  {rows.map(([label, it]) => (
                    <li
                      key={label}
                      className="flex items-center justify-between gap-3 border-b border-[#2a2a2a] py-3"
                    >
                      <span className="text-gray-400">{label}</span>
                      {it ? (
                        <span
                          key={it._id}
                          className="pb-row text-right font-semibold"
                        >
                          {it.name}{" "}
                          <span className="text-[#F7941D]">· ₹{it.price}</span>
                        </span>
                      ) : (
                        <span className="text-gray-600">Not chosen</span>
                      )}
                    </li>
                  ))}
                  <li className="flex items-start justify-between gap-3 border-b border-[#2a2a2a] py-3">
                    <span className="text-gray-400">Vegetables</span>
                    {vegs.length ? (
                      <span className="max-w-[60%] text-right font-semibold">
                        {vegs.map((v) => v.name).join(", ")}
                        <span className="text-[#F7941D]">
                          {" "}
                          · ₹{vegs.reduce((s, v) => s + v.price, 0)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-600">None yet</span>
                    )}
                  </li>
                </ul>

                <div className="mt-6 flex items-end justify-between">
                  <p className="text-sm text-gray-400">Total Price</p>
                  <p className="text-4xl font-extrabold tabular-nums text-[#F7941D]">
                    ₹{animatedTotal}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOrder}
                  disabled={!ready}
                  className={`mt-5 w-full rounded-full px-8 py-3.5 font-bold uppercase transition-all duration-300 ${
                    ready
                      ? "bg-[#F7941D] text-black hover:-translate-y-0.5 hover:bg-[#e07f0a] active:scale-95"
                      : "cursor-not-allowed bg-[#262626] text-gray-500"
                  }`}
                >
                  {ready ? "Place Order" : "Select base, sauce & cheese"}
                </button>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>

      {/* Mobile bottom bar so the total is always visible */}
      <div className="pb-bar fixed inset-x-0 bottom-0 z-40 border-t-2 border-[#262626] bg-[#1f1f1f] px-4 py-3 lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-2xl font-extrabold tabular-nums text-[#F7941D]">
              ₹{animatedTotal}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOrder}
            disabled={!ready}
            className={`rounded-full px-6 py-3 text-sm font-bold uppercase transition ${
              ready
                ? "bg-[#F7941D] text-black active:scale-95"
                : "cursor-not-allowed bg-[#262626] text-gray-500"
            }`}
          >
            {ready ? "Place Order" : `${done}/3 selected`}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Builder;
