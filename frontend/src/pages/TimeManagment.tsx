import { useEffect, useState } from "react";
import Wrapper from "../components/base/Wrapper";
import axios from "axios";
import { Play, Pause, Square, Coffee, Timer, Info } from "lucide-react";

const TimeManagment = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [entry, setEntry] = useState<any>(null);
  const [timerInterval, setTimerInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);

  const fetchToday = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/today");
      if (data && !data.end_time) {
        setEntry(data);
        const start = new Date(data.start_time).getTime();
        const now = new Date().getTime();
        let breakDuration = 0;
        if (data.break_start) {
          const breakStart = new Date(data.break_start).getTime();
          const breakEnd = data.break_end
            ? new Date(data.break_end).getTime()
            : now;
          breakDuration = breakEnd - breakStart;
        }
        setSeconds(Math.floor((now - start - breakDuration) / 1000));
        setRunning(!data.break_start || !!data.break_end);
      }
    } catch (err) {
      console.error("Fetch today failed", err);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (timerInterval) clearInterval(timerInterval);
    }
  }, [running]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return {
      display: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
      seconds: sec.toString().padStart(2, "0"),
    };
  };

  const handleStart = async () => {
    try {
      if (!entry) {
        const { data } = await axios.post("http://localhost:5000/api/start");
        setEntry(data);
      } else if (entry.break_start && !entry.break_end) {
        await axios.patch(`http://localhost:5000/api/break-end/${entry.id}`);
        setEntry({ ...entry, break_end: new Date().toISOString() });
      }
      setRunning(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBreak = async () => {
    if (!entry) return;
    try {
      await axios.patch(`http://localhost:5000/api/break-start/${entry.id}`);
      setEntry({
        ...entry,
        break_start: new Date().toISOString(),
        break_end: null,
      });
      setRunning(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnd = async () => {
    if (!entry) return;
    try {
      await axios.patch(`http://localhost:5000/api/end/${entry.id}`);
      setEntry(null);
      setRunning(false);
      setSeconds(0);
    } catch (err) {
      console.error(err);
    }
  };

  const onBreak = entry?.break_start && !entry?.break_end;
  const time = formatTime(seconds);

  // SVG Progress Logic
  const TOTAL_SECONDS = 8 * 60 * 60; // 8 hours goal
  const progress = Math.min(seconds / TOTAL_SECONDS, 1);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <Wrapper>
      <div className="mt-16 mb-12 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
            <Timer size={20} />
          </div>
          <span className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">
            Work Session
          </span>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter text-center">
          Performance <span className="text-orange-500 text-6xl">Tracker</span>
        </h1>
      </div>

      <div className="max-w-md mx-auto relative">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[3rem] p-10 backdrop-blur-xl shadow-2xl relative z-10 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
              <svg
                className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(251,146,60,0.1)]"
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-zinc-800/50"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#fb923c"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  Elapsed
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white tabular-nums">
                    {time.display}
                  </span>
                  <span className="text-xl font-bold text-orange-500 tabular-nums w-6">
                    {time.seconds}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-10 flex items-center gap-2 px-4 py-2 bg-black/40 border border-zinc-800 rounded-2xl">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${running ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : onBreak ? "bg-yellow-500" : "bg-zinc-600"}`}
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                {running
                  ? "Active Session"
                  : onBreak
                    ? "On Break"
                    : "System Idle"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              {!running ? (
                <button
                  onClick={handleStart}
                  className="col-span-2 group flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                  <Play size={20} fill="currentColor" />
                  <span className="uppercase tracking-widest text-sm">
                    {onBreak ? "Resume Work" : "Punch In"}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleBreak}
                    className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 rounded-2xl transition-all active:scale-95"
                  >
                    <Coffee size={18} />
                    <span className="uppercase tracking-widest text-xs">
                      Break
                    </span>
                  </button>
                  <button
                    onClick={handleEnd}
                    className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 font-bold py-4 rounded-2xl transition-all active:scale-95"
                  >
                    <Square size={16} fill="currentColor" />
                    <span className="uppercase tracking-widest text-xs">
                      End Shift
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 p-5 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl">
          <Info size={18} className="text-zinc-600 shrink-0" />
          <p className="text-zinc-500 text-[11px] font-medium leading-relaxed">
            Daily goal is set to{" "}
            <span className="text-zinc-300 font-bold">8 hours</span>. Your
            progress bar reflects your total worked minutes excluding breaks.
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

export default TimeManagment;
