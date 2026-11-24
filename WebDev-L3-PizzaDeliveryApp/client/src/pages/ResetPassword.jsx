import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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
    <section className="flex min-h-[80vh] items-center justify-center bg-white px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border-2 border-[#F5E6CC] bg-[#FFF9ED] p-8">
        <h2 className="text-center text-3xl font-extrabold uppercase">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Choose a new password for your account.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-bold">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="mt-1 w-full rounded-full border-2 border-[#F5E6CC] bg-white px-4 py-3 outline-none focus:border-[#F7941D]"
            />
          </div>
          <div>
            <label className="text-sm font-bold">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Type the new password again"
              required
              className="mt-1 w-full rounded-full border-2 border-[#F5E6CC] bg-white px-4 py-3 outline-none focus:border-[#F7941D]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#F7941D] py-3.5 font-bold uppercase text-black transition hover:bg-[#141414] hover:text-white disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
