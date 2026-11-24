import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaSpinner,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setEmail("");
        setPassword("");
        toast.success("Login successful!");
        navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
      } else {
        setMessage(data.message || "Login failed");
        toast.error(data.message || "Login failed");
      }
    } catch {
      setMessage("Server error. Please try again.");
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google diye login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: tokenResponse.access_token }),
          },
        );
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success("Login successful!");
          navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
        } else {
          toast.error(data.message || "Google login failed");
        }
      } catch {
        toast.error("Server error. Please try again.");
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  const inputClass =
    "w-full rounded-lg border border-transparent bg-[#262626] py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition duration-200 hover:border-[#3a3a3a] focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/40";

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-[#141414] px-4 py-10 text-white sm:py-16">
      <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="hidden flex-col items-center text-center lg:flex">
          <div className="relative w-full max-w-[460px] xl:max-w-[540px]">
            <img
              src="/images/loginPizza.jpg"
              alt="Freshly baked pizza"
              className="aspect-square w-full rounded-full object-cover shadow-2xl motion-safe:animate-[spin_120s_linear_infinite]"
            />
            <span className="absolute -right-2 top-8 rounded-full bg-[#F7941D] px-4 py-2 text-sm font-extrabold uppercase text-black shadow-lg">
              Fresh &amp; Hot
            </span>
          </div>

          <div className="mt-8 flex items-center gap-1 text-sm text-[#F7941D]">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <p className="mt-2 text-3xl font-extrabold leading-tight">
            Hot, cheesy &amp;{" "}
            <span className="text-[#F7941D]">made for you</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-gray-400">
            Log in and get your favourite pizza in minutes.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          autoComplete="off"
          className="mx-auto w-full max-w-md rounded-2xl border border-[#262626] bg-[#1f1f1f] p-6 shadow-xl sm:p-8"
        >
          <p className="text-center text-2xl italic text-[#F7941D]">
            Welcome Back
          </p>
          <h2 className="mt-2 text-center text-4xl font-extrabold uppercase">
            Log<span className="text-[#F7941D]">in</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Hungry? Sign in and order your next slice.
          </p>

          <label
            htmlFor="email"
            className="mt-8 block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <div className="relative mt-1.5">
            <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <label
            htmlFor="password"
            className="mt-4 block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <div className="relative mt-1.5">
            <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition duration-200 hover:text-[#F7941D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D]"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-[#F7941D] transition hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {message && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-sm text-red-400"
            >
              {message}
            </div>
          )}

          <button
            disabled={loading}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 font-bold uppercase text-black transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1f1f] ${
              loading
                ? "cursor-not-allowed bg-[#b06a12]"
                : "cursor-pointer bg-[#F7941D] hover:-translate-y-0.5 hover:bg-[#e07f0a] active:translate-y-0 active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* OR divider */}
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#262626]" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              OR
            </span>
            <span className="h-px flex-1 bg-[#262626]" />
          </div>

          {/* Google login button */}
          <button
            type="button"
            onClick={() => googleLogin()}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-[#3a3a3a] bg-white py-3 font-bold text-[#141414] transition duration-200 hover:-translate-y-0.5 hover:bg-gray-100 active:scale-95"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm text-gray-400">
            New here?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#F7941D] transition hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
