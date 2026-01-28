import type { userType } from "../interfaces/types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

interface Props {
  user?: userType | null;
  setUser: (user: userType | null) => void;
}

const NavBar = ({ user, setUser }: Props) => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout");
    setUser(null);
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-[#101010] shadow-md">
        <div className="w-10/12 mx-auto">
          <div className="flex justify-between items-center  py-3 text-white">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <img
                src="/img/LOGO-1.png"
                alt="Logo"
                className="
                  h-14 sm:h-20 w-auto
                  rounded-3xl
                  border-2 border-orange-300
                  transition-transform duration-300 ease-out
                  hover:scale-[1.06]
                "
              />
            </Link>

            <ul className="hidden md:flex items-center gap-6">
              <Link to="/">
                <li className="hover:text-orange-300">Home</li>
              </Link>
              <Link to="/calendar">
                <li className="hover:text-orange-300">Calendar</li>
              </Link>
              <Link to="/employees">
                <li className="hover:text-orange-300">Employees</li>
              </Link>
              <Link to="/time">
                <li className="hover:text-orange-300">Time</li>
              </Link>
              <Link to="/aboutme">
                <li className="hover:text-orange-300">My Status</li>
              </Link>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login">
                    <li className="hover:text-orange-300">Login</li>
                  </Link>
                  <Link to="/register">
                    <li className="hover:text-orange-300">Register</li>
                  </Link>
                </>
              )}

              {user && user.role === "admin" && (
                <Link to="/admin">
                  <li className="hover:text-yellow-400">Admin</li>
                </Link>
              )}
            </ul>

            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden text-3xl"
            >
              ☰
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-4">
              <ul className="flex flex-col gap-4 text-white px-5">
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/calendar" onClick={() => setMenuOpen(false)}>
                  Calendar
                </Link>
                <Link to="/employees" onClick={() => setMenuOpen(false)}>
                  Employees
                </Link>
                <Link to="/time" onClick={() => setMenuOpen(false)}>
                  Time Tracking
                </Link>
                <Link to="/about" onClick={() => setMenuOpen(false)}>
                  My Status
                </Link>

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 px-3 py-1 rounded w-fit"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)}>
                      Register
                    </Link>
                  </>
                )}

                {user && user.role === "admin" && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>
                    <span className="text-yellow-400">Admin</span>
                  </Link>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-1 bg-[#101010] ">
        <div
          className="h-full bg-orange-50 transition-all duration-300 ease-in-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
};

export default NavBar;
