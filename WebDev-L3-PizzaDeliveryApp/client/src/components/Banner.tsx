import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    title1: "QUALITY",
    title2: "FOODS",
    subtitle: "HEALTHY FOOD FOR HEALTHY BODY",
    text: "Fresh dough, rich tomato sauce and premium cheese — baked hot and delivered fast to your door.",
    image: "/images/banner-1-removebg-preview.png",
    layout: "left",
  },
  {
    title1: "TASTY",
    title2: "PIZZAS",
    subtitle: "FRESH FROM OUR OVEN",
    text: "From classic Margherita to spicy Jalapeno — every pizza is made fresh when you order.",
    image: "/images/banner2-removebg-preview(1).png",
    layout: "right",
  },
  {
    title1: "CUSTOM",
    title2: "PIZZA",
    subtitle: "BUILD YOUR OWN PIZZA",
    text: "Choose your base, sauce, cheese and favourite vegetables. Your pizza, your way.",
    image: "/images/banner3.png",
    layout: "bottom",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden h-[640px] md:h-[680px]"
      style={{
        backgroundColor: "#121212",
        backgroundImage:
          "radial-gradient(circle at 15% 30%, rgba(247,148,29,0.07) 0, transparent 40%), radial-gradient(circle at 85% 70%, rgba(255,255,255,0.04) 0, transparent 40%)",
      }}
    >
      {/* Floating vegetables - real images, no icons */}
      <img
        src="/images/veg-chili-whole.png"
        alt=""
        className="absolute top-14 left-[40%] w-36 animate-float hidden md:block z-10 drop-shadow-2xl"
      />
      <img
        src="/images/veg-onion-slice.png"
        alt=""
        className="absolute bottom-12 right-[6%] w-40 animate-float-delay hidden md:block z-10 drop-shadow-2xl"
      />
      <img
        src="/images/veg-garlic-cloves.png"
        alt=""
        className="absolute bottom-8 left-[4%] w-36 animate-float hidden md:block z-10 drop-shadow-2xl"
      />
      <img
        src="/images/veg-chili-cut.png"
        alt=""
        className="absolute top-20 left-[8%] w-32 animate-float-delay hidden lg:block z-10 drop-shadow-2xl"
      />
      <img
        src="/images/veg-onion-whole.png"
        alt=""
        className="absolute top-8 right-[14%] w-24 animate-float hidden lg:block z-10 drop-shadow-2xl"
      />

      {slide.layout === "bottom" ? (
        <div className="relative h-full" key={current}>
          <div className="max-w-7xl mx-auto px-4 pt-16 md:pt-20 text-center relative z-10">
            <h1 className="animate-fade-up text-5xl md:text-8xl font-extrabold uppercase leading-none">
              {slide.title1}{" "}
              <span className="text-[#F7941D]">{slide.title2.slice(0, 2)}</span>
              {slide.title2.slice(2)}
            </h1>
            <p
              className="animate-fade-up mt-4 text-[#F7941D] tracking-[0.3em] uppercase text-sm md:text-base"
              style={{ animationDelay: "0.2s" }}
            >
              {slide.subtitle}
            </p>
            <p
              className="animate-fade-up mt-3 text-gray-300 max-w-xl mx-auto"
              style={{ animationDelay: "0.35s" }}
            >
              {slide.text}
            </p>
            <button
              className="animate-fade-up mt-5 bg-[#F7941D] hover:bg-[#e07f0a] px-8 py-3 rounded-full font-bold uppercase transition"
              style={{ animationDelay: "0.5s" }}
            >
              Build Now
            </button>
          </div>

          <img
            src="/images/veg-onion-slice.png"
            alt=""
            className="absolute bottom-[220px] left-[24%] w-36 animate-float z-10 hidden md:block drop-shadow-2xl"
          />
          <img
            src="/images/veg-chili-whole.png"
            alt=""
            className="absolute bottom-[260px] right-[20%] w-40 animate-float-delay z-10 hidden md:block drop-shadow-2xl"
          />
          <img
            src={slide.image}
            alt="Pizza"
            className="animate-slide-left absolute left-1/2 -translate-x-1/2 -bottom-[320px] md:-bottom-[380px] w-[560px] h-[560px] md:w-[760px] md:h-[760px] object-cover rounded-full border-8 border-[#1f1f1f]"
          />
        </div>
      ) : (
        <div
          className="max-w-7xl mx-auto px-4 h-full flex items-center"
          key={current}
        >
          <div
            className={`w-full grid md:grid-cols-2 gap-6 items-center ${slide.layout === "right" ? "md:[direction:rtl]" : ""}`}
          >
            <img
              src={slide.image}
              alt="Pizza"
              className={`${slide.layout === "left" ? "animate-slide-left" : "animate-slide-right"} w-80 h-80 md:w-[540px] md:h-[540px] object-contain mx-auto drop-shadow-2xl animate-spin-slow [direction:ltr]`}
            />
            <div className="[direction:ltr] text-center md:text-left">
              <h1 className="animate-fade-up text-5xl md:text-7xl font-extrabold uppercase leading-none">
                {slide.title1}
                <br />
                <span className="text-[#F7941D]">
                  {slide.title2.slice(0, 2)}
                </span>
                {slide.title2.slice(2)}
              </h1>
              <p
                className="animate-fade-up mt-4 text-[#F7941D] tracking-[0.3em] uppercase text-sm md:text-base"
                style={{ animationDelay: "0.2s" }}
              >
                {slide.subtitle}
              </p>
              <p
                className="animate-fade-up mt-4 text-gray-300 max-w-md mx-auto md:mx-0"
                style={{ animationDelay: "0.35s" }}
              >
                {slide.text}
              </p>
              <button
                className="animate-fade-up mt-6 bg-[#F7941D] hover:bg-[#e07f0a] px-8 py-3 rounded-full font-bold uppercase transition"
                style={{ animationDelay: "0.5s" }}
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#F7941D] p-3 text-white transition z-20"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#F7941D] p-3 text-white transition z-20"
      >
        <FaChevronRight />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all ${current === index ? "w-8 bg-[#F7941D]" : "w-2.5 bg-gray-500"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;
