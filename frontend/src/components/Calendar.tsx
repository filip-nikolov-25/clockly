import { useState, useMemo } from "react";
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
const AVAILABLE_COUNTRIES = ["MK", "CH", "DE"];

const Calendar = ({ publicHolidays = [], onDateClick }: MonthCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

  const holidaysInMonth = useMemo(() => {
    return publicHolidays.reduce<Record<string, PublicHoliday[]>>((acc, h) => {
      const holidayDate = new Date(h.date);
      const matchesDate =
        holidayDate.getMonth() === month && holidayDate.getFullYear() === year;
      const matchesFilter =
        activeFilter === "ALL" || h.countryCode === activeFilter;

      if (matchesDate && matchesFilter) {
        const key = holidayDate.getDate().toString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(h);
      }
      return acc;
    }, {});
  }, [publicHolidays, month, year, activeFilter]);

  return (
    <div className="mt-4 md:mt-8 pb-20 md:pb-40 text-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4 md:gap-6">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-orange-500/10 text-orange-500 rounded-xl md:rounded-2xl border border-orange-500/20">
            <CalendarDays className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight leading-none uppercase">
              {monthName}{" "}
              <span className="text-zinc-500 font-light">{year}</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 backdrop-blur-md overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-2.5 md:px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                activeFilter === "ALL"
                  ? "bg-orange-500 text-white"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              All
            </button>
            {AVAILABLE_COUNTRIES.map((code) => (
              <button
                key={code}
                onClick={() => setActiveFilter(code)}
                className={`px-2.5 md:px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                  activeFilter === code
                    ? "bg-purple-500 text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-zinc-900/50 p-1 rounded-xl md:rounded-2xl border border-zinc-800">
            <button
              onClick={handlePrev}
              className="p-2 md:p-2.5 hover:bg-zinc-800 text-zinc-400 rounded-lg md:rounded-xl"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 md:p-2.5 hover:bg-zinc-800 text-zinc-400 rounded-lg md:rounded-xl"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl md:rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900/50">
          {days.map((day) => (
            <div
              key={day}
              className="py-2.5 md:py-4 text-center text-[8px] md:text-[10px] font-black uppercase tracking-widest md:tracking-[0.2em] text-zinc-500"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-zinc-800">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-[#0c0c0e] h-20 sm:h-32 md:h-40" />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = i + 1;
            const dayOfWeek = (firstDayOfMonth + i) % 7;
            const isToday =
              date === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            const holidayList = holidaysInMonth[date.toString()] || [];
            const isRightSide = dayOfWeek > 3;

            return (
              <div
                key={date}
                onClick={() => onDateClick?.(`${year}-${month + 1}-${date}`)}
                className={`group relative bg-[#0c0c0e] h-20 sm:h-32 md:h-40 flex flex-col p-2 md:p-3 transition-all duration-300 cursor-pointer 
                  ${isToday ? "ring-2 ring-inset ring-orange-500/50 z-20" : "hover:bg-zinc-900 hover:z-30"}`}
              >
                <span
                  className={`text-sm md:text-lg font-bold mb-1 ${
                    isToday ? "text-orange-500" : "text-zinc-400 group-hover:text-white"
                  }`}
                >
                  {date}
                </span>

                {holidayList.length > 0 && (
                  <div className="mt-auto space-y-0.5 md:space-y-1 relative">
                    {holidayList.map((h, idx) => (
                      <div key={idx} className="relative group/holiday">
                        <div className="flex items-center gap-1 md:gap-1.5 px-1 md:px-2 py-0.5 md:py-1 rounded-sm md:rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                          <div className="flex flex-col overflow-hidden">
                            <span className="hidden md:block text-[7px] font-black uppercase opacity-60">
                              {h.countryCode}
                            </span>
                            <span className="text-[7px] md:text-[9px] font-bold truncate leading-none">
                              <span className="md:hidden">{h.countryCode}: </span>
                              {h.localName}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`
                            pointer-events-none absolute bottom-full mb-3 z-100
                            hidden lg:group-hover/holiday:block
                            ${isRightSide ? "right-0" : "left-0"}
                          `}
                        >
                          <div className="relative animate-in fade-in zoom-in duration-200">
                            <div className="bg-zinc-950 border border-zinc-700/50 p-3 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl min-w-35">
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className="p-1.5 bg-orange-500/20 rounded-md">
                                  <Gift size={12} className="text-orange-500" />
                                </div>
                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                                  {h.countryCode} Holiday
                                </span>
                              </div>
                              <p className="text-xs font-bold text-white leading-tight">
                                {h.localName}
                              </p>
                              <div
                                className={`absolute top-full w-3 h-3 bg-zinc-950 border-r border-b border-zinc-700/50 rotate-45 -translate-y-1.5 ${
                                  isRightSide ? "right-4" : "left-4"
                                }`}
                              />
                            </div>
                          </div>  
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;