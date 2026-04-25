import {
  useState,
  useEffect,
  type FormEvent,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useRef,
} from "react";
import type { TimeOffRequest, UserType } from "../interfaces/types";
import axios from "axios";
import Wrapper from "../components/base/Wrapper";
import { formatDateDisplay } from "../helperFunctions";
import {
  Ticket,
  CheckCircle2,
  XCircle,
  Clock3,
  UserPlus,
  FilterX,
  Calendar,
  Search,
  ChevronRight,
  SearchCheck,
  AlertCircle,
} from "lucide-react";
import ReasonToggle from "../components/ReasonToggle";

interface Props {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
}

const Admin = ({ user, setUser }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [inviteCodes, setInviteCodes] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [count, setCount] = useState(0);
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [limit] = useState(6);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [employees, setEmployees] = useState<
    { id: string; username: string; role: string }[]
  >([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);

  const fetchInviteCodes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/all-invitecodes`);
      setInviteCodes(res.data.codes);
    } catch (error) {
      console.error("Error getting all inv codes:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchRequests = async (newOffset: number) => {
    if (loadingRequests) return;
    setLoadingRequests(true);
    try {
      const res = await axios.get(`${API_URL}/api/request-leave/admin`, {
        params: {
          limit,
          offset: newOffset,
          employee: selectedEmployee || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });
      setRequests((prev) =>
        newOffset === 0 ? res.data : [...prev, ...res.data],
      );
      setHasMore(res.data.length === limit);
    } catch (err) {
      console.error("Error fetching admin requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleApplyFilters = () => {
    if ((startDate && !endDate) || (!startDate && endDate)) {
      setWarningMessage("Please select both Start and End dates.");
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      setWarningMessage("Start date cannot be after end date.");
    } else {
      setWarningMessage("");
    }

    setOffset(0);
    fetchRequests(0);
  };

  const loadMore = useCallback(() => {
    if (loadingRequests || !hasMore) return;
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchRequests(newOffset);
  }, [
    loadingRequests,
    hasMore,
    offset,
    limit,
    selectedEmployee,
    startDate,
    endDate,
  ]);
  const resetFilters = () => {
    setSelectedEmployee("");
    setStartDate("");
    setEndDate("");
    setOffset(0);
    setHasMore(true);
    setWarningMessage("");
    setTimeout(() => fetchRequests(0), 0);
  };

  const handleSubmitInvite = async (e: FormEvent) => {
    e.preventDefault();
    if (inviteCodes.length > 0) {
      setErrorMessage(`Existing codes present. Please distribute them first.`);
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/sendinvite`, { count });
      setInviteCodes(response.data.codes);
      setErrorMessage("");
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to create codes");
    }
  };

  const updateRequestStatus = async (
    id: string,
    status: "accepted" | "rejected",
  ) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/update-leave-status/admin/${id}`,
        { status },
      );
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: res.data.status } : r)),
      );
      setUser((prev: UserType | null): UserType | null => {
        if (!prev) return null;
        return {
          ...prev,
          free_days: Number(res.data.free_days),
        };
      });
    } catch (err) {
      console.error("Error updating request status:", err);
    }
  };

  useEffect(() => {
    fetchInviteCodes();
    fetchEmployees();
    fetchRequests(0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingRequests || !hasMore) return;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;
      if (scrollY + windowHeight >= fullHeight - 200) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore, loadingRequests, hasMore]);

  return (
    <Wrapper>
      <div className="py-12 md:py-20 max-w-7xl mx-auto px-4">
        <div className="mb-16 relative">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full -z-10" />
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
            Admin
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
              Console
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-px w-12 bg-zinc-800" />
            <p className="text-zinc-400 font-medium tracking-wide">
              Logged in as{" "}
              <span className="text-white font-bold">{user?.username}</span>
            </p>
          </div>
          {errorMessage && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl inline-flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <XCircle className="text-red-500" size={18} />
              <p className="text-red-500 text-sm font-semibold">
                {errorMessage}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <UserPlus size={80} className="text-white" />
            </div>

            <div className="relative z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <UserPlus className="text-orange-500" size={20} />
                </div>
                Invitations
              </h2>

              <form onSubmit={handleSubmitInvite} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3 block ml-1">
                    Number of Codes
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 px-5 text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all placeholder:text-zinc-700"
                    placeholder="0"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-orange-500 hover:text-white font-black py-4 px-8 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-white/5"
                >
                  Generate Access
                </button>
              </form>

              {inviteCodes.length > 0 && (
                <div className="mt-8 pt-8 border-t border-zinc-800/50">
                  <h3 className="text-xs font-bold text-zinc-400 mb-4 flex items-center gap-2">
                    <Ticket size={14} className="text-orange-500" /> ACTIVE
                    BATCH
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {inviteCodes.map((code, i) => (
                      <div
                        key={i}
                        className="font-mono text-[10px] bg-black/40 px-3 py-3 rounded-xl text-orange-400 border border-zinc-800/50 text-center hover:border-orange-500/30 transition-colors"
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-zinc-800/50 rounded-lg">
                  <Search className="text-zinc-400" size={20} />
                </div>
                Filter Engine
              </h2>
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-orange-500 transition-colors"
              >
                <FilterX size={14} /> Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-4 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                  Staff Member
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-3.5 px-4 text-sm text-white focus:border-orange-500/50 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.username}>
                      {emp.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-6 grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    Start
                  </label>
                  <div
                    className="relative"
                    onClick={() => startDateRef.current?.showPicker?.()}
                  >
                    <input
                      ref={startDateRef}
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-zinc-950/50 cursor-pointer border border-zinc-800 rounded-2xl py-3.5 px-4 text-xs text-white focus:border-orange-500/50 outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    End
                  </label>
                  <div
                    className="relative"
                    onClick={() => endDateRef.current?.showPicker?.()}
                  >
                    <input
                      ref={endDateRef}
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-zinc-950/50 cursor-pointer border border-zinc-800 rounded-2xl py-3.5 px-4 text-xs text-white focus:border-orange-500/50 outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={handleApplyFilters}
                  className="w-full h-13 bg-orange-500 hover:bg-orange-400 text-black rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                >
                  <SearchCheck size={22} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {warningMessage && (
              <div className="absolute -bottom-4 left-8 right-8 bg-orange-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 animate-bounce z-20 shadow-xl">
                <AlertCircle size={14} />
                {warningMessage}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">
              Leave Requests
            </h2>
            <div className="h-0.5 flex-1 bg-linear-to-r from-zinc-800 to-transparent" />
          </div>

          {requests.length > 0 ? (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="group relative bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/50 p-8 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/5"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 bg-zinc-800/50 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-orange-400 transition-colors">
                      {request.leave_type}
                    </span>
                    {request.status === "pending" ? (
                      <div className="p-2 bg-yellow-500/10 rounded-xl">
                        <Clock3 className="text-yellow-500" size={18} />
                      </div>
                    ) : request.status === "accepted" ? (
                      <div className="p-2 bg-emerald-500/10 rounded-xl">
                        <CheckCircle2 className="text-emerald-500" size={18} />
                      </div>
                    ) : (
                      <div className="p-2 bg-red-500/10 rounded-xl">
                        <XCircle className="text-red-500" size={18} />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white group-hover:text-orange-100 transition-colors">
                      {request.username}
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium">
                      {request.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 mb-8">
                    <Calendar size={14} className="text-zinc-700" />
                    <span>{formatDateDisplay(request.start_date)}</span>
                    <ChevronRight size={12} className="text-zinc-800" />
                    <span>{formatDateDisplay(request.end_date)}</span>
                  </div>

                  <div className="rounded-2xl p-4 mb-6 ">
                    <ReasonToggle
                      reason={request.reason || "No reason provided"}
                    />
                  </div>

                  {request.status === "pending" && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          updateRequestStatus(request.id!, "accepted")
                        }
                        className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white py-3.5 rounded-2xl text-xs font-black transition-all active:scale-95"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateRequestStatus(request.id!, "rejected")
                        }
                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white py-3.5 rounded-2xl text-xs font-black transition-all active:scale-95"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !loadingRequests && (
              <div className="text-center py-32 bg-zinc-900/10 border-2 border-dashed border-zinc-800/50 rounded-[3.5rem]">
                <FilterX size={48} className="text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">
                  No requests matched your filters
                </p>
              </div>
            )
          )}

          {loadingRequests && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-zinc-500 font-bold text-sm tracking-widest uppercase">
                Syncing Data...
              </p>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Admin;
