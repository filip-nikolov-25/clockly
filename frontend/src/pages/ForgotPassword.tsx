import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
      const API_URL = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-zinc-500 text-sm mb-8">Enter your email and we'll send you a reset link.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full bg-zinc-800/50 pl-4 py-3.5 rounded-2xl border border-zinc-800 focus:border-orange-500 outline-none"
            required
          />
          <button 
            disabled={isLoading}
            className="w-full bg-orange-500 py-4 rounded-2xl font-bold hover:bg-orange-400 transition-all"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-zinc-400">{message}</p>}
        
        <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-zinc-500 text-sm hover:text-white">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;