import { useState, useEffect } from "react";
import axios from "axios";
import type { Employee, PublicHolidayType, TimeOff } from "../interfaces/types";
import { formatDateForCompare } from "../helperFunctions";

interface Props {
  publicHolidays: PublicHolidayType[];
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WeekCalendar = ({ publicHolidays }: Props) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const [startDate, setStartDate] = useState(getStartOfWeek(new Date()));

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  const handlePrevWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 7);
    setStartDate(getStartOfWeek(newDate));
  };

  const handleNextWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 7);
    setStartDate(getStartOfWeek(newDate));
  };

  const formatLeavesToDays = (leaves: TimeOff[] = []) => {
    const days: string[] = [];
    leaves.forEach((leave) => {
      if (!leave.start_date || !leave.end_date) return;
      let current = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      while (current <= end) {
        days.push(current.toISOString().split("T")[0]);
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

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="mt-8 pb-40 ">
      {loading ? (
        <p className="text-center text-gray-500 text-lg">
          Loading employees...
        </p>
      ) : (
        <>
          <div className="flex justify-end mb-6 ">
            <button
              onClick={handlePrevWeek}
              className="py-2 px-5 border-2 mr-3 hover:bg-orange-400 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNextWeek}
              className="py-2 px-5 border-2 hover:bg-orange-400 transition-colors"
            >
              Next
            </button>
          </div>

          <div className="grid grid-cols-8 text-center font-bold border-b-2 border-gray-200 pb-2">
            <div className="text-left pl-2 text-white">Employee</div>
            {next7Days.map((d, i) => {
              const isToday = d.toDateString() === today.toDateString();
              return (
                <div
                  key={i}
                  className={`text-gray-700 flex flex-col items-center ${
                    isToday ? "bg-white text-black rounded-md px-2 py-1" : ""
                  }`}
                >
                  <span className="block text-sm  text-gray-400">
                    {d.toLocaleString("default", { month: "short" })}
                  </span>
                  <span className="block text-lg font-semibold">
                    {daysOfWeek[d.getDay()]} {d.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {employees.map((emp) => (
              <div
                key={emp.user_id}
                className="grid grid-cols-8 min-h-20 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center pl-3 font-semibold text-gray-800 bg-gray-50">
                  {emp.username}
                </div>

                {next7Days.map((d, i) => {
                  const dateStr = formatDateForCompare(d);
                  const isOff = emp.daysOff?.includes(dateStr);

                  const dayHolidayList = publicHolidays.filter(
                    (h) =>
                      formatDateForCompare(h.date) ===
                        formatDateForCompare(d) &&
                      h.countryCode === emp.country_code,
                  );

                  let bgClass =
                    dayHolidayList.length > 0
                      ? "text-white"
                      : isOff
                        ? "bg-red-500 text-white"
                        : d.toDateString() === today.toDateString()
                          ? "bg-gray-100 text-black font-bold"
                          : d < today
                            ? "bg-green-200 text-black"
                            : "bg-gray-900 text-white";
                  const leaveForDay = emp.leaves?.find(
                    (leave) =>
                      formatDateForCompare(leave.start_date) <= dateStr &&
                      formatDateForCompare(leave.end_date) >= dateStr,
                  );

                  let label =
                    dayHolidayList.length > 0
                      ? "Holiday"
                      : leaveForDay
                        ? `${leaveForDay.leave_type} (Not working)`
                        : "Working";
                  ("Working");

                  return (
                    <div
                      key={i}
                      className={`flex flex-col items-center justify-center border-l text-xs p-1 ${bgClass}`}
                    >
                      <span className="font-medium">{label}</span>

                      {dayHolidayList.length > 0 && (
                        <div className="flex flex-col gap-1 mt-1">
                          {dayHolidayList.map((h) => (
                            <div
                              key={h.countryCode + h.date}
                              className="text-[10px] font-bold flex flex-col items-center"
                              title={`${h.localName} (${h.countryCode})`}
                            >
                              <span>{h.localName}</span>
                              <span className="text-gray-200">
                                {h.countryCode}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WeekCalendar;
