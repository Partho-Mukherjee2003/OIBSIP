import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaKey, FaLock } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset! Please login.");
        navigate("/login");
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-white px-4 py-16 text-[#141414]">
      <div className="w-full max-w-md rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-8 shadow-[0_20px_40px_-15px_rgba(247,148,29,0.25)]">
        {/* icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7941D] shadow-lg">
          <FaKey className="text-2xl text-white" />
        </div>

        <p className="mt-5 text-center text-xl italic text-[#F7941D]">
          Almost there
        </p>
        <h2 className="mt-1 text-center text-3xl font-extrabold uppercase text-[#141414]">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-bold text-[#141414]">
              New Password
            </label>
            <div className="relative mt-1.5">
              <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full rounded-full border-2 border-[#F5E6CC] bg-white py-3 pl-11 pr-4 text-[#141414] placeholder-gray-400 outline-none transition focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/30"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-[#141414]">
              Confirm Password
            </label>
            <div className="relative mt-1.5">
              <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Type the new password again"
                required
                className="w-full rounded-full border-2 border-[#F5E6CC] bg-white py-3 pl-11 pr-4 text-[#141414] placeholder-gray-400 outline-none transition focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/30"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#F7941D] py-3.5 font-bold uppercase text-black transition hover:bg-[#141414] hover:text-white disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          <p className="pt-1 text-center text-sm text-gray-500">
            <Link
              to="/login"
              className="font-bold text-[#F7941D] hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
