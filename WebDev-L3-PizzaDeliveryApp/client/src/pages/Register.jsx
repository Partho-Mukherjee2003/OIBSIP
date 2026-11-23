import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPizzaSlice,
  FaTruck,
  FaTags,
  FaCheckCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const perks = [
  {
    icon: FaTruck,
    title: "Fast Delivery",
    text: "Hot pizza at your door in no time.",
  },
  {
    icon: FaPizzaSlice,
    title: "Build Your Own",
    text: "Pick your base, sauce, cheese and veggies.",
  },
  {
    icon: FaTags,
    title: "Member Offers",
    text: "Get special deals only for members.",
  },
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        setMessage(
          "Registration successful! Please check your email to verify your account.",
        );
        toast.success("Registration successful! Check your email to verify.");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(data.message || "Registration failed");
        toast.error(data.message || "Registration failed");
      }
    } catch {
      setMessage("Server error. Please try again.");
      toast.error("Server error. Please try again.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-transparent bg-[#262626] py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none transition duration-200 hover:border-[#3a3a3a] focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/40";

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-[#141414] px-4 py-12 text-white sm:py-16">
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <p className="text-2xl italic text-[#F7941D]">Welcome to Pizza Dot</p>
          <h1 className="mt-2 text-5xl font-extrabold uppercase leading-tight">
            Create your <span className="text-[#F7941D]">account</span>
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-gray-400">
            Join thousands of pizza lovers. Sign up in a minute and start
            ordering your favourite pizzas.
          </p>
          <ul className="mt-8 space-y-5">
            {perks.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#1f1f1f] text-[#F7941D] ring-1 ring-[#262626]">
                  <Icon />
                </span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-sm text-gray-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleRegister}
          autoComplete="off"
          className="mx-auto w-full max-w-md rounded-2xl border border-[#262626] bg-[#1f1f1f] p-6 shadow-xl sm:p-8"
        >
          <p className="text-center text-2xl italic text-[#F7941D]">Join Us</p>
          <h2 className="mt-2 text-center text-4xl font-extrabold uppercase">
            Reg<span className="text-[#F7941D]">ister</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Fill in your details to get started
          </p>

          <label
            htmlFor="name"
            className="mt-8 block text-sm font-medium text-gray-300"
          >
            Full Name
          </label>
          <div className="relative mt-1.5">
            <FaUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <label
            htmlFor="email"
            className="mt-4 block text-sm font-medium text-gray-300"
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
              minLength={6}
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
          <p className="mt-1.5 text-xs text-gray-500">
            Use at least 6 characters.
          </p>

          {message && (
            <div
              role="status"
              className={`mt-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${isSuccess ? "border-green-600/40 bg-green-600/10 text-green-400" : "border-red-600/40 bg-red-600/10 text-red-400"}`}
            >
              {isSuccess && <FaCheckCircle className="mt-0.5 shrink-0" />}
              <span>{message}</span>
            </div>
          )}

          <button className="mt-6 w-full cursor-pointer rounded-full bg-[#F7941D] py-3 font-bold uppercase text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#e07f0a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1f1f] active:translate-y-0 active:scale-95">
            Register
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
            By registering, you agree to our Terms of Service and Privacy
            Policy.
          </p>

          <div className="my-5 h-px bg-[#262626]" />

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#F7941D] transition hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
