import { useCallback, useEffect, useRef, useState } from "react";
import Wrapper from "../components/base/Wrapper";
import axios from "axios";
import {
  Clock,
  Calendar,
  Coffee,
  Briefcase,
  Plane,
  CheckCircle2,
  Timer,
  FilterX,
  SearchCheck,
  AlertCircle,
} from "lucide-react";
import {
  formatDateDisplay,
  formatMinutesToHoursAndMinutes,
  formatTimeDisplay,
  formatWorkedTime,
  getBreakMinutes,
} from "../helperFunctions";
import type {
  TimeOffRequest,
  UserType,
  WorkEntryType,
} from "../interfaces/types";
import ButtonWithLoadingState from "../components/base/ButtonWithLoadingState";

interface Props {
  user: UserType | null;
}

const AboutMe = ({ user }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);
  const [todayWork, setTodayWork] = useState<WorkEntryType | null>(null);
  const [previousMonthWork, setPreviousMonthWork] = useState<WorkEntryType[]>(
    [],
  );
  const [prevMonthOffSet, setPrevMonthOffSet] = useState(0);
  const [prevMonthCardsLimit] = useState(6);
  const [prevMonthHasMore, setPrevMonthHasMore] = useState(true);
  const [prevMonthLoading, setPrevMonthLoading] = useState(false);

  const [requestTimeOff, setRequestTimeOff] = useState<TimeOffRequest[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    start: "",
    end: "",
  });

  const fetchRequestTimeOff = async (
    newOffset: number,
    filters = appliedFilters,
  ) => {
    if (loading) return;
    setLoading(true);

    try {
      const params = {
        limit,
        offset: newOffset,
        employee: undefined,
        startDate: filters.start || undefined,
        endDate: filters.end || undefined,
      };

      const { data } = await axios.get(
        `${API_URL}/api/employee-leave-requests`,
        { params },
      );

      setRequestTimeOff((prev) =>
        newOffset === 0 ? data : [...prev, ...data],
      );
      setHasMore(data.length === limit);
    } catch (err) {
      console.error("Fetch time off failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousMonthWork = async (newOffset: number) => {
    if (prevMonthLoading) return;
    setPrevMonthLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/work/previous-month`, {
        params: { limit: prevMonthCardsLimit, offset: newOffset },
      });
      setPreviousMonthWork((prev) =>
        newOffset === 0 ? data : [...prev, ...data],
      );
      setPrevMonthHasMore(data.length === prevMonthCardsLimit);
    } catch (err) {
      console.error("Fetch previous month failed", err);
    } finally {
      setPrevMonthLoading(false);
    }
  };

  const handleApplyFilters = () => {
    if ((startDate && !endDate) || (!startDate && endDate)) {
      setWarningMessage("Please select both Start and End dates.");
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      setWarningMessage("Start date cannot be after end date.");
      return;
    }

    setWarningMessage("");
    setOffset(0);
    setAppliedFilters({ start: startDate, end: endDate });
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setWarningMessage("");
    setOffset(0);
    setAppliedFilters({ start: "", end: "" });
  };

  useEffect(() => {
    const fetchTodayWork = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/today`);
        if (!data) return;
        const breakMinutes = getBreakMinutes(data.break_start, data.break_end);
        setTodayWork({
          ...data,
          totalBreak: breakMinutes,
          workedMinutes: Math.max(0, (data.total_minutes ?? 0) - breakMinutes),
        });
      } catch (err) {
        console.error("Fetch today work failed", err);
      }
    };
    fetchTodayWork();
    fetchPreviousMonthWork(0);
  }, []);

  useEffect(() => {
    fetchRequestTimeOff(offset);
  }, [appliedFilters, offset]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setOffset((prev) => prev + limit);
  }, [hasMore, loading, limit]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;
      if (scrollY + windowHeight >= fullHeight - 200) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore, loading, hasMore]);

  const totalPreviousMonthMinutes = previousMonthWork.reduce(
    (sum, entry) => sum + Number(entry.worked_minutes || 0),
    0,
  );
  const workedHours = Math.floor(totalPreviousMonthMinutes / 60);
  const progressPercent = Math.min((workedHours / 160) * 100, 100);
  const workedYearDays = totalPreviousMonthMinutes / (8 * 60);
  const yearDaysProgressPercent = Math.min((workedYearDays / 250) * 100, 100);
  const offDaysPercent = Math.min(((user?.free_days ?? 0) / 24) * 100, 100);

  return (
    <Wrapper>
      <div className="mt-12 mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
            {user?.username}
            <span className="text-orange-500 ml-2">.</span>
          </h1>
          <p className="text-zinc-500 font-medium mt-2 tracking-widest uppercase text-xs">
            Dashboard Overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          icon={<Briefcase size={24} />}
          value={workedYearDays.toFixed(1)}
          label="Year Working Days"
          progress={yearDaysProgressPercent}
          target="250 Days"
          color="blue"
        />
        <StatCard
          icon={<Timer size={24} />}
          value={`${workedHours}h`}
          label="Monthly Capacity"
          progress={progressPercent}
          target="160 Hours"
          color="orange"
        />
        <StatCard
          icon={<Plane size={24} />}
          value={user?.free_days ?? 0}
          label="Available Time Off"
          progress={offDaysPercent}
          target="24 annual days"
          color="emerald"
        />
      </div>

      <h2 className="flex items-center gap-2 text-zinc-400 font-black uppercase tracking-[0.2em] text-xs mb-6">
        <Clock size={14} className="text-orange-500" /> Today's Session
      </h2>
      {todayWork ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-4xl p-8 mb-12 relative overflow-hidden group">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            <TimeStat
              label="Start"
              value={formatTimeDisplay(todayWork.start_time)}
            />
            <TimeStat
              label="End"
              value={
                todayWork.end_time
                  ? formatTimeDisplay(todayWork.end_time)
                  : "--:--"
              }
            />
            <TimeStat
              label="Break"
              value={`${todayWork.totalBreak ?? 0} min`}
              isDimmed
            />
            <TimeStat
              label="Worked"
              value={formatWorkedTime(todayWork.workedMinutes)}
              isHighlight
            />
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Timer size={80} />
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/20 border border-dashed border-zinc-800 rounded-4xl p-10 text-center mb-12">
          <Coffee className="mx-auto text-zinc-700 mb-3" size={32} />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
            No active session
          </p>
        </div>
      )}

      <h2 className="flex items-center gap-2 text-zinc-400 font-black uppercase tracking-[0.2em] text-xs mb-6">
        <Calendar size={14} className="text-blue-500" /> Last Month Activity
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {previousMonthWork.map((entry: any) => (
          <ActivityCard key={entry.id} entry={entry} />
        ))}
      </div>
      <div className="flex justify-center mt-4 mb-12">
        <ButtonWithLoadingState
          loading={prevMonthLoading}
          disabled={!prevMonthHasMore}
          buttonText="+ Load Activity +"
          onClick={() => {
            const next = prevMonthOffSet + prevMonthCardsLimit;
            setPrevMonthOffSet(next);
            fetchPreviousMonthWork(next);
          }}
        />
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-3xl mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter">
              My Absence Requests
            </h2>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
              Personal Filter View
            </p>
          </div>

          <div className="flex flex-col w-full lg:w-auto gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              <DateInput
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                inputRef={startDateRef}
              />
              <DateInput
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                inputRef={endDateRef}
              />

              <div className="flex items-end">
                <button
                  onClick={handleApplyFilters}
                  className="flex items-center justify-center gap-2 text-[10px] font-black uppercase bg-orange-600 hover:bg-orange-500 text-white py-3 px-4 rounded-xl transition-all active:scale-95 w-full h-10"
                >
                  <SearchCheck size={14} /> Apply
                </button>
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center justify-center gap-2 text-[10px] font-black uppercase bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 px-4 rounded-xl transition-all active:scale-95 w-full h-10"
                >
                  <FilterX size={14} /> Reset
                </button>
              </div>
            </div>
            {warningMessage && (
              <p className="text-red-400 text-[10px] font-bold uppercase mt-1 animate-pulse flex items-center gap-1">
                <AlertCircle size={12} /> {warningMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-20">
        {requestTimeOff.length > 0 ? (
          requestTimeOff.map((request, idx) => (
            <TimeOffCard key={idx} request={request} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-zinc-900/10 rounded-4xl border border-dashed border-zinc-800 text-zinc-600 font-black uppercase text-xs tracking-widest">
            No records found for this period
          </div>
        )}
      </div>
    </Wrapper>
  );
};

const StatCard = ({ icon, value, label, progress, target, color }: any) => (
  <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-4xl backdrop-blur-xl">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 bg-${color}-500/10 text-${color}-500 rounded-2xl`}>
        {icon}
      </div>
      <span className="text-2xl font-black text-white">{value}</span>
    </div>
    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">
      {label}
    </p>
    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
      <div
        className={`bg-${color}-500 h-full transition-all duration-1000`}
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-[10px] text-zinc-600 mt-2 font-bold italic">
      Target: {target}
    </p>
  </div>
);

const TimeStat = ({ label, value, isDimmed, isHighlight }: any) => (
  <div>
    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p
      className={`text-xl font-black ${isHighlight ? "text-white" : isDimmed ? "text-zinc-400" : "text-white"}`}
    >
      {value}
    </p>
  </div>
);

const ActivityCard = ({ entry }: any) => (
  <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-800/40 transition-all duration-300">
    <div className="flex justify-between items-center mb-4">
      <span className="text-xs font-black text-zinc-500 uppercase tracking-tighter">
        {formatDateDisplay(entry.work_date)}
      </span>
      <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase">
        {formatWorkedTime(entry.worked_minutes)}
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-[11px] font-bold">
        <span className="text-zinc-600 uppercase">Shift</span>
        <span className="text-zinc-300">
          {formatTimeDisplay(entry.start_time)} -{" "}
          {entry.end_time ? formatTimeDisplay(entry.end_time) : "?"}
        </span>
      </div>
      <div className="flex justify-between text-[11px] font-bold">
        <span className="text-zinc-600 uppercase">Break</span>
        <span className="text-zinc-300">
          {formatMinutesToHoursAndMinutes(entry.break_minutes)}
        </span>
      </div>
    </div>
  </div>
);

const DateInput = ({ label, value, onChange, inputRef }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">
      {label}
    </label>
    <div
      className="relative group"
      onClick={() => inputRef.current?.showPicker?.()}
    >
      <Calendar
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-10"
        size={14}
      />
      <input
        type="date"
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-orange-500/50 outline-none transition-all cursor-pointer"
      />
    </div>
  </div>
);

const TimeOffCard = ({ request }: { request: TimeOffRequest }) => {
  const statusConfig =
    {
      accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      rejected: "bg-red-500/10 text-red-400 border-red-500/20",
      pending: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    }[request.status] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
        <span
          className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${statusConfig}`}
        >
          {request.status}
        </span>
        <CheckCircle2 size={16} className="text-zinc-700" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="text-center">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">
              From
            </p>
            <p className="text-sm font-bold text-white leading-none">
              {formatDateDisplay(request.start_date)}
            </p>
          </div>
          <div className="h-px flex-1 bg-zinc-800" />
          <div className="text-center">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">
              To
            </p>
            <p className="text-sm font-bold text-white leading-none">
              {formatDateDisplay(request.end_date)}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">
            {request.leave_type}
          </span>
          <span className="text-[10px] font-medium text-zinc-400 max-w-30 truncate">
            {request.reason || "No reason"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
