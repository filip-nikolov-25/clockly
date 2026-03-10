import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  User as UserIcon,
} from "lucide-react";
import type { Employee, PublicHolidayType, TimeOff } from "../interfaces/types";
import {
  convertMonSunWeekDaysFormat,
  formatDateToISO,
  formatMinutesToHoursAndMinutes,
} from "../helperFunctions";

const toDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const TODAY_AT_MIDNIGHT = new Date();
TODAY_AT_MIDNIGHT.setHours(0, 0, 0, 0);

interface Props {
  publicHolidays: PublicHolidayType[];
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WeekCalendar = ({ publicHolidays }: Props) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [workEntries, setWorkEntries] = useState<{ [key: string]: any }>({});

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

  const formatLeavesToDays = (leaves: TimeOff[] = []) => {
    const days: Record<string, string> = {};
    leaves.forEach((leave) => {
      if (!leave.start_date || !leave.end_date) return;
      let current = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      while (current <= end) {
        days[toDateKey(current)] = leave.leave_type;
        current.setDate(current.getDate() + 1);
      }
    });
    return days;
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/approved-timeoff",
      );
      const employeesWithDays = res.data.map((emp: Employee) => ({
        ...emp,
        daysOff: formatLeavesToDays(emp.leaves),
      }));
      setEmployees(employeesWithDays);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchWorkHoursForEmployees = async () => {
    try {
      const startStr = formatDateToISO(startDate);
      const endStr = formatDateToISO(next7Days[next7Days.length - 1]);
      const res = await axios.get(
        "http://localhost:5000/api/weekcalendar/work-time",
        {
          params: { startDate: startStr, endDate: endStr },
        },
      );
      const entriesMap: { [key: string]: any } = {};
      res.data.forEach((entry: any) => {
        const dateKey = toDateKey(new Date(entry.work_date));

        const key = `${entry.user_id}_${dateKey}`;
        entriesMap[key] = entry;
      });
      console.log("setched work entries:", entriesMap);
      setWorkEntries(entriesMap);
    } catch (err) {
      console.error("Failed to fetch work entries", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchWorkHoursForEmployees();
  }, [startDate]);

  console.log(
    workEntries["5b352d6d-c9f3-4eda-ae44-96f055ea1b5b_2026-03-09"],
    "workEntries CUSTOM TAKEN",
  );

  return (
    <div className="mt-8 pb-40">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-medium">Syncing workforce data...</p>
        </div>
      ) : (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-4xl overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                <CalendarIcon size={20} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Workforce Weekly
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-zinc-800">
              <button
                onClick={handlePrevWeek}
                className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-4 text-xs font-black uppercase tracking-widest text-zinc-500">
                Navigation
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
                  console.log(entry, "entry for INSIDE", key);

                  const isPast = d.getTime() < TODAY_AT_MIDNIGHT.getTime();
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                  const leaveType = emp.daysOff?.[dateKey];
                  const dayHolidayList = publicHolidays.filter(
                    (h) =>
                      toDateKey(new Date(h.date)) === dateKey &&
                      h.countryCode === emp.country_code,
                  );

                  let label: string | number = "Work Day";
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
                    console.log(entry);
                    console.log(label, "LABEL ", emp.username, dateKey);
                  } else {
                    label = "Scheduled";
                    styleClass = "text-zinc-500 font-medium";
                  }

                  return (
                    <div
                      key={i}
                      className={`relative p-3 border-l border-zinc-800 flex flex-col items-center justify-center text-center gap-1 min-h-20 transition-all group-hover:border-l-zinc-700 ${cellBg}`}
                    >
                      <span
                        className={`text-[10px] tracking-tight uppercase ${styleClass}`}
                      >
                        {label}
                      </span>
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
