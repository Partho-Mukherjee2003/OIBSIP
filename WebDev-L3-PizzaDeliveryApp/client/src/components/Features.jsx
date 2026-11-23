import { GiForkKnifeSpoon, GiFoodTruck, GiFullPizza } from "react-icons/gi";

const features = [
  {
    icon: GiForkKnifeSpoon,
    title: "Order Your Pizza",
    text: "Satisfy your cravings in just a few clicks. Pick your favourite pizza from our menu, or build your own with your choice of base, sauce, cheese and veggies.",
  },
  {
    icon: GiFoodTruck,
    title: "Fast Delivery",
    text: "Hot and fresh pizza at your doorstep in no time. Track your order live, from our kitchen straight to your door.",
  },
  {
    icon: GiFullPizza,
    title: "Fresh & Delicious",
    text: "Fresh dough, real cheese and quality ingredients in every slice. Made fresh when you order, so every bite tastes just right.",
  },
];

const Features = () => {
  return (
    <section className="bg-[#F7941D] text-[#141414]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-28 text-center sm:px-6 sm:py-36 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="group flex h-full flex-col items-center transition duration-300 hover:-translate-y-1.5"
          >
            <div className="flex h-24 items-center justify-center">
              <Icon className="text-7xl transition duration-300 group-hover:scale-110" />
            </div>
            <h3 className="mt-2 text-xl font-extrabold uppercase sm:text-2xl">
              {title}
            </h3>
            <p className="mt-3 min-h-24 max-w-xs text-sm leading-relaxed text-[#141414]/80">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
