import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaDrumstickBite,
  FaTags,
  FaArrowRight,
  FaPizzaSlice,
} from "react-icons/fa";

const Categories = ({ pizzas = [] }) => {
  const veg = pizzas.filter((p) => p.category === "Veg");
  const nonVeg = pizzas.filter((p) => p.category === "Non-Veg");
  const budget = pizzas.filter((p) => p.price < 400);

  const minPrice = (list) =>
    list.length ? Math.min(...list.map((p) => p.price)) : null;

  const cards = [
    {
      title: "Veg Pizzas",
      desc: "Fresh veggies, real cheese, zero meat.",
      icon: <FaLeaf />,
      iconBg: "bg-green-600",
      image: veg[0]?.image,
      count: veg.length,
      from: minPrice(veg),
      to: "/menu?category=Veg",
    },
    {
      title: "Non-Veg Pizzas",
      desc: "Chicken, pepperoni and bold flavours.",
      icon: <FaDrumstickBite />,
      iconBg: "bg-red-600",
      image: nonVeg[0]?.image,
      count: nonVeg.length,
      from: minPrice(nonVeg),
      to: "/menu?category=Non-Veg",
    },
    {
      title: "Under ₹400",
      desc: "Budget friendly picks, same great taste.",
      icon: <FaTags />,
      iconBg: "bg-[#F7941D]",
      image: budget[0]?.image,
      count: budget.length,
      from: minPrice(budget),
      to: "/menu?maxPrice=399",
    },
  ];

  return (
    <section className="bg-white px-4 py-14 text-black sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <p className="text-lg italic text-[#F7941D] sm:text-xl">
            Find Your Favourite
          </p>
          <h2 className="mt-2 text-3xl font-extrabold uppercase sm:text-5xl">
            Browse by <span className="text-[#F7941D]">Category</span>
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#F7941D]" />
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
            Pick a category and jump straight to the pizzas you love — no
            endless scrolling.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#F7941D] hover:shadow-[0_20px_40px_-15px_rgba(247,148,29,0.45)]"
            >
              <div className="relative h-44 overflow-hidden bg-gray-100">
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                )}
                <span
                  className={`absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-lg text-white shadow ${card.iconBg}`}
                >
                  {card.icon}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-extrabold uppercase transition-colors duration-200 group-hover:text-[#F7941D]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {card.desc}
                </p>
                <p className="mt-3 text-sm font-bold text-gray-600">
                  {card.count} {card.count === 1 ? "pizza" : "pizzas"}
                  {card.from ? ` · from ₹${card.from}` : ""}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase text-[#F7941D]">
                  Explore
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}

          {/* Build your own — dark card */}
          <Link
            to="/builder"
            className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-[#141414] bg-[#141414] text-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#F7941D] hover:shadow-[0_20px_40px_-15px_rgba(247,148,29,0.45)]"
          >
            <div className="flex h-44 items-center justify-center bg-[#1f1f1f]">
              <FaPizzaSlice className="text-7xl text-[#F7941D] transition duration-500 group-hover:rotate-[-20deg] group-hover:scale-110" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-xl font-extrabold uppercase">
                Build Your Own
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Your base, your sauce, your cheese, your veggies.
              </p>
              <p className="mt-3 text-sm font-bold text-gray-300">
                4 easy steps · live price
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase text-[#F7941D]">
                Start Building
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/menu"
            className="inline-block rounded-full bg-[#F7941D] px-8 py-3 text-sm font-bold uppercase text-white transition hover:bg-[#141414]"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
