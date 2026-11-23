import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const token = searchParams.get("token");
      if (!token) {
        toast.error("Invalid verification link");
        navigate("/login");
        return;
      }
      localStorage.setItem("token", token);
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Email verified! Welcome to Pizza Dot");
        navigate(data.role === "admin" ? "/admin" : "/dashboard");
      } else {
        toast.error("Verification failed. Please login.");
        navigate("/login");
      }
    };
    verifyUser();
  }, [navigate, searchParams]);

  return (
    <section className="min-h-[80vh] bg-white px-4 py-16 text-center text-[#141414]">
      <Loader />
      <p className="mt-4 text-gray-500">Verifying your email...</p>
    </section>
  );
};

export default Verify;
