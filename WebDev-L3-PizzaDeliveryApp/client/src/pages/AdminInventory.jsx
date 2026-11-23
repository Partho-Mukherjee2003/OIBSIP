import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [stocks, setStocks] = useState({});
  const navigate = useNavigate();

  const fetchItems = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/admin/inventory`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await res.json();
    if (res.ok) {
      setItems(data);
      const obj = {};
      data.forEach((i) => (obj[i._id] = i.stock));
      setStocks(obj);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchItems();
  }, [navigate]);

  const updateStock = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/admin/inventory/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: Number(stocks[id]) }),
      },
    );
    if (res.ok) toast.success("Stock updated");
    else toast.error("Update failed");
  };

  return (
    <section className="min-h-[80vh] bg-white px-4 py-16 text-[#141414]">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-4xl font-extrabold uppercase">
          Admin <span className="text-[#F7941D]">Inventory</span>
        </h2>

        <div className="mt-10 space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-4"
            >
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-xs uppercase text-gray-500">
                  {item.category} · ₹{item.price}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={stocks[item._id] ?? item.stock}
                  onChange={(e) =>
                    setStocks({ ...stocks, [item._id]: e.target.value })
                  }
                  className="w-24 rounded-full border border-[#F5E6CC] bg-white px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => updateStock(item._id)}
                  className="rounded-full bg-[#F7941D] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminInventory;
