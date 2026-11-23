import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* ---------- Animations (plain CSS, no extra packages) ---------- */
const styles = `
@keyframes dbFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes dbPop { 0% { opacity: 0; transform: scale(.5); } 70% { transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
@keyframes dbLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes dbPulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }

.db-reveal { opacity: 0; }
.db-reveal.db-in { animation: dbFadeUp .65s cubic-bezier(.2,.7,.2,1) both; }
.db-pop { animation: dbPop .5s cubic-bezier(.2,.9,.3,1.2) .15s both; }
.db-line { transform-origin: left; animation: dbLine .8s cubic-bezier(.2,.7,.2,1) .3s both; }
.db-skel { background: #f1f1f1; animation: dbPulse 1.3s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .db-reveal { opacity: 1; }
  .db-reveal.db-in, .db-pop, .db-line, .db-skel { animation: none; }
}
`;

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
      className={`db-reveal ${shown ? "db-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return "Up late?";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const links = [
  {
    to: "/menu",
    number: "01",
    title: "Order Pizza",
    text: "See our menu and order",
  },
  {
    to: "/builder",
    number: "02",
    title: "Custom Pizza",
    text: "Build your own pizza",
  },
  {
    to: "/my-orders",
    number: "03",
    title: "My Orders",
    text: "Track your orders",
  },
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  if (!user) {
    return (
      <section className="min-h-[80vh] bg-white px-4 py-16">
        <style>{styles}</style>
        <div className="mx-auto max-w-4xl space-y-5">
          <div className="db-skel h-6 w-40 rounded-full" />
          <div className="db-skel h-14 w-3/4 rounded-2xl" />
          <div className="db-skel h-5 w-56 rounded-full" />
          <div className="grid gap-6 pt-6 sm:grid-cols-3">
            <div className="db-skel h-44 rounded-3xl" />
            <div className="db-skel h-44 rounded-3xl" />
            <div className="db-skel h-44 rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  const firstName = (user.name || "").split(" ")[0];
  const initial = (user.name || "?").charAt(0).toUpperCase();

  return (
    <section className="min-h-[80vh] bg-white px-4 py-16 sm:py-20">
      <style>{styles}</style>

      <div className="mx-auto max-w-4xl">
        {/* Welcome header */}
        <Reveal>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="db-pop flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F7941D] text-3xl font-extrabold text-[#141414] sm:h-20 sm:w-20 sm:text-4xl">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xl italic text-[#F7941D] sm:text-2xl">
                {greeting()}
              </p>
              <h2 className="mt-1 break-words text-3xl font-extrabold uppercase text-[#141414] sm:text-5xl">
                Welcome, <span className="text-[#F7941D]">{firstName}</span>
              </h2>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="rounded-full border border-[#F5E6CC] bg-[#FFF9ED] px-4 py-1.5 text-sm text-gray-600">
              {user.email}
            </span>
            <span className="text-sm text-gray-400">
              What would you like to do today?
            </span>
          </div>

          <div className="db-line mt-8 h-1 w-24 rounded-full bg-[#F7941D]" />
        </Reveal>

        {/* Quick links */}
        <div className="mt-10 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {links.map((item, i) => (
            <Reveal key={item.to} delay={i * 110}>
              <Link
                to={item.to}
                className="group relative block h-full overflow-hidden rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#F7941D] hover:bg-[#FFF3E2] hover:shadow-[0_20px_40px_-15px_rgba(247,148,29,0.45)] active:scale-[0.98]"
              >
                <span
                  className="select-none text-6xl font-black leading-none text-transparent transition-colors duration-300 group-hover:text-[#F7941D]"
                  style={{ WebkitTextStroke: "2px #F7941D" }}
                >
                  {item.number}
                </span>

                <h3 className="mt-5 text-xl font-extrabold text-[#141414]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.text}</p>

                <div className="mt-5 flex items-center gap-3">
                  <span className="text-sm font-bold uppercase text-[#F7941D]">
                    Open
                  </span>
                  <span className="h-0.5 w-6 bg-[#F7941D] transition-all duration-300 group-hover:w-16" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Logout */}
        <Reveal delay={400} className="mt-12 border-t border-[#eeeeee] pt-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-gray-500">
              Done for now? You can log out safely.
            </p>
            <button
              onClick={handleLogout}
              className="w-full rounded-full border-2 border-red-600 px-8 py-3 font-bold uppercase text-red-600 transition-all duration-300 hover:bg-red-600 hover:text-white active:scale-95 sm:w-auto"
            >
              Logout
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Dashboard;
