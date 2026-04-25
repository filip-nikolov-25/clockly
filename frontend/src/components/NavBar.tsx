import { useState, useEffect, useRef } from "react";
import type { NotificationType, UserType } from "../interfaces/types";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  Calendar,
  Briefcase,
  Clock,
  Menu,
  X,
} from "lucide-react";

interface Props {
  user?: UserType | null;
  setUser: (user: UserType | null) => void;
  currentCompany: string | undefined;
  setCurrentCompany: (companyName: string) => void;
}

const NavBar = ({
  user,
  setUser,
  currentCompany,
  setCurrentCompany,
}: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNotifications = async (newOffset = 0, reset = false) => {
    try {
      const url =
        user?.role === "admin"
          ? `${API_URL}/api/admin-notifications`
          : `${API_URL}/api/notifications`;

      const res = await axios.get(url, {
        params: {
          limit,
          offset: newOffset,
        },
      });

      const data = res.data;

      if (reset) {
        setNotifications(data);
      } else {
        setNotifications((prev) => [...prev, ...data]);
      }

      if (data.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };
  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const newOffset = offset + limit;
    await fetchNotifications(newOffset);
    setOffset(newOffset);
    setLoadingMore(false);
  };
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    if (isBottom && hasMore && !loadingMore) {
      loadMore();
    }
  };
  const handleOpenedNotifications = () => {
    localStorage.setItem("lastSeenNotifications", new Date().toISOString());
  };

  useEffect(() => {
    if (!user) return;
    setOffset(0);
    setHasMore(true);
    fetchNotifications(0, true);
  }, [user]);

  const updateNotificationStatus = async () => {
    try {
      await axios.patch(
        user?.role === "admin"
          ? `${API_URL}/api/admin-notifications/read`
          : `${API_URL}/api/notifications/read`,
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const lastSeen = localStorage.getItem("lastSeenNotifications");

  const unreadCount = notifications.filter((n) => {
    if (!lastSeen) return true;
    return new Date(n.created_at) > new Date(lastSeen);
  }).length;
  const handleLogout = async () => {
    await axios.post(`${API_URL}/api/auth/logout`);
    setUser(null);
    navigate("/login");
    setMenuOpen(false);
    setCurrentCompany("");
  };

  useEffect(() => {
    if (showNotifications && unreadCount > 0) updateNotificationStatus();
  }, [showNotifications]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) //handle click outside of notification dropdown to close it
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Calendar", path: "/calendar", icon: <Calendar size={16} /> },
    { name: "Employees", path: "/employees", icon: <Briefcase size={16} /> },
    { name: "Time", path: "/time", icon: <Clock size={16} /> },
    { name: "My Status", path: "/aboutme", icon: <UserIcon size={16} /> },
  ];

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-[#101010]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="w-11/12 mx-auto flex justify-between items-center py-4 text-white">
          <Link
            to={currentCompany ? "/calendar" : "/"}
            className="flex items-center gap-3 shrink-0"
          >
            {currentCompany ? (
              <span className="text-orange-500 border border-orange-500/30 bg-orange-500/5 px-3 md:px-4 py-1.5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] truncate max-w-37.5 md:max-w-none">
                {currentCompany}
              </span>
            ) : (
              <img
                src="/img/LOGO-1.png"
                alt="Logo"
                className="h-8 md:h-10 w-auto rounded-xl border border-white/10"
              />
            )}
          </Link>

          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {!currentCompany && (
              <Link
                to="/"
                className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                Demo
              </Link>
            )}

            {user &&
              navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${location.pathname === link.path ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  {link.name}
                </Link>
              ))}

            {user && (
              <>
                <div className="w-px h-4 bg-zinc-800" />
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-emerald-500 hover:text-emerald-400"
                  >
                    <ShieldCheck size={20} />
                  </Link>
                )}

                <div ref={notificationRef} className="relative mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!showNotifications) {
                        handleOpenedNotifications();
                        setOffset(0);
                        setHasMore(true);
                        fetchNotifications(0, true);
                      }
                      setShowNotifications(!showNotifications);
                    }}
                    className="relative text-zinc-400 hover:text-white transition-colors"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-4 w-80 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4">
                      <div className="p-4 border-b border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        Notifications
                      </div>
                      <div
                        className="max-h-80 overflow-y-auto"
                        onScroll={handleScroll}
                      >
                        {notifications.length === 0 ? (
                          <p className="p-6 text-center text-xs text-zinc-600">
                            No new notifications
                          </p>
                        ) : (
                          notifications.map((n, i) => (
                            <div
                              key={i}
                              className="p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer"
                            >
                              <Link
                                to={`${user.role === "admin" ? "/admin" : "/aboutme"}`}
                                className="text-zinc-400 hover:text-white transition-colors"
                                onClick={() => setShowNotifications(false)}
                              >
                                <p className="text-xs font-bold text-white">
                                  {n.title}
                                </p>
                                <p className="text-[10px] text-zinc-500 mt-1">
                                  {n.message}
                                </p>
                              </Link>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="text-zinc-500 hover:text-red-500 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}

            {!user && (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="text-xs font-black uppercase tracking-widest text-white"
                >
                  Login
                </Link>
              </div>
            )}
          </ul>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-18.25 bg-[#101010] z-40 animate-in slide-in-from-right duration-300">
          <nav className="flex flex-col p-6 gap-6">
            {!currentCompany && (
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-lg font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-4"
              >
                Demo
              </Link>
            )}

            {user ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`text-lg font-bold uppercase tracking-widest flex items-center gap-4 py-2 ${location.pathname === link.path ? "text-orange-500" : "text-zinc-400"}`}
                  >
                    <span className="p-2 bg-zinc-900 rounded-lg">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}

                <div className="h-px bg-white/5 my-2" />

                <div className="flex items-center justify-between">
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-4 text-emerald-500 font-bold uppercase tracking-widest"
                    >
                      <ShieldCheck size={20} /> Admin Panel
                    </Link>
                  )}

                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        if (!showNotifications) {
                          handleOpenedNotifications();
                          fetchNotifications(0, true);
                        }
                      }}
                      className="relative text-zinc-400"
                    >
                      <Bell size={24} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-zinc-500 flex items-center gap-2"
                    >
                      <LogOut size={24} />
                    </button>
                  </div>
                </div>
                
                {showNotifications && (
                   <div className="mt-4 bg-zinc-900/50 rounded-2xl border border-white/5 max-h-[30vh] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-xs text-zinc-600">No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map((n, i) => (
                          <div key={i} className="p-4 border-b border-white/5">
                            <p className="text-xs font-bold text-white">{n.title}</p>
                            <p className="text-[10px] text-zinc-500">{n.message}</p>
                          </div>
                        ))
                      )}
                   </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-center py-4 bg-orange-500 rounded-2xl font-black uppercase tracking-widest text-white"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};

export default NavBar;