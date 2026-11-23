import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setName(data.name || "");
        setImage(data.image || "");
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/profile`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, image }),
      },
    );
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Profile updated!");
    } else {
      toast.error(data.message || "Update failed");
    }
  };

  if (!user) return <p className="py-20 text-center">Loading...</p>;

  return (
    <section className="min-h-[80vh] bg-white px-4 py-16 text-[#141414]">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-8 text-center">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="mx-auto size-28 rounded-full border-4 border-[#F7941D] object-cover"
            />
          ) : (
            <span className="mx-auto flex size-28 items-center justify-center rounded-full border-4 border-[#F7941D] bg-[#141414] text-5xl font-bold text-[#F7941D]">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          )}
          <h2 className="mt-4 text-2xl font-extrabold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span className="mt-2 inline-block rounded-full bg-[#F7941D] px-3 py-1 text-xs font-bold uppercase text-white">
            {user.role}
          </span>
        </div>

        <form
          onSubmit={handleUpdate}
          className="mt-6 space-y-4 rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-8"
        >
          <h3 className="text-lg font-extrabold uppercase">Update Profile</h3>
          <div>
            <label className="mb-1 block text-sm font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-full border-2 border-[#F5E6CC] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7941D]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Photo URL
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-full border-2 border-[#F5E6CC] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7941D]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-[#F7941D] px-5 py-2.5 text-sm font-bold uppercase text-white transition hover:bg-[#141414]"
          >
            Update Name & Photo
          </button>
        </form>
      </div>
    </section>
  );
};

export default Profile;
