import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  User as UserIcon,
  Clock3,
} from "lucide-react";
import type { Employee, PublicHolidayType } from "../interfaces/types";
import {
  convertMonSunWeekDaysFormat,
  formatDateToISO,
  formatLeavesToDays,
  formatMinutesToHoursAndMinutes,
  toDateKey,
} from "../helperFunctions";

const TODAY_AT_MIDNIGHT = new Date();
TODAY_AT_MIDNIGHT.setHours(0, 0, 0, 0);

interface Props {
  publicHolidays: PublicHolidayType[];
}
interface WorkEntryType {
  total_minutes: number;
  user_id: string;
  work_date: string;
  worked_minutes: number;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WeekCalendar = ({ publicHolidays }: Props) => {
    const API_URL = import.meta.env.VITE_API_URL;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [workEntries, setWorkEntries] = useState<{
    [key: string]: WorkEntryType;
  }>({});

  const [startDate, setStartDate] = useState(() => {
    const d = convertMonSunWeekDaysFormat(new Date());
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const next7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return d;
    });
  }, [startDate]);

  const handlePrevWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 7);
    setStartDate(convertMonSunWeekDaysFormat(newDate));
  };

  const handleNextWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 7);
    setStartDate(convertMonSunWeekDaysFormat(newDate));
  };

  const fetchEmployeesData = async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const startStr = formatDateToISO(start);
      const endStr = formatDateToISO(end);
      const res = await axios.get(
        `${API_URL}/api/users/approved-timeoff`,
        {
          params: { startDate: startStr, endDate: endStr },
        },
      );
      const employeesWithDays = res.data.map((emp: Employee) => ({
        ...emp,
        daysOff: formatLeavesToDays(emp.leaves),
      }));
      setEmployees(employeesWithDays);
    } catch (err) {
      console.error("Error fetching filtered leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkHoursData = async (start: Date, end: Date) => {
    try {
      const startStr = formatDateToISO(start);
      const endStr = formatDateToISO(end);
      const res = await axios.get(
        `${API_URL}/api/weekcalendar/work-time`,
        {
          params: { startDate: startStr, endDate: endStr },
        },
      );
      const entriesMap: { [key: string]: WorkEntryType } = {};
      res.data.forEach((entry: WorkEntryType) => {
        const dateKey = toDateKey(new Date(entry.work_date));
        const key = `${entry.user_id}_${dateKey}`;
        entriesMap[key] = entry;
      });
      setWorkEntries(entriesMap);
    } catch (err) {
      console.error("Failed to fetch work entries", err);
    }
  };

  useEffect(() => {
    const endDate = next7Days[6];
    fetchEmployeesData(startDate, endDate);
    fetchWorkHoursData(startDate, endDate);
  }, [startDate]);

  return (
    <div className="mt-8 pb-40">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Clock3 size={28} className="text-orange-500 animate-spin" />
          <p className="text-zinc-500 font-medium">Syncing workforce data...</p>
        </div>
      ) : (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-4xl overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                <CalendarIcon size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight leading-none">
                  Workforce Weekly
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  Schedule Overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-zinc-800">
              <button
                onClick={handlePrevWeek}
                className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-4 text-xs font-black uppercase tracking-widest text-zinc-300">
                {startDate.getFullYear()}
              </div>
              <button
                onClick={handleNextWeek}
                className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-8 border-b border-zinc-800 bg-zinc-900/20">
            <div className="p-4 text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <UserIcon size={14} /> Member
            </div>
            {next7Days.map((d, i) => {
              const isToday =
                d.toDateString() === TODAY_AT_MIDNIGHT.toDateString();
              return (
                <div
                  key={i}
                  className={`p-4 border-l border-zinc-800 flex flex-col items-center justify-center gap-1 ${isToday ? "bg-orange-500/5" : ""}`}
                >
                  <span
                    className={`text-[10px] font-black uppercase tracking-tighter ${isToday ? "text-orange-500" : "text-zinc-500"}`}
                  >
                    {d.toLocaleString("default", { month: "short" })}
                  </span>
                  <span
                    className={`text-sm font-bold ${isToday ? "text-white" : "text-zinc-300"}`}
                  >
                    {daysOfWeek[d.getDay()]} {d.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="divide-y divide-zinc-800">
            {employees.map((emp) => (
              <div
                key={emp.user_id}
                className="grid grid-cols-8 group hover:bg-white/2 transition-colors"
              >
                <div className="p-4 flex items-center gap-3 bg-zinc-900/40 border-r border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-orange-500 border border-zinc-700 uppercase">
                    {emp.username.slice(0, 2)}
                  </div>
                  <span className="text-sm font-semibold text-zinc-200 truncate">
                    {emp.username}
                  </span>
                </div>
                {next7Days.map((d, i) => {
                  const dateKey = toDateKey(d);
                  const key = `${emp.user_id}_${dateKey}`;
                  const entry = workEntries[key];
                  const isToday =
                    d.toDateString() === TODAY_AT_MIDNIGHT.toDateString();
                  const isPast = d.getTime() < TODAY_AT_MIDNIGHT.getTime();
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                  const leaveType = emp.daysOff?.[dateKey];
                  const dayHolidayList = publicHolidays.filter(
                    (h) =>
                      toDateKey(new Date(h.date)) === dateKey &&
                      h.countryCode === emp.country_code,
                  );

                  let label: string = "Working";
                  let styleClass = "text-zinc-500";
                  let cellBg = "";

                  if (dayHolidayList.length > 0) {
                    label = "Public Holiday";
                    styleClass = "text-amber-400 font-bold";
                    cellBg = "bg-amber-400/5";
                  } else if (leaveType) {
                    label = leaveType;
                    styleClass = "text-rose-400 font-bold";
                    cellBg = "bg-rose-500/10";
                  } else if (isWeekend) {
                    label = "Weekend";
                    styleClass = "text-zinc-600 font-medium";
                    cellBg = "bg-zinc-950/40";
                  } else if (isPast) {
                    label = entry
                      ? formatMinutesToHoursAndMinutes(entry.worked_minutes)
                      : "0h 00m";
                    styleClass = entry
                      ? "text-emerald-400 font-mono font-bold"
                      : "text-zinc-700 font-mono";
                  } else {
                    label = "Working";
                    styleClass = isToday
                      ? "text-zinc-400 font-bold"
                      : "text-zinc-500 font-medium";
                  }

                  return (
                    <div
                      key={i}
                      className={`relative p-3 border-l border-zinc-800 flex flex-col items-center justify-center text-center gap-1 min-h-20 transition-all group-hover:border-l-zinc-700 ${cellBg}`}
                    >
                      <div className="flex items-center gap-1.5">
                        {isToday && label === "Working" && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-200 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                          </span>
                        )}
                        <span
                          className={`text-[10px] tracking-tight uppercase ${styleClass}`}
                        >
                          {label}
                        </span>
                      </div>
                      {dayHolidayList.map((h) => (
                        <div
                          key={h.localName}
                          className="mt-1 px-1.5 py-0.5 bg-amber-400/20 rounded text-[9px] text-amber-200 font-medium border border-amber-400/20"
                          title={h.localName}
                        >
                          {h.countryCode}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekCalendar;
