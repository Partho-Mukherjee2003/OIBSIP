import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaBars,
  FaPizzaSlice,
  FaPhoneAlt,
  FaShoppingBag,
  FaTimes,
} from "react-icons/fa";

const links = [
  ["Home", "/"],
  ["Menu", "/menu"],
  ["Custom Pizza", "/builder"],
  ["Login", "/login"],
  ["Register", "/register"],
];

const navClass = ({ isActive }) =>
  `font-semibold tracking-wide transition-colors hover:text-[#F7941D] ${
    isActive ? "text-[#F7941D]" : "text-white"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#121212]/95 text-white shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          to="/"
          aria-label="Pizzon home"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center text-3xl font-extrabold italic leading-none"
        >
          <span className="text-[#F7941D]">P</span>
          <FaPizzaSlice className="mx-0.5 rotate-[-45deg] text-[21px] text-[#F7941D]" />
          <span>zza</span>
          <span className="text-[#F7941D]">.</span>
        </Link>

        <div className="hidden items-center gap-6 text-xs uppercase xl:flex 2xl:gap-8 2xl:text-sm">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === "/"} className={navClass}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-4 text-xs lg:flex xl:gap-5 xl:text-sm">
          <a
            href="tel:+91123456789"
            className="hidden items-center gap-2 whitespace-nowrap transition hover:text-[#F7941D] 2xl:flex"
          >
            <FaPhoneAlt className="text-[#F7941D]" /> +91 123 456 789
          </a>
          <Link
            to="/cart"
            className="flex items-center gap-2 whitespace-nowrap transition hover:text-[#F7941D]"
          >
            <FaShoppingBag className="text-[#F7941D]" />
            <span>0 items · $0.00</span>
          </Link>
          <Link
            to="/menu"
            className="whitespace-nowrap rounded-full bg-[#F7941D] px-4 py-2.5 font-bold uppercase text-white transition hover:bg-[#e07f0a] sm:px-5"
          >
            Order Online
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 text-xl text-white transition hover:text-[#F7941D] lg:hidden"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#191919] px-4 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={navClass}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <a
              href="tel:+91123456789"
              className="flex items-center gap-2 text-sm text-white"
            >
              <FaPhoneAlt className="text-[#F7941D]" /> +91 123 456 789
            </a>
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm text-white"
            >
              <FaShoppingBag className="text-[#F7941D]" /> 0 items · $0.00
            </Link>
            <Link
              to="/menu"
              onClick={() => setOpen(false)}
              className="w-fit rounded-full bg-[#F7941D] px-5 py-2.5 text-sm font-bold uppercase text-white"
            >
              Order Online
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
