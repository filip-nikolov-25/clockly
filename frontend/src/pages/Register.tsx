import React, { useState } from "react";
import type { UserType } from "../interfaces/types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  user?: UserType | null;
  setUser: (user: UserType | null) => void;
}

const Register = ({ setUser }: Props) => {
  const [userInfo, setUserInfo] = useState<Partial<UserType>>({
    username: "",
    email: "",
    password: "",
    company_id: "",
    role: "employee",
    religion: "",
    code: "",
    country_code: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRoleToggle = () => {
    const newRole = userInfo.role === "admin" ? "employee" : "admin";
    setUserInfo({ ...userInfo, role: newRole });
  };

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

  console.log(userInfo, "user sasd");

  return (
    <div className="flex justify-center items-center pt-20 pb-20 bg-linear-to-b from-black via-gray-700 to-orange-300 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-10 max-w-md w-full">
        <h2 className="text-center mb-2 text-4xl font-extrabold text-white">
          Get in Touch
        </h2>
        <p className="text-center mb-8 text-gray-400">We're here to help.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1 font-medium">Name</label>
            <input
              type="text"
              value={userInfo.username}
              placeholder="Your Name"
              onChange={(e) =>
                setUserInfo({ ...userInfo, username: e.target.value })
              }
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              value={userInfo.email}
              placeholder="you@example.com"
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1 font-medium">
              Country
            </label>
            <select
              value={userInfo.country_code}
              onChange={(e) =>
                setUserInfo({ ...userInfo, country_code: e.target.value })
              }
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              required
            >
              <option value="">Select your country</option>
              {[
                { name: "Switzerland", code: "CH" },
                { name: "North Macedonia", code: "MK" },
                { name: "Germany", code: "DE" },
              ].map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              value={userInfo.password}
              placeholder="Enter Password"
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              required
            />
          </div>

          <div className=" flex items-center justify-end gap-3">
            <span className="text-white font-medium">
              Role: {userInfo.role}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={userInfo.role === "admin"}
                onChange={handleRoleToggle}
              />
              <div className="w-14 h-7 bg-gray-700 rounded-full peer-focus:ring-2 peer-focus:ring-orange-500 peer-checked:bg-orange-600 transition-all duration-200"></div>
              <div
                className={`absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow transform transition-all duration-200 ${
                  userInfo.role === "admin"
                    ? "translate-x-full"
                    : "translate-x-0"
                }`}
              ></div>
            </label>
          </div>

          <div className="mb-6">
            {userInfo.role === "admin" ? (
              <>
                <label className="block text-gray-300 mb-1 font-medium">
                  Company ID
                </label>
                <input
                  type="text"
                  value={userInfo.company_id}
                  placeholder="Company ID"
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, company_id: e.target.value })
                  }
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  required
                />
              </>
            ) : (
              <>
                <label className="block text-gray-300 mb-1 font-medium">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={userInfo.code}
                  placeholder="Invite Code"
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, code: e.target.value })
                  }
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  required
                />
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-300 shadow-md hover:shadow-lg transition-all"
          >
            Register
          </button>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <span className="text-orange-500 hover:underline hover:text-orange-300 cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
