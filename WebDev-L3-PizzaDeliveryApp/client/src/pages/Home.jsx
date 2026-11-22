import { useEffect, useState } from "react";
import Banner from "../components/Banner";

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

      <section className="bg-white text-black py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[#F7941D] italic text-xl">
            Our Special Menu
          </p>
          <h2 className="text-center text-4xl font-extrabold uppercase mb-10">
            Our Pizzas
          </h2>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pizzas.map((pizza) => (
                <div
                  key={pizza._id}
                  className="border rounded-xl overflow-hidden shadow hover:shadow-xl"
                >
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{pizza.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {pizza.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[#F7941D] font-bold text-xl">
                        ₹{pizza.price}
                      </span>
                      <button className="bg-[#F7941D] text-white px-4 py-1 rounded-full text-sm font-bold">
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
    </div>
  );
};

export default Home;
