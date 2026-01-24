import { Route, Routes, BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import { useEffect, useState } from "react";
import axios from "axios";
import type { userType } from "./interfaces/types";
import Admin from "./pages/Admin";

const App = () => {
  axios.defaults.withCredentials = true;
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("Current User in App ROLE:", user?.role);
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
  if (loading)
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <BrowserRouter>
      <NavBar user={user} setUser={setUser} />

      <Routes>
        <Route
          path="/"
          element={<Homepage error={error} setError={setError} user={user} />}
        />
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />
        <Route
          path="/register"
          element={<Register user={user} setUser={setUser} />}
        />
        <Route
          path="/admin"
          element={<Admin user={user} />}
        />
        <Route
          path="*"
          element={<div className="text-white p-10">NOT FOUND PAGE</div>}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
