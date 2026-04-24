import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Info,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { UserType } from "../interfaces/types";
import ButtonWithLoadingState from "./base/ButtonWithLoadingState";

interface Props {
  onClose: () => void;
  onSubmitted?: () => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

const TimeOffRequestForm = ({ onClose, onSubmitted, user }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dateError, setDateError] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const requestedDays = useMemo(() => {
    if (!leaveStart || !leaveEnd) return 0;
    const start = new Date(leaveStart);
    const end = new Date(leaveEnd);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [leaveStart, leaveEnd]);

  const handleDateFocus = () => {
    if (!leaveType) {
      setErrorMessage("Please select type of absence first!");
    }
  };
  const handleSubmit = async () => {
    if (dateError && leaveType !== "Sick Leave") return;
    if (leaveType === "Sick Leave") {
      setSuccessMessage("");
    } else if (user?.free_days === 0) {
      setErrorMessage("You don't have any free days left!");
      return;
    }

    if (
      !leaveType ||
      (leaveType !== "Sick Leave" && (!leaveStart || !leaveEnd))
    ) {
      setErrorMessage("Please fill all required fields!");
      return;
    }

    if (leaveType !== "Sick Leave" && requestedDays > (user?.free_days || 0)) {
      setErrorMessage(`Insufficient balance (${user?.free_days} days left).`);
      return;
    }
    setErrorMessage("");

    try {
      const { data } = await axios.get(`${API_URL}/api/abscence-availability`);
      if (data.userRequestedAbscence) {
        setErrorMessage("You already have an active absence request.");
        setLoading(false);
        return;
      }
      setLoading(true);
      await axios.post(`${API_URL}/api/request-leave`, {
        start_date: leaveStart,
        end_date: leaveEnd,
        leave_type: leaveType,
        reason,
      });

      setSuccessMessage("Request submitted successfully!");
      if (onSubmitted) onSubmitted();
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Error submitting request.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDateError("");
    setErrorMessage("");
    setLeaveStart("");
    setLeaveEnd("");
  }, [leaveType]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
              <Clock size={20} />
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">
              Request Absence
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-3">
              <Info size={18} className="text-zinc-500" />
              <span className="text-zinc-400 text-sm">Available Off Days</span>
            </div>
            <span className="text-white font-black text-lg">
              {user?.free_days || 0} Days
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              Type of Absence
            </label>
            <select
              value={leaveType}
              onChange={(e) => {
                if (e.target.value === "Sick Leave") {
                  setSuccessMessage(
                    " NOTE* Sick Leave does not require free days.",
                  );
                } else {
                  setSuccessMessage("");
                }
                setLeaveType(e.target.value);
              }}
              className="w-full bg-zinc-800/50 text-white px-4 py-3 rounded-2xl border border-zinc-800 focus:border-orange-500 outline-none transition-all"
            >
              <option value="" disabled>
                Choose category...
              </option>
              <option value="Vacation">🌴 Vacation</option>
              <option value="Sick Leave">🤒 Sick Leave</option>
              <option value="Personal">🏠 Personal</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                Start Date
              </label>
              <div className="relative group">
                <Calendar
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors pointer-events-none"
                />
                <input
                  type="date"
                  value={leaveStart}
                  onFocus={handleDateFocus}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLeaveStart(value);

                    setErrorMessage("");

                    if (leaveType === "Sick Leave") {
                      setDateError("");
                      return;
                    }

                    if (leaveEnd && new Date(value) > new Date(leaveEnd)) {
                      setDateError("Start date cannot be after end date!");
                    } else {
                      setDateError("");
                    }
                  }}
                  min={leaveType === "Sick Leave" ? undefined : todayStr}
                  className="w-full bg-zinc-800/50 text-white pl-10 pr-4 py-3 rounded-2xl border border-zinc-800 focus:border-orange-500 outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                End Date
              </label>
              <div className="relative group">
                <Calendar
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors pointer-events-none"
                />
                <input
                  type="date"
                  value={leaveEnd}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLeaveEnd(value);
                    setErrorMessage("");
                    if (leaveType === "Sick Leave") {
                      setDateError("");
                      return;
                    }

                    if (leaveStart && new Date(value) < new Date(leaveStart)) {
                      setDateError("End date cannot be before start date!");
                    } else {
                      setDateError("");
                    }
                  }}
                  onFocus={handleDateFocus}
                  min={
                    leaveType === "Sick Leave"
                      ? undefined
                      : leaveStart || todayStr
                  }
                  className="w-full bg-zinc-800/50 text-white pl-10 pr-4 py-3 rounded-2xl border border-zinc-800 focus:border-orange-500 outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>
            </div>
          </div>
          {requestedDays > 0 && (
            <div className="space-y-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase w-fit tracking-wider
      ${
        requestedDays > (user?.free_days || 0)
          ? "bg-red-500/10 text-red-500"
          : "bg-emerald-500/10 text-emerald-500"
      }`}
              >
                <CheckCircle2 size={12} />
                Total: {requestedDays} {requestedDays === 1 ? "Day" : "Days"}
              </div>

              {leaveType !== "Sick Leave" &&
                requestedDays > (user?.free_days || 0) && (
                  <div className="flex items-center gap-2 text-[10px] text-red-400 font-medium">
                    <AlertCircle size={12} />
                    Insufficient balance ({user?.free_days || 0} days available)
                  </div>
                )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              Notes (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide additional details..."
              className="w-full bg-zinc-800/50 text-white px-4 py-3 rounded-2xl border border-zinc-800 focus:border-orange-500 outline-none transition-all resize-none min-h-25"
              rows={3}
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}

          {dateError && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {dateError}
            </div>
          )}

          {successMessage &&
            (() => {
              const isSickLeave = successMessage.includes("Sick Leave");
              const Icon = isSickLeave ? Info : CheckCircle2;

              return (
                <div
                  className={`
        flex items-center gap-3 p-4 border rounded-2xl text-xs font-medium animate-in slide-in-from-top-2
        ${
          isSickLeave
            ? "bg-blue-50 text-orange-700 border-blue-200"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        }
      `}
                >
                  <Icon size={16} />
                  {successMessage}
                </div>
              );
            })()}

          <div className="flex justify-between gap-3 pt-4">
            <ButtonWithLoadingState
              buttonText="Discard"
              onClick={onClose}
              variant="secondary"
            />

            <ButtonWithLoadingState
              loading={loading}
              variant="primary"
              buttonText="Submit Request"
              disabled={!!errorMessage || loading}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeOffRequestForm;
