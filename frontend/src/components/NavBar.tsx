import { useState, useEffect } from "react";
import type { CurrentCompanyType, UserType } from "../interfaces/types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  user?: UserType | null;
  setUser: (user: UserType | null) => void;
}

interface NotificationType {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const NavBar = ({ user, setUser }: Props) => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<CurrentCompanyType>();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  console.log(user, "USER AS");
  // Scroll progress logic (unchanged)
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

  // Fetch current company (unchanged)
  useEffect(() => {
    const fetchCurrentCompany = async () => {
      const res = await axios.get("http://localhost:5000/api/current-company");
      setCurrentCompany(res.data);
    };
    fetchCurrentCompany();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/notifications",
          {},
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [user]);

const updateNotificationStatus = async () => {
  try {
    await axios.patch("http://localhost:5000/api/notifications/read");

    setNotifications((prev) =>
      prev.map((prev) => ({
        ...prev,
        is_read: true,
      }))
    );
  } catch (error) {
    console.error(error);
  }
};


  const unreadCount = notifications.filter((notification) => !notification.is_read).length;
  console.log(notifications,"NOTIFICATIONS")
  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout");
    setUser(null);
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-[#101010]/60 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="w-10/12 mx-auto">
          <div
            className={`flex justify-between items-center ${currentCompany ? "py-6" : "py-3"} text-white`}
          >
            {!currentCompany?.name ? (
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <img
                  src="/img/LOGO-1.png"
                  alt="Logo"
                  className="h-14 sm:h-20 w-auto rounded-3xl border-2 border-orange-300 transition-transform duration-300 ease-out hover:scale-[1.06]"
                />
              </Link>
            ) : (
              <Link to="/calendar">
                <span className="text-orange-400 border-2 p-2 rounded-md font-extrabold">
                  {currentCompany?.name.toLocaleUpperCase()}
                </span>
              </Link>
            )}

            <ul className="hidden md:flex items-center gap-6">
              {!currentCompany && (
                <Link to="/">
                  <li className="hover:text-orange-300">Home</li>
                </Link>
              )}

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

              {/* 🔔 Notifications Dropdown */}

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
              {user && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotifications((prevState) => !prevState);
                      updateNotificationStatus()
                    }}
                    className="relative hover:text-orange-300"
                  >
                    🔔
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center text-[10px] text-white bg-red-500 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-3 w-80 bg-[#111]/90 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl z-50"
                    >
                      <div className="p-3 border-b border-white/10 text-sm font-semibold">
                        Notifications
                      </div>

                      {notifications.length === 0 ? (
                        <p className="p-4 text-gray-400 text-sm">
                          No notifications
                        </p>
                      ) : (
                        <ul className="max-h-80 overflow-y-auto">
                          {notifications.map((n) => (
                            <li
                              key={n.id}
                              className={`p-3 border-b border-white/5 text-sm cursor-pointer ${
                                !n.is_read    
                                  ? "bg-orange-500/10"
                                  : "hover:bg-white/5"
                              }`}
                            >
                              <p className="font-semibold">{n.title}</p>
                              <p className="text-gray-400 text-xs">
                                {n.message}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </ul>

            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden text-3xl"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-[#101010]">
        <div
          className="h-full bg-orange-50 transition-all duration-300 ease-in-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
};

export default NavBar;
