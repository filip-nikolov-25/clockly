import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
        <Route path="/" element={<Homepage />} />
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
  axios.defaults.withCredentials = true;
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCompany, setCurrentCompany] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me");
        setUser(response.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCurrentCompany = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/current-company",
        );
        setCurrentCompany(res.data.name);
      } catch (err) {
        console.error("Error fetching company:", err);
      }
    };
    if (user) fetchCurrentCompany();
  }, [user]);

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
