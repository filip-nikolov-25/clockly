import { Route, Routes, BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import { useEffect, useState } from "react";
import axios from "axios";
import type { CurrentCompanyType, UserType } from "./interfaces/types";
import Admin from "./pages/Admin";
import CalendarPage from "./pages/CalendarPage";
import AboutMe from "./pages/AboutMe";
import TimeManagment from "./pages/TimeManagment";

const App = () => {
  axios.defaults.withCredentials = true;
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentCompany, setCurrentCompany] = useState('');

  console.log(currentCompany,"CURENT COMPANY")
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me");
        setUser(response.data);
      } catch (err: any) {
        setUser(null);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCurrentCompany = async () => {
      const res = await axios.get("http://localhost:5000/api/current-company");
      setCurrentCompany(res.data.name);
    };
    fetchCurrentCompany();
  }, [user]);
  if (loading)
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <BrowserRouter>
      <NavBar
        user={user}
        setUser={setUser}
        currentCompany={currentCompany}
        setCurrentCompany={setCurrentCompany}
      />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/login"
          element={<Login user={user} setCurrentCompany={setCurrentCompany} setUser={setUser} />}
        />
        <Route
          path="/register"
          element={<Register user={user} setUser={setUser} />}
        />
        <Route path="/admin" element={<Admin user={user} />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route
          path="/employees"
          element={<div className="text-white p-10">Employees Page</div>}
        />
        <Route path="/aboutme" element={<AboutMe user={user} />} />
        <Route path="/time" element={<TimeManagment />} />
        <Route
          path="*"
          element={<div className="text-white p-10">NOT FOUND PAGE</div>}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
