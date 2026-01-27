import { useState } from "react";

interface Employee {
  id: string;
  name: string;
  daysOff?: string[]; // optional for employees
}

interface MonthCalendarProps {
  employees?: Employee[];
  onDateClick?: (date: string) => void;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ onDateClick }: MonthCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="mt-8 pb-40">
      <div className="flex justify-between items-center mb-6">
        <p className="text-3xl font-bold">
          {monthName} {year}
        </p>
        <div>
          <button
            onClick={handlePrev}
            className="mr-3 py-2 px-5 border-2 hover:bg-gray-200"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="py-2 px-5 border-2 hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>

      {/* week days */}
      <div className="grid grid-cols-7 text-center font-bold">
        {days.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* days */}
      <div className="grid grid-cols-7 gap-3 mt-3">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = i + 1;
          const isToday =
            date === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              key={date}
              className={`border h-28 flex items-start justify-start p-2 cursor-pointer transition
                ${isToday ? "bg-orange-400 text-black" : "hover:bg-orange-300"}`}
              onClick={() => onDateClick?.(`${year}-${month + 1}-${date}`)}
            >
              <span className="font-semibold">{date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
