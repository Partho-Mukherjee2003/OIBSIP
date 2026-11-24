import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Loader from "../components/Loader";
import Features from "../components/Features";
import Reviews from "../components/Reviews";
import RollingPizza from "../components/RollingPizza";
import Categories from "../components/Categories";

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

      {loading ? (
        <div className="bg-white py-14">
          <Loader />
        </div>
      ) : (
        <Categories pizzas={pizzas} />
      )}

      <Reviews />
    </div>
  );
};

export default Home;
