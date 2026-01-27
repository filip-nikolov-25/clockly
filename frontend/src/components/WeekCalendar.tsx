import { useState, useEffect } from "react";
import axios from "axios";
import TimeOffRequestForm from "./TimeOffRequestForm";
import type { Employee, TimeOff } from "../interfaces/types";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WeekCalendar = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = (date: Date) => date.toISOString().split("T")[0];

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
    <div className="mt-8 pb-40 px-4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-3xl font-bold">Weekly Schedule</p>
        <button
          onClick={() => setShowRequestModal(true)}
          className="px-8 border-2 hover:bg-orange-50 hover:text-black"
        >
          Request Time Off
        </button>
      </div>

      <div className="mb-10">
        {showRequestModal && (
          <TimeOffRequestForm
            onClose={() => setShowRequestModal(false)}
            onSubmitted={fetchEmployees}
          />
        )}
      </div>

      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <>
          <div className="text-end mb-10">
            <button
              onClick={handlePrevWeek}
              className="mr-3 py-2 px-5 border-2 hover:bg-gray-200"
            >
              Previous
            </button>
            <button
              onClick={handleNextWeek}
              className="py-2 px-5 border-2 hover:bg-gray-200"
            >
              Next
            </button>
          </div>
          {/* Weekdays header */}
          <div className="grid grid-cols-8 text-center font-bold border-b pb-2">
            <div className="text-left pl-2">Employee</div>
            {next7Days.map((d, i) => (
              <div key={i}>
                {daysOfWeek[d.getDay()]} {d.getDate()}
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {employees.map((emp) => (
              <div key={emp.user_id} className="grid grid-cols-8 border h-16">
                <div className="flex items-center pl-2 font-semibold">
                  {emp.username}
                </div>
                {next7Days.map((d, i) => {
                  const dateStr = todayStr(d);
                  const isOff = emp.daysOff?.includes(dateStr);
                  let bgClass = isOff
                    ? "bg-red-500 text-white"
                    : d.toDateString() === today.toDateString()
                      ? "bg-orange-400 text-black"
                      : d < today
                        ? "bg-green-500 text-black"
                        : "bg-black text-white";

                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center border-l ${bgClass}`}
                    >
                      {isOff ? "Off" : "Work"}
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
