import { useState } from "react";
import type { LoginType, userType } from "../interfaces/types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface props {
  user: userType | null;
  setUser: (user: userType | null) => void;
}

const Login = ({ setUser }: props) => {
  const [userInfo, setUserInfo] = useState<LoginType>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        userInfo,
      );
      setUser(response.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-orange-950 via-black to-gray-800 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-10 max-w-md w-full">
        <h2 className="text-center mb-2 text-4xl font-extrabold text-white">
          Welcome Back
        </h2>
        <p className="text-center mb-8 text-gray-400">
          Please login to your account
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-300 mb-1 font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={userInfo.email}
              placeholder="you@example.com"
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-300 mb-1 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={userInfo.password}
              placeholder="Enter Password"
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              required
            />
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-500 shadow-md hover:shadow-lg transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <span className="text-indigo-500 hover:underline cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
