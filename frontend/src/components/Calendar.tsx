import { useState } from "react";

interface PublicHoliday {
  date: string;       
  countryCode: string;
  localName: string;
}

interface MonthCalendarProps {
  publicHolidays?: PublicHoliday[];
  onDateClick?: (date: string) => void;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ publicHolidays = [], onDateClick }: MonthCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));
  const holidaysInMonth = publicHolidays.reduce<Record<string, PublicHoliday[]>>(
    (acc, h) => {
      const holidayDate = new Date(h.date);
      if (
        holidayDate.getMonth() === month &&
        holidayDate.getFullYear() === year
      ) {
        const key = holidayDate.getDate().toString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(h);
      }
      return acc;
    },
    {}
  );

  return (
    <div className="mt-8 pb-40">
      <div className="flex justify-between items-center mb-6">
        <p className="text-3xl font-bold">{monthName} {year}</p>
        <div>
          <button onClick={handlePrev} className="mr-3 py-2 px-5 border-2 duration-300 hover:bg-orange-400">
            Previous
          </button>
          <button onClick={handleNext} className="py-2 px-5 border-2 duration-300 hover:bg-orange-400">
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center font-bold">
        {days.map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

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

          const holidayList = holidaysInMonth[date.toString()] || [];
          const isHoliday = holidayList.length > 0;

          return (
            <div
              key={date}
              className={`border h-28 flex flex-col items-start justify-start p-2 cursor-pointer transition
                ${isToday ? "bg-orange-400 text-black" : isHoliday ? "bg-purple-200 text-purple-800" : "hover:bg-orange-300"}`}
              onClick={() => onDateClick?.(`${year}-${month + 1}-${date}`)}
            >
              <span className="font-semibold">{date}</span>
              {isHoliday && (
                <div className="text-[10px] mt-1 flex flex-col gap-1">
                  {holidayList.map((h) => (
                    <span key={h.countryCode + h.date}>
                      {h.localName} ({h.countryCode})
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
