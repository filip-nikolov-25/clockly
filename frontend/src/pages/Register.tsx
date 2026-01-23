import React, { useState } from "react";
import type { userType } from "../interfaces/types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface props {
  user?: userType | null;
  setUser: (user: userType | null) => void;
}

const Register = ({ setUser, user }: props) => {
  const [userInfo, setUserInfo] = useState<userType>({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userInfo,
      );
      setUser(response.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      console.error(err);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-10 max-w-md w-full">
        <h2 className="text-center mb-2 text-4xl font-extrabold text-white">
          Get in Touch
        </h2>
        <p className="text-center mb-8 text-gray-400">We're here to help.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-300 mb-1 font-medium"
            >
              Name
            </label>
            <input
              type="text"
              id="username"
              value={userInfo.username}
              placeholder="Your Name"
              onChange={(e) =>
                setUserInfo({ ...userInfo, username: e.target.value })
              }
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              required
            />
          </div>
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
            Register
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <span className="text-indigo-500 hover:underline cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
