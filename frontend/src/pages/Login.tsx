import { useState } from "react";
import type { LoginType, UserType } from "../interfaces/types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface props {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  setCurrentCompany: (companyName: string) => void;
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
      navigate("/calendar");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="flex justify-center items-center pb-72 pt-28 bg-linear-to-b  from-black via-gray-700 to-orange-300
 p-4"
    >
      <div className="bg-gray-900 border border-gray-700 mt-[-25] rounded-xl shadow-xl p-10 max-w-md w-full">
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
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
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
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              required
            />
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-300 shadow-md hover:shadow-lg transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <span className="text-orange-500 hover:underline hover:text-orange-300 cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
