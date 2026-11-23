import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Loader from "../components/Loader";
import Features from "../components/Features";
import Reviews from "../components/Reviews";
import RollingPizza from "../components/RollingPizza";


const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPizzas = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/pizzas`,
        );
        const data = await res.json();
        setPizzas(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadPizzas();
  }, []);

  return (
    <div>
      <Banner />
      <Features />
      <RollingPizza />
      <section className="bg-white px-4 py-14 text-black sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="text-center">
            <p className="text-lg italic text-[#F7941D] sm:text-xl">
              Our Special Menu
            </p>
            <h2 className="mt-2 text-3xl font-extrabold uppercase sm:text-5xl">
              Our <span className="text-[#F7941D]">Pizzas</span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#F7941D]" />
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
              Fresh dough, real cheese and loads of flavour. Pick your favourite
              and add it to your order.
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pizzas.map((pizza) => (
                <div
                  key={pizza._id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#F7941D] hover:shadow-[0_20px_40px_-15px_rgba(247,148,29,0.45)]"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    {pizza.category && (
                      <span
                        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow ${
                          pizza.category === "Veg"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {pizza.category}
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 rounded-full bg-[#141414]/85 px-3 py-1 text-sm font-extrabold text-[#F7941D]">
                      ₹{pizza.price}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-extrabold uppercase transition-colors duration-200 group-hover:text-[#F7941D] sm:text-xl">
                      {pizza.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                      {pizza.description}
                    </p>

                    <div className="mt-auto pt-4">
                      <button className="w-full cursor-pointer rounded-full bg-[#F7941D] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition duration-200 hover:bg-[#141414] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2 active:scale-95">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Reviews />
    </div>
  );
};

export default Home;
