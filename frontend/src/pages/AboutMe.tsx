import { useEffect, useState } from "react";
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
} from "lucide-react";
import {
  formatDateDisplay,
  formatTimeDisplay,
  getBreakMinutes,
} from "../helperFunctions";
import type { TimeOffRequest, UserType } from "../interfaces/types";

interface Props {
  user: UserType | null;
}

const AboutMe = ({ user }: Props) => {
  const [todayWork, setTodayWork] = useState<any>(null);
  const [previousMonthWork, setPreviousMonthWork] = useState<any[]>([]);
  const [requestTimeOff, setRequestTimeOff] = useState<TimeOffRequest[]>([]);

  const formatWorkedTime = (minutes: number) => {
    if (!minutes) return "0h 0m";
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hrs}h ${mins}m`;
  };

  useEffect(() => {
    const fetchTodayWork = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/today");
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
  }, []);

  useEffect(() => {
    const fetchPreviousMonthWork = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/work/previous-month",
          {
            params: { t: new Date().getTime() },
          },
        );
        setPreviousMonthWork(data);
      } catch (err) {
        console.error("Fetch previous month work failed", err);
      }
    };
    fetchPreviousMonthWork();
  }, []);

  useEffect(() => {
    const fetchRequestTimeOff = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/requesttimeoff",
          {
            params: { months: 2 },
          },
        );

        setRequestTimeOff(data);
      } catch (err) {
        console.error("Time off requests failed", err);
      }
    };
    fetchRequestTimeOff();
  }, []);
  const totalPreviousMonthMinutes = previousMonthWork.reduce(
    (sum, entry) => sum + Number(entry.worked_minutes || 0),
    0,
  );
  const workedHours = Math.floor(totalPreviousMonthMinutes / 60);
  const totalMonthlyHours = 160;
  const progressPercent = Math.min(
    (workedHours / totalMonthlyHours) * 100,
    100,
  );

  const totalYearWorkingDays = 250;
  const dailyWorkingMinutes = 8 * 60;
  const totalWorkedMinutes = previousMonthWork.reduce(
    (sum, entry) => sum + Number(entry.worked_minutes),
    0,
  );
  const workedYearDays = totalWorkedMinutes / dailyWorkingMinutes;

  const calculateProgressBarPercentage = (value: number, total: number) => {
    if (!total) return 0;
    return Math.min((value / total) * 100, 100);
  };

  const yearDaysProgressPercent = calculateProgressBarPercentage(
    workedYearDays,
    totalYearWorkingDays,
  );
  const TOTAL_DAYS_OFF = 24;
  const remainingDays = user?.free_days ?? 0;
  const offDaysPercent = calculateProgressBarPercentage(
    remainingDays,
    TOTAL_DAYS_OFF,
  );

  return (
    <Wrapper>
      <div className="mt-12 mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
            {user?.username}
            <span className="text-orange-500">.</span>
          </h1>
          <p className="text-zinc-500 font-medium mt-2 tracking-widest uppercase text-xs">
            Employee Dashboard Overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-4xl backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Briefcase size={24} />
            </div>
            <span className="text-2xl font-black text-white">
              {workedYearDays.toFixed(1)}
            </span>
          </div>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">
            Year Working Days
          </p>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-1000"
              style={{ width: `${yearDaysProgressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 font-bold">
            Target: {totalYearWorkingDays} Days
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-4xl backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
              <Timer size={24} />
            </div>
            <span className="text-2xl font-black text-white">
              {workedHours}h
            </span>
          </div>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">
            Monthly Capacity
          </p>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 font-bold">
            Goal: {totalMonthlyHours} Hours
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-4xl backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <Plane size={24} />
            </div>
            <span className="text-2xl font-black text-white">
              {remainingDays}
            </span>
          </div>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">
            Available Time Off
          </p>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-1000"
              style={{ width: `${offDaysPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 font-bold">
            of {TOTAL_DAYS_OFF} annual days
          </p>
        </div>
      </div>

      <h2 className="flex items-center gap-2 text-zinc-400 font-black uppercase tracking-[0.2em] text-xs mb-6">
        <Clock size={14} className="text-orange-500" /> Today's Session
      </h2>
      {todayWork ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-4xl p-8 mb-12 relative overflow-hidden group">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                Start
              </p>
              <p className="text-xl font-bold text-white">
                {formatTimeDisplay(todayWork.start_time)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                End
              </p>
              <p className="text-xl font-bold text-white">
                {todayWork.end_time
                  ? formatTimeDisplay(todayWork.end_time)
                  : "--:--"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                Break
              </p>
              <p className="text-xl font-bold text-zinc-400">
                {todayWork.totalBreak ?? 0}{" "}
                <span className="text-xs font-normal">min</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
                Worked
              </p>
              <p className="text-xl font-black text-white">
                {formatWorkedTime(todayWork.workedMinutes)}
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Timer size={80} />
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/20 border border-dashed border-zinc-800 rounded-4xl p-10 text-center mb-12">
          <Coffee className="mx-auto text-zinc-700 mb-3" size={32} />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
            No active session found for today
          </p>
        </div>
      )}

      <h2 className="flex items-center gap-2 text-zinc-400 font-black uppercase tracking-[0.2em] text-xs mb-6">
        <Calendar size={14} className="text-blue-500" /> Last Month Activity
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {previousMonthWork.length > 0 ? (
          previousMonthWork.map((entry: any) => (
            <div
              key={entry.id}
              className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-800/40 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-zinc-500 uppercase tracking-tighter">
                  {formatDateDisplay(entry.work_date)}
                </span>
                <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black tracking-widest uppercase">
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
                    {entry.break_minutes} min
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800 text-zinc-600 font-bold uppercase text-xs">
            No history recorded
          </div>
        )}
      </div>

      <h2 className="flex items-center gap-2 text-zinc-400 font-black uppercase tracking-[0.2em] text-xs mb-6">
        <Plane size={14} className="text-emerald-500" /> Absence Requests
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-20">
        {requestTimeOff.length > 0 ? (
          requestTimeOff.map((request: TimeOffRequest, index: number) => {
            const statusConfig =
              {
                accepted:
                  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                rejected: "bg-red-500/10 text-red-400 border-red-500/20",
                pending:
                  "bg-orange-500/10 text-orange-400 border-orange-500/20",
              }[request.status] ||
              "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

            return (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${statusConfig}`}
                  >
                    {request.status}
                  </span>
                  <span className="text-zinc-600">
                    <CheckCircle2 size={16} />
                  </span>
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
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">
                        {request.leave_type}
                      </span>
                      <span className="text-[10px] font-medium text-zinc-400 max-w-30 truncate">
                        {request.reason || "No reason provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-10 text-center bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800 text-zinc-600 font-bold uppercase text-xs">
            No active requests
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default AboutMe;
