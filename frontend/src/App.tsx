import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { UserType } from "./interfaces/types";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import Admin from "./pages/Admin";
import CalendarPage from "./pages/CalendarPage";
import AboutMe from "./pages/AboutMe";
import TimeManagment from "./pages/TimeManagment";
import EmployeePage from "./pages/EmployeePage";
import ProtectedRoute from "./components/ProtectedRoutes";
import Spinner from "./components/Spinner";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

axios.defaults.withCredentials = true;

interface AppContentProps {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  currentCompany: string;
  setCurrentCompany: React.Dispatch<React.SetStateAction<string>>;
}

const AppContent = ({
  user,
  setUser,
  currentCompany,
  setCurrentCompany,
}: AppContentProps) => {
  const location = useLocation();
    const hideNavBarPaths = ["/", "/login", "/register"];
  const shouldShowNavBar = !hideNavBarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavBar && (
        <NavBar
          user={user}
          setUser={setUser}
          currentCompany={currentCompany}
          setCurrentCompany={setCurrentCompany}
        />
      )}


      <Routes>
        <Route path="/" element={<Homepage user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route
            path="/admin"
            element={<Admin user={user} setUser={setUser} />}
          />
          <Route
            path="/calendar"
            element={<CalendarPage setUser={setUser} user={user} />}
          />
          <Route
            path="/employees"
            element={
              <EmployeePage currentCompany={currentCompany} user={user} />
            }
          />
          <Route path="/aboutme" element={<AboutMe user={user} />} />
          <Route path="/time" element={<TimeManagment />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="text-white p-10 text-center">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCompany, setCurrentCompany] = useState("");
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`);
      setUser(response.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const fetchCurrentCompany = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/current-company`);
        setCurrentCompany(res.data.name);
      } catch (err) {
        console.error("Error fetching company:", err);
      }
    };

    if (user) {
      fetchCurrentCompany();
    }
  }, [user, API_URL]);

  if (loading) return <Spinner />;

  return (
    <BrowserRouter>
      <AppContent
        user={user}
        setUser={setUser}
        currentCompany={currentCompany}
        setCurrentCompany={setCurrentCompany}
      />
    </BrowserRouter>
  );
};

export default App;