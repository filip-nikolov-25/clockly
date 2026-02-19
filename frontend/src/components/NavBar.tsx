import { useState, useEffect } from "react";
import type { UserType } from "../interfaces/types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  user?: UserType | null;
  setUser: (user: UserType | null) => void;
  currentCompany: string | undefined;
  setCurrentCompany: (companyName: string) => void;
}

interface NotificationType {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const NavBar = ({
  user,
  setUser,
  currentCompany,
  setCurrentCompany,
}: Props) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const url =
          user.role === "admin"
            ? "http://localhost:5000/api/admin-notifications"
            : "http://localhost:5000/api/notifications";

        const res = await axios.get(url);
        const uniqueNotifications = Array.from(
          new Map(res.data.map((n : any) => [n.id, n])).values(),
        );
        setNotifications(uniqueNotifications as any);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [user]);


  const updateNotificationStatus = async () => {
    try {
      await axios.patch(
        user?.role === "admin"
          ? "http://localhost:5000/api/admin-notifications/read"
          : "http://localhost:5000/api/notifications/read",
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout");
    setUser(null);
    navigate("/login");
    setMenuOpen(false);
    setCurrentCompany("");
  };

  useEffect(() => {
    if (!showNotifications) return;
    if (unreadCount === 0) return;

    updateNotificationStatus();
  }, [showNotifications]);

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-[#101010]/60 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="w-10/12 mx-auto">
          <div
            className={`flex justify-between items-center ${
              currentCompany ? "py-6" : "py-3"
            } text-white`}
          >
            {!currentCompany ? (
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
                  {currentCompany.toLocaleUpperCase()}
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
                      setShowNotifications((prev) => !prev);
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
                          {user.role === "admin"
                            ? notifications.length > 0 && (
                                <Link to={"/admin"}>
                                  <li className="p-3 border-b border-white/5 text-sm cursor-pointer bg-orange-500/10">
                                    <p className="font-semibold">
                                      You have{" "}
                                      <span className="text-orange-400">
                                        pending
                                      </span>{" "}
                                      absence request
                                      {notifications.length > 1 ? "s" : ""} from
                                      your employees
                                    </p>
                                    <p className="text-gray-400 text-xs mt-2">
                                      Go to Admin Panel to view more details
                                    </p>
                                  </li>
                                </Link>
                              )
                            : notifications.map((n, index) => (
                           <Link to={"/aboutme"}>
                                 <li
                                  key={`${n.id}-${index}`} 
                                  className={`p-3 border-b border-white/5 text-sm cursor-pointer ${
                                    !n.is_read
                                      ? "bg-orange-500/10"
                                      : "hover:bg-white/5"
                                  }`}
                                >
                                  <p className="font-semibold">{n.title}</p>
                                  <p className="text-gray-400 text-xs mt-2">
                                    {n.message}
                                  </p>
                                </li>
                           </Link>
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
    </div>
  );
};

export default NavBar;
