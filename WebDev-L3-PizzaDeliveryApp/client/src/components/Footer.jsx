import { Link } from "react-router-dom";
import {
  FaPizzaSlice,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#121212] text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="md:justify-self-start">
          <Link
            to="/"
            aria-label="Pizzon home"
            className="flex shrink-0 items-center text-3xl font-extrabold italic leading-none"
          >
            <span className="text-[#F7941D]">P</span>
            <FaPizzaSlice className="mx-0.5 rotate-[-45deg] text-[21px] text-[#F7941D]" />
            <span className="text-white">zza</span>
            <span className="text-[#F7941D]">.</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Fresh, hot and tasty pizzas delivered to your door. Build your own
            pizza with your favourite base, sauce, cheese and vegetables.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              className="flex size-9 items-center justify-center rounded-full bg-[#262626] transition hover:bg-[#F7941D]"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="flex size-9 items-center justify-center rounded-full bg-[#262626] transition hover:bg-[#F7941D]"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="flex size-9 items-center justify-center rounded-full bg-[#262626] transition hover:bg-[#F7941D]"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        <div className="md:justify-self-center">
          <h3 className="mb-4 text-lg font-bold uppercase text-white">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="transition hover:text-[#F7941D]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="transition hover:text-[#F7941D]">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/builder" className="transition hover:text-[#F7941D]">
                Custom Pizza
              </Link>
            </li>
            <li>
              <Link to="/login" className="transition hover:text-[#F7941D]">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="transition hover:text-[#F7941D]">
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:justify-self-end">
          <h3 className="mb-4 text-lg font-bold uppercase text-white">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-[#F7941D]" /> Dhaka, Bangladesh
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#F7941D]" /> +91 123 456 789
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-[#F7941D]" /> pizzadot@example.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-sm sm:px-6">
          © 2026 Pizza Dot. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
