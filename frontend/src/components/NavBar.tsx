import { useState, useEffect } from "react";
import type { UserType } from "../interfaces/types";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Bell, LogOut, ShieldCheck, User as UserIcon, Calendar, Briefcase, Clock, Menu, X } from "lucide-react";

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

const NavBar = ({ user, setUser, currentCompany, setCurrentCompany }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const url = user.role === "admin" ? "http://localhost:5000/api/admin-notifications" : "http://localhost:5000/api/notifications";
        const res = await axios.get(url);
        setNotifications(res.data);
      } catch (err) { console.error("Failed to fetch notifications:", err); }
    };
    fetchNotifications();
  }, [user]);

  const updateNotificationStatus = async () => {
    try {
      await axios.patch(user?.role === "admin" ? "http://localhost:5000/api/admin-notifications/read" : "http://localhost:5000/api/notifications/read");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) { console.error(error); }
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
    if (showNotifications && unreadCount > 0) updateNotificationStatus();
  }, [showNotifications]);

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
          
          <Link to={currentCompany ? "/calendar" : "/"} className="flex items-center gap-3">
            {currentCompany ? (
                <span className="text-orange-500 border border-orange-500/30 bg-orange-500/5 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-[0.2em]">
                    {currentCompany}
                </span>
            ) : (
                <img src="/img/LOGO-1.png" alt="Logo" className="h-10 w-auto rounded-xl border border-white/10" />
            )}
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {!currentCompany && <Link to="/" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Home</Link>}
            
            {user && navLinks.map(link => (
                <Link key={link.path} to={link.path} className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${location.pathname === link.path ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                    {link.name}
                </Link>
            ))}

            {user && (
                <>
                    <div className="w-px h-4 bg-zinc-800" />
                    {user.role === "admin" && (
                        <Link to="/admin" className="text-emerald-500 hover:text-emerald-400"><ShieldCheck size={20} /></Link>
                    )}
                    
                    <div className="relative mt-2">
                        <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-zinc-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute right-0 mt-4 w-80 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4">
                                <div className="p-4 border-b border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">Notifications</div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? <p className="p-6 text-center text-xs text-zinc-600">No new alerts</p> : 
                                    notifications.map((n, i) => (
                                        <div key={i} className="p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer">
                                            <p className="text-xs font-bold text-white">{n.title}</p>
                                            <p className="text-[10px] text-zinc-500 mt-1">{n.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={handleLogout} className="text-zinc-500 hover:text-red-500 transition-colors">
                        <LogOut size={20} />
                    </button>
                </>
            )}

            {!user && (
                <div className="flex gap-4">
                    <Link to="/login" className="text-xs font-black uppercase tracking-widest text-white">Login</Link>
                </div>
            )}
          </ul>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;