import React, { useState } from "react";
import type { LoginType, UserType } from "../interfaces/types";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, LogIn, Sparkles } from "lucide-react";

interface Props {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  setCurrentCompany: (companyName: string) => void;
}

const Login = ({ setUser }: Props) => {
  const [userInfo, setUserInfo] = useState<LoginType>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        userInfo
      );
      setUser(response.data.user);
      navigate("/calendar");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 selection:bg-orange-500/30">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-112.5 relative">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-orange-500 shadow-2xl">
            <LogIn size={32} />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-zinc-500 text-sm">Log in to manage your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={userInfo.email}
                  placeholder="name@company.com"
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="w-full bg-zinc-800/50 text-white pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-zinc-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Password</label>
                <button type="button" className="text-[10px] font-bold text-orange-500 hover:text-orange-400 uppercase tracking-tighter">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={userInfo.password}
                  placeholder="••••••••"
                  onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                  className="w-full bg-zinc-800/50 text-white pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-zinc-600"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-4 rounded-2xl font-bold text-lg shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_10px_25px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </span>
              <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-zinc-800/50 text-center">
            <p className="text-zinc-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-orange-500 font-bold hover:text-orange-400 transition-colors inline-flex items-center gap-1 group">
                Register <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-zinc-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
          Secured by Enterprise Grade Encryption
        </p>
      </div>
    </div>
  );
};

export default Login;