import { useEffect, useRef, useState } from "react";

const pizzas = [
  "/images/rolling/pizza1-removebg-preview.png",
  "/images/rolling/pizza3-removebg-preview.png",
  "/images/rolling/pizza5-removebg-preview.png",
  "/images/rolling/pizza6-removebg-preview.png",
  "/images/rolling/pizza9-removebg-preview.png",
  "/images/rolling/pizza11-removebg-preview.png",
  "/images/rolling/pizza12-removebg-preview.png",
  "/images/rolling/pizzaa7-removebg-preview.png",
];

const DELAY = 4000;

/* ---------- Animations (plain CSS, no extra packages) ---------- */
const styles = `
@keyframes rpFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes rpFloat { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(1.5deg); } }
@keyframes rpDisc { 0% { transform: translate(-50%, -50%) scale(.6); opacity: 0; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
@keyframes rpFill { from { width: 0%; } to { width: 100%; } }
@keyframes rpCount { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

.rp-reveal { opacity: 0; }
.rp-reveal.rp-in { animation: rpFadeUp .7s cubic-bezier(.2,.7,.2,1) both; }
.rp-float { animation: rpFloat 5s ease-in-out infinite; }
.rp-disc { animation: rpDisc .7s cubic-bezier(.2,.8,.3,1) both; }
.rp-fill { animation: rpFill ${DELAY}ms linear forwards; }
.rp-count { animation: rpCount .5s ease both; }

@media (prefers-reduced-motion: reduce) {
  .rp-reveal { opacity: 1; }
  .rp-reveal.rp-in, .rp-float, .rp-disc, .rp-fill, .rp-count { animation: none; }
  .rp-fill { width: 100%; }
}
`;

const Reveal = ({ children, className = "" }) => {
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
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`rp-reveal ${shown ? "rp-in" : ""} ${className}`}>
      {children}
    </div>
  );
};

const RollingPizza = () => {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(null);
  const n = pizzas.length;

  const next = () => setCurrent((p) => (p + 1) % n);
  const prev = () => setCurrent((p) => (p - 1 + n) % n);

  // auto roll every few seconds. Restarts after any manual change
  useEffect(() => {
    const timer = setTimeout(() => setCurrent((p) => (p + 1) % n), DELAY);
    return () => clearTimeout(timer);
  }, [current, n]);

  const getOffset = (i) => {
    let offset = i - current;
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;
    return offset;
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
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

  const pad = (num) => String(num).padStart(2, "0");

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center text-[#141414] outline-none"
      style={{ backgroundImage: "url(/images/rolling/roolingbg.jpg)" }}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style>{styles}</style>

      {/* Heading (flat soft panel so the text stays readable on the photo) */}
      <Reveal className="relative z-10 px-4 pt-12 text-center sm:pt-16">
        <div className="mx-auto inline-block rounded-3xl bg-white/70 px-8 py-5 backdrop-blur-sm sm:px-12">
          <p className="text-xl italic text-[#F7941D] sm:text-2xl">
            Fresh From Our Oven
          </p>
          <h2 className="mt-1 text-4xl font-extrabold uppercase sm:text-5xl">
            Choose Your <span className="text-[#F7941D]">Pizza</span>
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded bg-[#F7941D]" />
        </div>
      </Reveal>

      {/* Rolling pizzas */}
      <div className="relative z-10 h-[440px] sm:h-[540px]">
        {/* flat orange disc behind the active pizza, re-animates on every change */}
        <div
          key={current}
          className="rp-disc absolute left-1/2 top-1/2 h-[250px] w-[250px] rounded-full bg-[#F7941D]/20 sm:h-[340px] sm:w-[340px]"
        />

        {pizzas.map((src, i) => {
          const offset = getOffset(i);
          const abs = Math.abs(offset);
          const active = offset === 0;
          return (
            <div
              key={src}
              className="absolute left-1/2 top-1/2 w-[320px] transition-all duration-700 ease-in-out sm:w-[460px]"
              style={{
                transform: `translate(-50%, -50%) translateY(${-offset * 130}%) rotate(${-offset * 25}deg)`,
                opacity: abs > 1 ? 0 : 1,
                zIndex: 10 - abs,
                pointerEvents: active ? "auto" : "none",
              }}
              aria-hidden={!active}
            >
              {/* inner wrapper so the idle float doesn't fight the rolling transform */}
              <img
                src={src}
                alt={`Pizza ${i + 1}`}
                draggable={false}
                className={`w-full select-none drop-shadow-2xl ${active ? "rp-float" : ""}`}
              />
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="relative z-10 mx-auto flex max-w-md items-center justify-between gap-4 px-6">
        <button
          type="button"
          onClick={prev}
          className="rounded-full border-2 border-[#141414] bg-white/70 px-5 py-2 text-sm font-bold uppercase text-[#141414] backdrop-blur-sm transition-all duration-300 hover:border-[#F7941D] hover:bg-[#F7941D] active:scale-95"
        >
          Prev
        </button>

        <div className="flex items-end gap-2" aria-live="polite">
          <span
            key={current}
            className="rp-count text-5xl font-black leading-none text-[#F7941D]"
          >
            {pad(current + 1)}
          </span>
          <span className="pb-1 text-sm font-semibold text-[#141414]/60">
            / {pad(n)}
          </span>
        </div>

        <button
          type="button"
          onClick={next}
          className="rounded-full border-2 border-[#141414] bg-white/70 px-5 py-2 text-sm font-bold uppercase text-[#141414] backdrop-blur-sm transition-all duration-300 hover:border-[#F7941D] hover:bg-[#F7941D] active:scale-95"
        >
          Next
        </button>
      </div>

      {/* Dots, the active one fills up to show when the next pizza arrives */}
      <div className="relative z-10 flex justify-center gap-2 pb-10 pt-6">
        {pizzas.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Show pizza ${i + 1}`}
            aria-current={i === current}
            className={`h-2.5 cursor-pointer overflow-hidden rounded-full transition-all duration-300 ${
              i === current
                ? "w-10 bg-[#141414]/25"
                : "w-2.5 bg-[#141414]/25 hover:bg-[#141414]/50"
            }`}
          >
            {i === current && (
              <span
                key={current}
                className="rp-fill block h-full rounded-full bg-[#F7941D]"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default RollingPizza;
