import { useState } from "react";
import { formatMinutesToHoursAndMinutes } from "../helperFunctions";
import type { AllEmployeeType, UserType } from "../interfaces/types";
import { Mail, MapPin, Shield, Clock, PlusCircle, CheckCircle2 } from "lucide-react";

interface Props {
  employee: AllEmployeeType;
  user: UserType | null;
  updateEmployeeFreeDays: (user_id: string, free_days: number) => Promise<void> | void;
}

const EmployeeCard = ({ employee, user, updateEmployeeFreeDays }: Props) => {
  const [freeDaysInput, setFreeDaysInput] = useState<number>(employee.free_days);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAdminView = user?.role === "admin";
  const hasChanges = freeDaysInput !== employee.free_days;

  const handleUpdate = async () => {
    if (!hasChanges) return;

    setIsLoading(true);
    try {
      await updateEmployeeFreeDays(employee.user_id, freeDaysInput);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tighter leading-tight">
            {employee.username}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Shield size={12} className={employee.role === "admin" ? "text-rose-500" : "text-zinc-500"} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${employee.role === "admin" ? "text-rose-500" : "text-zinc-500"}`}>
              {employee.role}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-orange-500 font-bold">
          {employee.username.slice(0, 2).toUpperCase()}
        </div>
      </div>

      <div className="space-y-3 mb-6 relative z-10">
        <div className="flex items-center gap-3 text-zinc-400">
          <Clock size={16} className="text-orange-500/70" />
          <p className="text-sm font-medium">
            Month: <span className="text-white font-bold">{formatMinutesToHoursAndMinutes(employee.worked_minutes)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          <Mail size={16} />
          <p className="text-xs truncate">{employee.email}</p>
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          <MapPin size={16} />
          <p className="text-xs font-bold uppercase tracking-tighter">{employee.country_code}</p>
        </div>
      </div>

      {isAdminView && (
        <div className="pt-4 border-t border-zinc-800 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Remaining Free Days
            </label>
            {isSuccess && (
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                <CheckCircle2 size={12} /> Updated
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              onChange={(e) => setFreeDaysInput(Number(e.target.value))}
              value={freeDaysInput}
              disabled={isLoading}
              className={`w-20 bg-black/40 border rounded-xl px-3 py-2 text-sm text-white outline-none transition-all ${
                hasChanges ? "border-orange-500/50" : "border-zinc-800"
              }`}
            />
            <button
              onClick={handleUpdate}
              disabled={isLoading || !hasChanges}
              className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2 px-4 rounded-xl transition-all active:scale-95 ${
                isSuccess 
                  ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50" 
                  : "bg-orange-500 hover:bg-orange-600 text-white disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed"
              } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSuccess ? (
                <>Done!</>
              ) : (
                <>
                  <PlusCircle size={14} /> Update
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;