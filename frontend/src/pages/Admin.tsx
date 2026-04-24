import {
  useState,
  useEffect,
  type FormEvent,
  type Dispatch,
  type SetStateAction,
  useCallback,
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

  const fetchInviteCodes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/all-invitecodes`);
      setInviteCodes(res.data.codes);
    } catch (error) {
      console.error("Error getting all inv codes:", error);
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

  const loadMore = useCallback(() => {
    if (loadingRequests || !hasMore) return;

    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchRequests(newOffset);
  }, [loadingRequests, hasMore, offset, limit]);
  const resetFilters = () => {
    setSelectedEmployee("");
    setStartDate("");
    setEndDate("");
    setOffset(0);
    setHasMore(true);
  };

  useEffect(() => {
    fetchInviteCodes();
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

  const handleSubmit = async (e: FormEvent) => {
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

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setOffset(0);
    fetchRequests(0);
  }, [selectedEmployee, startDate, endDate]);

  return (
    <Wrapper>
      <div className="py-16">
        <div className="mb-12">
          <h1 className="text-6xl font-black text-white tracking-tighter">
            Admin <span className="text-orange-500">Console</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">
            Managing workforce operations for {user?.username}
          </p>
          {errorMessage && (
            <p className="text-red-500 mt-4 font-bold">{errorMessage}</p>
          )}
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-4xl p-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="text-orange-500" />
            <h2 className="text-xl font-bold text-white">
              Generate Access Invitations
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">
                Number of Codes
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-white focus:border-orange-500/50 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-2xl transition-all active:scale-95"
            >
              Generate
            </button>
          </form>

          {inviteCodes.length > 0 && (
            <div className="mt-8 bg-black/40 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-2">
                <Ticket size={16} /> Active Invite Codes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {inviteCodes.map((code, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs bg-zinc-900 px-3 py-2 rounded-lg text-orange-400 border border-zinc-800 text-center"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-3xl mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter">
                Absence Requests
              </h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
                Management Portal
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">
                  Employee
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => {
                    setSelectedEmployee(e.target.value);
                    setOffset(0);
                  }}
                  className="bg-black border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-white focus:border-orange-500/50 outline-none transition-all"
                >
                  <option value="">All Employees</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.username}>
                      {employee.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">
                  Start Date
                </label>
                <div className="relative group">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors pointer-events-none z-10"
                    size={14}
                  />
                  <input
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setOffset(0);
                    }}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-orange-500/50 outline-none transition-all 
                    relative z-0
                    [&::-webkit-calendar-picker-indicator]:absolute 
                    [&::-webkit-calendar-picker-indicator]:inset-0 
                    [&::-webkit-calendar-picker-indicator]:w-full 
                    [&::-webkit-calendar-picker-indicator]:h-full 
                    [&::-webkit-calendar-picker-indicator]:bg-transparent 
                    [&::-webkit-calendar-picker-indicator]:text-transparent 
                  [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">
                  End Date
                </label>
                <div className="relative group">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors pointer-events-none z-10"
                    size={14}
                  />
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setOffset(0);
                    }}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-orange-500/50 outline-none transition-all 
      relative z-0
      [&::-webkit-calendar-picker-indicator]:absolute 
      [&::-webkit-calendar-picker-indicator]:inset-0 
      [&::-webkit-calendar-picker-indicator]:w-full 
      [&::-webkit-calendar-picker-indicator]:h-full 
      [&::-webkit-calendar-picker-indicator]:bg-transparent 
      // [&::-webkit-calendar-picker-indicator]:text-transparent 
      [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <div className="flex flex-col justify-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center justify-center gap-2 text-[10px] font-black uppercase bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 px-4 rounded-xl transition-all active:scale-95"
                >
                  <FilterX size={14} /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        {requests.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl group hover:border-zinc-700 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                    {request.leave_type}
                  </span>
                  {request.status === "pending" ? (
                    <Clock3 className="text-yellow-500" size={16} />
                  ) : request.status === "accepted" ? (
                    <CheckCircle2 className="text-emerald-500" size={16} />
                  ) : (
                    <XCircle className="text-red-500" size={16} />
                  )}
                </div>
                <p className="text-lg font-bold text-white">
                  {request.username}
                </p>
                <p className="text-xs text-zinc-500 mb-4">{request.email}</p>
                <div className="text-center">
                  <ReasonToggle reason={request.reason} />
                </div>

                <div className="text-[11px] font-bold text-zinc-400 mb-4">
                  {formatDateDisplay(request.start_date)} —{" "}
                  {formatDateDisplay(request.end_date)}
                </div>

                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateRequestStatus(request.id!, "accepted")
                      }
                      className="flex-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateRequestStatus(request.id!, "rejected")
                      }
                      className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 py-2 rounded-xl text-xs font-bold transition-all"
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
            <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-4xl">
              <p className="text-zinc-500 font-medium">
                No requests match your current filters.
              </p>
            </div>
          )
        )}

        {loadingRequests && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Clock3 size={32} className="text-orange-500 animate-spin" />
            <p className="text-zinc-500 font-medium">
              Loading More Requests...
            </p>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Admin;
