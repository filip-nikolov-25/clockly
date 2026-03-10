import { useState } from "react";
import { ChevronLeft, ChevronRight, Gift, CalendarDays } from "lucide-react";

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
  const holidaysInMonth = publicHolidays.reduce<Record<string, PublicHoliday[]>>((acc, h) => {
    const holidayDate = new Date(h.date);
    if (holidayDate.getMonth() === month && holidayDate.getFullYear() === year) {
      const key = holidayDate.getDate().toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(h);
    }
    return acc;
  }, {});

  return (
    <div className="mt-8 pb-40 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl border border-orange-500/20">
            <CalendarDays size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight leading-none uppercase">
              {monthName} <span className="text-zinc-500 font-light">{year}</span>
            </h2>
            <p className="text-zinc-500 text-sm font-medium mt-1 uppercase tracking-widest">Monthly Overview</p>
          </div>
        </div>

        <div className="flex items-center bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800 backdrop-blur-md">
          <button
            onClick={handlePrev}
            className="p-2.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all duration-200"
            title="Previous Month"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="w-px h-6 bg-zinc-800 mx-1" />
          <button
            onClick={handleNext}
            className="p-2.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all duration-200"
            title="Next Month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900/50">
          {days.map((day) => (
            <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-zinc-800">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-[#0c0c0e] h-32 md:h-40" />
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
                onClick={() => onDateClick?.(`${year}-${month + 1}-${date}`)}
                className={`group relative bg-[#0c0c0e] h-32 md:h-40 flex flex-col p-3 transition-all duration-300 cursor-pointer overflow-hidden
                  ${isToday ? "ring-2 ring-inset ring-orange-500/50 z-10" : "hover:bg-zinc-900"}`}
              >
                <span className={`text-lg font-bold mb-1 transition-colors
                  ${isToday ? "text-orange-500" : "text-zinc-400 group-hover:text-white"}`}>
                  {date}
                </span>

                {isToday && (
                  <span className="text-[9px] font-black uppercase tracking-tighter text-orange-500 mb-2">
                    Today
                  </span>
                )}

                {isHoliday && (
                  <div className="mt-auto space-y-1">
                    {holidayList.map((h, index) => (
                      <div 
                        key={`${h.countryCode}-${h.date}-${index}`}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400"
                      >
                        <Gift size={10} className="shrink-0" />
                        <span className="text-[9px] font-bold truncate leading-none">
                          {h.localName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;