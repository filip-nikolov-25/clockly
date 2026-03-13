import React, { useState } from "react";
import type { InputGroupTypes, UserType } from "../interfaces/types";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Lock,
  Globe,
  Building2,
  Key,
  ShieldCheck,
  UserCircle,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

interface Props {
  user?: UserType | null;
  setUser: (user: UserType | null) => void;
}

const Register = ({ setUser }: Props) => {
      const API_URL = import.meta.env.VITE_API_URL;

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
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRoleToggle = () => {
    const newRole = userInfo.role === "admin" ? "employee" : "admin";
    setUserInfo({ ...userInfo, role: newRole, company_id: "", code: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        userInfo,
      );
      setUser(response.data.user);
      navigate("/calendar");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Registration failed. Please check your details.",
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 selection:bg-orange-500/30">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        
        {/* Go Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 z-10 flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-zinc-900 to-black border-r border-zinc-800">
          <div>
            <div className="text-orange-500 font-black text-2xl mb-12">Clockly.</div>
            <h2 className="text-5xl font-black leading-tight mb-6">
              Start tracking <br />
              <span className="text-zinc-500 italic">in seconds.</span>
            </h2>
            <div className="space-y-6">
              <BenefitItem text="Role-based dashboard access" />
              <BenefitItem text="Real-time shift analytics" />
              <BenefitItem text="Automated leave management" />
            </div>
          </div>
          <div className="p-6 bg-zinc-800/50 rounded-3xl border border-zinc-700/50">
            <p className="text-zinc-400 text-sm leading-relaxed italic">
              "Clockly can completely transform how you manage your distributed team's hours."
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-zinc-500">Join the workforce operating system.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-black/40 p-1.5 rounded-2xl border border-zinc-800 flex mb-6">
              <button
                type="button"
                onClick={() => userInfo.role !== 'employee' && handleRoleToggle()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${userInfo.role === 'employee' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <UserCircle size={18} /> Employee
              </button>
              <button
                type="button"
                onClick={() => userInfo.role !== 'admin' && handleRoleToggle()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${userInfo.role === 'admin' ? 'bg-orange-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <ShieldCheck size={18} /> Administrator
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup 
                icon={<User size={18}/>} 
                label="Full Name" 
                placeholder="John Doe" 
                value={userInfo.username || ""}
                onChange={(v) => setUserInfo({...userInfo, username: v})}
              />
              <InputGroup 
                icon={<Mail size={18}/>} 
                label="Email" 
                type="email" 
                placeholder="john@example.com" 
                value={userInfo.email || ""}
                onChange={(v) => setUserInfo({...userInfo, email: v})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Country</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors">
                    <Globe size={18} />
                  </div>
                  <select
                    value={userInfo.country_code || ""}
                    onChange={(e) => setUserInfo({ ...userInfo, country_code: e.target.value })}
                    className="w-full bg-zinc-800/50 text-white pl-12 pr-4 py-3 rounded-2xl border border-zinc-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all appearance-none"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="CH">Switzerland</option>
                    <option value="MK">North Macedonia</option>
                    <option value="DE">Germany</option>
                  </select>
                </div>
              </div>

              <InputGroup 
                icon={<Lock size={18}/>} 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                value={userInfo.password || ""}
                onChange={(v) => setUserInfo({...userInfo, password: v})}
              />
            </div>

            <div className="pt-2">
              {userInfo.role === "admin" ? (
                <InputGroup 
                  icon={<Building2 size={18}/>} 
                  label="Company ID" 
                  placeholder="e.g. CLOCKLY_GLOBAL" 
                  value={userInfo.company_id || ""}
                  onChange={(v) => setUserInfo({...userInfo, company_id: v})}
                />
              ) : (
                <InputGroup 
                  icon={<Key size={18}/>} 
                  label="Invite Code" 
                  placeholder="INV-XXXXXXXXXXXX " 
                  value={userInfo.code || ""}
                  onChange={(v) => setUserInfo({...userInfo, code: v})}
                />
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-700 text-white py-4 rounded-2xl font-bold text-lg shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_10px_25px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 group mt-6"
            >
              {isLoading ? "Creating Account..." : "Complete Registration"}
              {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-8 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ icon, label, type = "text", placeholder, value, onChange }: InputGroupTypes) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full bg-zinc-800/50 text-white pl-12 pr-4 py-3 rounded-2xl border border-zinc-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-zinc-600"
        required
      />
    </div>
  </div>
);

const BenefitItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
      <CheckCircle2 size={16} />
    </div>
    <span className="text-zinc-300 font-medium">{text}</span>
  </div>
);

export default Register;