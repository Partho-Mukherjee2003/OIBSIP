import { useEffect, useState } from "react";

const Menu = () => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/pizzas`)
      .then((res) => res.json())
      .then((data) => setPizzas(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="bg-white py-14 text-gray-600 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <p className="text-lg italic text-[#F7941D] sm:text-2xl">
            Fresh & Tasty
          </p>
          <h2 className="mt-2 text-4xl font-extrabold uppercase text-[#141414] sm:text-5xl">
            Our <span className="text-[#F7941D]">Menu</span>
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#F7941D]" />
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base">
            Hot, cheesy and made fresh to order. Pick your favourite pizza.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pizzas.map((pizza) => (
            <div
              key={pizza._id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#F7941D] hover:shadow-[0_20px_40px_-15px_rgba(247,148,29,0.45)]"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow ${
                    pizza.category === "Veg" ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {pizza.category}
                </span>
                <span className="absolute bottom-3 right-3 rounded-full bg-[#141414]/85 px-3 py-1 text-sm font-extrabold text-[#F7941D]">
                  ₹{pizza.price}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-extrabold uppercase text-[#141414] transition-colors duration-200 group-hover:text-[#F7941D]">
                  {pizza.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                  {pizza.description}
                </p>

                <div className="mt-auto pt-4">
                  <button className="w-full cursor-pointer rounded-full bg-[#F7941D] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition duration-200 hover:bg-[#141414] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2 active:scale-95">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
