import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        toast.success("Reset link sent! Check your email.");
      } else {
        toast.error(data.message || "Something went wrong");
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
          Forgot Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Enter your email and we will send you a reset link.
        </p>

        {sent ? (
          <div className="mt-8 text-center">
            <FaEnvelope className="mx-auto text-5xl text-[#F7941D]" />
            <p className="mt-4 font-bold">Check your inbox!</p>
            <p className="mt-1 text-sm text-gray-500">
              We sent a password reset link to{" "}
              <span className="font-bold text-[#141414]">{email}</span>
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-full bg-[#F7941D] px-8 py-3 font-bold uppercase text-black transition hover:bg-[#141414] hover:text-white"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-bold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1 w-full rounded-full border-2 border-[#F5E6CC] bg-white px-4 py-3 outline-none focus:border-[#F7941D]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#F7941D] py-3.5 font-bold uppercase text-black transition hover:bg-[#141414] hover:text-white disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ForgotPassword;
