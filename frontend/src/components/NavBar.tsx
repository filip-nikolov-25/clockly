import type { userType } from "../interfaces/types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

interface props {
  user?: userType | null;
  setUser: (user: userType | null) => void;
}

const NavBar = ({ user, setUser }: props) => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 shadow-md bg-black">
      <ul className="flex justify-between items-center border-b-2 border-gray-700 px-5 py-3 text-white">
        <Link to="/">
          <li className="cursor-pointer w-full flex justify-center items-center">
            <img
              src="/img/LOGO-1.png"
              alt="Logo"
              className="
                h-20 w-auto
                rounded-3xl
                border-2 border-orange-300
                transition-transform duration-300 ease-out
                hover:scale-[1.06]
              "
            />
          </li>
        </Link>

        <div className="flex justify-between w-1/3">
          <Link to="/">
            <li className="cursor-pointer hover:text-orange-300 transition-colors duration-200">
              Home
            </li>
          </Link>
          <Link to="/employees">
            <li className="cursor-pointer hover:text-orange-300 transition-colors duration-200">
              Employees
            </li>
          </Link>
          <Link to="/time">
            <li className="cursor-pointer hover:text-orange-300 transition-colors duration-200">
              Time Tracking
            </li>
          </Link>
          <Link to="/about">
            <li className="cursor-pointer hover:text-orange-300 transition-colors duration-200">
              My Status
            </li>
          </Link>
          <div className="flex gap-4">
            {user ? (
              <li>
                <button
                  onClick={async () => {
                    await axios.post("http://localhost:5000/api/auth/logout");
                    setUser(null);
                    navigate("/login");
                  }}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <Link to="/login">
                  <li className="cursor-pointer hover:text-orange-300 transition-colors duration-200">
                    Login
                  </li>
                </Link>
                <Link to="/register">
                  <li className="cursor-pointer hover:text-orange-300 transition-colors duration-200">
                    Register
                  </li>
                </Link>
              </>
            )}
            {user && user.role === "admin" && (
              <Link to="/admin">
                <li className="cursor-pointer hover:text-yellow-400 transition-colors duration-200">
                  Admin
                </li>
              </Link>
            )}
          </div>
        </div>
      </ul>
      <div
        className="h-1 bg-orange-100 transition-all duration-700 ease-out"
        style={{ width: `${scrollProgress}%` }}
      ></div>
    </div>
  );
};

export default NavBar;
