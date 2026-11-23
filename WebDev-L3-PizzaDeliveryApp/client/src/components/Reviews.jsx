import { useEffect, useRef, useState } from "react";
import {
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Loader from "./Loader";

const dummyReviews = [
  {
    name: "Rahim Uddin",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    message:
      "The custom pizza builder is amazing! I made my own pizza with a garlic base and it tasted just like a restaurant. Delivery was super fast too.",
  },
  {
    name: "Sarah Ahmed",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    message:
      "Best pizza in town! Fresh dough and lots of cheese. The live order tracking is a great feature — I could see exactly when my pizza was on the way.",
  },
  {
    name: "Tanvir Hasan",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4,
    message:
      "Ordered the BBQ Chicken pizza and it arrived hot and fresh. Great taste, great service. Will definitely order again!",
  },
];

const DELAY = 4000;

/* ---------- Animations (plain CSS, no extra packages) ---------- */
const styles = `
@keyframes rvFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes rvStar { 0% { opacity: 0; transform: scale(0) rotate(-40deg); } 70% { transform: scale(1.25) rotate(8deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
@keyframes rvText { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes rvAvatar { 0% { transform: scale(.7); } 70% { transform: scale(1.08); } 100% { transform: scale(1); } }
@keyframes rvFill { from { width: 0%; } to { width: 100%; } }
@keyframes rvLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }

.rv-reveal { opacity: 0; }
.rv-reveal.rv-in { animation: rvFadeUp .7s cubic-bezier(.2,.7,.2,1) both; }
.rv-star { animation: rvStar .45s cubic-bezier(.2,.9,.3,1.2) both; }
.rv-text { animation: rvText .6s ease .15s both; }
.rv-avatar { animation: rvAvatar .5s cubic-bezier(.2,.9,.3,1.2) both; }
.rv-fill { animation: rvFill ${DELAY}ms linear forwards; }
.rv-line { transform-origin: left; animation: rvLine .8s cubic-bezier(.2,.7,.2,1) .3s both; }

@media (prefers-reduced-motion: reduce) {
  .rv-reveal { opacity: 1; }
  .rv-reveal.rv-in, .rv-star, .rv-text, .rv-avatar, .rv-line { animation: none; }
  .rv-star { opacity: 1; }
  .rv-fill { animation: none; width: 100%; }
}
`;

const Reveal = ({ children, className = "", delay = 0 }) => {
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
      className={`rv-reveal ${shown ? "rv-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const touchStart = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  // DB-te review na thakle dummy dekhabe, jate section khali na lage
  const displayReviews = reviews.length > 0 ? reviews : dummyReviews;
  const n = displayReviews.length;

  // auto change every few seconds. Restarts after any manual change
  useEffect(() => {
    if (n <= 1) return;
    const timer = setTimeout(() => setActive((p) => (p + 1) % n), DELAY);
    return () => clearTimeout(timer);
  }, [active, n]);

  // keep the active index valid if the list size changes (dummy -> real)
  useEffect(() => {
    if (active >= n) setActive(0);
  }, [n, active]);

  const getOffset = (i) => {
    let offset = i - active;
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;
    return offset;
  };

  const prev = () => setActive((a) => (a - 1 + n) % n);
  const next = () => setActive((a) => (a + 1) % n);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev();
    }
  };

  // only show the average for real reviews, not the sample ones
  const average =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <section
      className="overflow-hidden bg-white px-4 py-16 text-[#141414] outline-none sm:py-20"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style>{styles}</style>

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <Reveal className="text-center">
          <p className="text-xl italic text-[#F7941D] sm:text-2xl">
            Customer Reviews
          </p>
          <h2 className="mt-2 text-4xl font-extrabold uppercase sm:text-5xl">
            What Our <span className="text-[#F7941D]">Customers Say</span>
          </h2>
          <div className="rv-line mx-auto mt-4 h-1 w-16 rounded bg-[#F7941D]" />
          {average && (
            <p className="mt-4 text-sm text-gray-500">
              Rated{" "}
              <span className="font-bold text-[#141414]">{average} / 5</span> by{" "}
              {reviews.length} happy{" "}
              {reviews.length === 1 ? "customer" : "customers"}
            </p>
          )}
        </Reveal>

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Cards */}
            <Reveal
              delay={150}
              className="relative mt-12 h-[410px] sm:h-[390px]"
            >
              {displayReviews.map((review, i) => {
                const offset = getOffset(i);
                const abs = Math.abs(offset);
                const isActive = offset === 0;
                const rating = review.rating || 0;

                return (
                  <div
                    key={review._id || review.name}
                    onClick={() => setActive(i)}
                    className="absolute left-1/2 top-1/2 w-[85%] max-w-md cursor-pointer transition-all duration-700 ease-in-out"
                    style={{
                      transform: `translate(-50%, -50%) translateX(${offset * 72}%) scale(${1 - abs * 0.12})`,
                      opacity: abs > 1 ? 0 : 1 - abs * 0.35,
                      zIndex: 10 - abs,
                      pointerEvents: abs > 1 ? "none" : "auto",
                    }}
                  >
                    <div
                      className={`flex h-[350px] flex-col items-center justify-center rounded-3xl border-2 p-7 text-center transition-all duration-700 sm:p-8 ${
                        isActive
                          ? "border-[#F7941D] bg-[#F7941D] shadow-[0_20px_40px_-15px_rgba(247,148,29,0.55)]"
                          : "border-[#eeeeee] bg-white shadow-sm"
                      }`}
                    >
                      {review.image ? (
                        <img
                          src={review.image}
                          alt={review.name}
                          loading="lazy"
                          key={isActive ? `a-${active}` : `i-${i}`}
                          className={`size-20 rounded-full border-4 object-cover transition-colors duration-700 ${
                            isActive
                              ? "rv-avatar border-white"
                              : "border-[#F7941D]"
                          }`}
                        />
                      ) : (
                        <span
                          key={isActive ? `a-${active}` : `i-${i}`}
                          className={`flex size-20 items-center justify-center rounded-full border-4 bg-[#141414] text-3xl font-bold text-[#F7941D] transition-colors duration-700 ${
                            isActive
                              ? "rv-avatar border-white"
                              : "border-[#F7941D]"
                          }`}
                        >
                          {review.name?.charAt(0).toUpperCase()}
                        </span>
                      )}

                      {/* stars pop in one by one on the active card */}
                      <div
                        className="mt-4 flex gap-1"
                        key={isActive ? `s-${active}` : `n-${i}`}
                      >
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            style={
                              isActive
                                ? { animationDelay: `${200 + s * 90}ms` }
                                : undefined
                            }
                            className={`${isActive ? "rv-star" : ""} ${
                              s <= rating
                                ? isActive
                                  ? "text-white"
                                  : "text-[#F7941D]"
                                : isActive
                                  ? "text-white/40"
                                  : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>

                      <FaQuoteLeft
                        className={`mt-4 text-2xl transition-colors duration-700 ${
                          isActive ? "text-white/60" : "text-[#F7941D]/40"
                        }`}
                      />

                      <p
                        key={isActive ? `m-${active}` : `x-${i}`}
                        className={`mt-2 text-[15px] leading-relaxed text-[#141414]/85 ${
                          isActive ? "rv-text" : ""
                        }`}
                      >
                        {review.message}
                      </p>

                      <h3 className="mt-4 text-lg font-extrabold uppercase">
                        {review.name}
                      </h3>
                      <p
                        className={`text-xs uppercase tracking-widest transition-colors duration-700 ${
                          isActive ? "text-[#141414]/60" : "text-gray-400"
                        }`}
                      >
                        Happy Customer
                      </p>
                    </div>
                  </div>
                );
              })}
            </Reveal>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous review"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-[#F7941D] text-white transition-all duration-200 hover:-translate-x-0.5 hover:bg-[#141414] active:scale-90"
              >
                <FaChevronLeft />
              </button>

              {/* dots, the active one fills to show when the next review comes */}
              <div className="flex gap-2">
                {displayReviews.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to review ${i + 1}`}
                    aria-current={i === active}
                    className={`h-2.5 cursor-pointer overflow-hidden rounded-full bg-[#F5E6CC] transition-all duration-300 ${
                      i === active ? "w-10" : "w-2.5 hover:bg-[#F7941D]/50"
                    }`}
                  >
                    {i === active && n > 1 && (
                      <span
                        key={active}
                        className="rv-fill block h-full rounded-full bg-[#F7941D]"
                      />
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next review"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-[#F7941D] text-white transition-all duration-200 hover:translate-x-0.5 hover:bg-[#141414] active:scale-90"
              >
                <FaChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Reviews;
