import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useCart } from "../context/useCart";

const Menu = () => {
  const [searchParams] = useSearchParams();
  const [pizzas, setPizzas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "default");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/pizzas`)
      .then((res) => res.json())
      .then((data) => setPizzas(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  // Search + category + price filter
  let filtered = pizzas.filter((pizza) => {
    const matchSearch = pizza.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || pizza.category === category;
    const matchPrice = !maxPrice || pizza.price <= Number(maxPrice);
    return matchSearch && matchCategory && matchPrice;
  });

  // Sorting
  if (sort === "price-low")
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-high")
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "name")
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const filterBtn = (label) =>
    `rounded-full px-4 py-1.5 text-xs font-bold uppercase transition ${
      category === label
        ? "bg-[#F7941D] text-white"
        : "border border-[#F5E6CC] bg-[#FFF9ED] text-gray-600 hover:border-[#F7941D]"
    }`;

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

        {/* Search + Filter + Sort bar */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pizza by name..."
                className="w-full rounded-full border-2 border-[#F5E6CC] bg-[#FFF9ED] py-2.5 pl-11 pr-4 text-sm text-[#141414] outline-none transition focus:border-[#F7941D]"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="cursor-pointer rounded-full border-2 border-[#F5E6CC] bg-[#FFF9ED] px-4 py-2.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#F7941D]"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {["All", "Veg", "Non-Veg"].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setMaxPrice("");
                }}
                className={filterBtn(c)}
              >
                {c}
              </button>
            ))}
            {maxPrice && (
              <button
                onClick={() => setMaxPrice("")}
                className="rounded-full bg-[#141414] px-4 py-1.5 text-xs font-bold uppercase text-white transition hover:bg-red-600"
              >
                Under ₹{maxPrice} ×
              </button>
            )}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <p className="mt-14 text-center text-lg font-semibold text-gray-500">
            No pizza found. Try another search.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((pizza) => (
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
                    <button
                      onClick={() => {
                        addToCart(pizza);
                        toast.success(`${pizza.name} added to cart`);
                      }}
                      className="w-full cursor-pointer rounded-full bg-[#F7941D] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition duration-200 hover:bg-[#141414] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2 active:scale-95"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
