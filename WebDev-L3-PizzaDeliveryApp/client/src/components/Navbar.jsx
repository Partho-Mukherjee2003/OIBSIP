import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaPizzaSlice, FaTimes, FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const navClass = ({ isActive }) =>
  `font-semibold tracking-wide transition-colors hover:text-[#F7941D] ${
    isActive ? "text-[#F7941D]" : "text-white"
  }`;

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// Profile picture, or the first letter of the name if there is no picture
const Avatar = ({ user }) => {
  const src = user?.image || user?.avatar || user?.photo;
  const letter = (user?.name || "U").charAt(0).toUpperCase();

  return src ? (
    <img
      src={src}
      alt={user?.name || "Profile"}
      className="size-10 shrink-0 rounded-full border-2 border-[#F7941D] object-cover"
    />
  ) : (
    <span
      aria-label={user?.name || "Profile"}
      className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[#F7941D] bg-[#262626] text-base font-bold text-[#F7941D]"
    >
      {letter}
    </span>
  );
};

const logoutBtnClass =
  "inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7941D] px-5 py-2.5 text-sm font-bold uppercase text-white transition duration-200 hover:bg-[#e07f0a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7941D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] active:scale-95";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useLocation(); // page change hole navbar abar check korbe

  const token = localStorage.getItem("token");
  const user = getUser();
  const isAdmin = user?.role === "admin";

  // Role onujayi links — admin: Admin panel, user: Dashboard
  const links = !token
    ? [
        ["Home", "/"],
        ["Menu", "/menu"],
        ["Custom Pizza", "/builder"],
        ["Login", "/login"],
        ["Register", "/register"],
      ]
    : isAdmin
      ? [
          ["Home", "/"],
          ["Menu", "/menu"],
          ["Custom Pizza", "/builder"],
          ["Admin", "/admin"],
        ]
      : [
          ["Home", "/"],
          ["Menu", "/menu"],
          ["Custom Pizza", "/builder"],
          ["Dashboard", "/dashboard"],
        ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

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
          <Link
            to="/menu"
            className="whitespace-nowrap rounded-full bg-[#F7941D] px-4 py-2.5 font-bold uppercase text-white transition hover:bg-[#e07f0a] sm:px-5"
          >
            0 items · $0.00
          </Link>

          {/* Logged in: profile picture + highlighted logout button */}
          {token && (
            <div className="flex items-center gap-3 border-l border-white/10 pl-4 xl:pl-5">
              <Avatar user={user} />
              <button onClick={handleLogout} className={logoutBtnClass}>
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 text-xl text-white transition hover:text-[#F7941D] xl:hidden"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#191919] px-4 py-5 xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">
            {token && (
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <Avatar user={user} />
                <div className="min-w-0">
                  <p className="truncate font-bold">
                    {user?.name || "My Account"}
                  </p>
                  {user?.email && (
                    <p className="truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            )}

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

            <Link
              to="/menu"
              onClick={() => setOpen(false)}
              className="w-fit rounded-full bg-[#F7941D] px-5 py-2.5 text-sm font-bold uppercase text-white"
            >
              0 items · $0.00
            </Link>

            {token && (
              <button
                onClick={handleLogout}
                className={`${logoutBtnClass} w-fit`}
              >
                <FaSignOutAlt />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
