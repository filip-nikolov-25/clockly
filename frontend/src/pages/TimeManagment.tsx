import { useEffect, useState } from "react";
import Wrapper from "../components/base/Wrapper";
import axios from "axios";
import {
  Play,
  Square,
  Coffee,
  Timer,
  Info,
  AlertTriangle,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Break {
  start_time: string;
  end_time: string | null;
}

interface Entry {
  id: string;
  start_time: string;
  end_time: string | null;
  breaks: Break[];
}

const TimeManagment = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [seconds, setSeconds] = useState(0);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [running, setRunning] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [isFinishedToday, setIsFinishedToday] = useState(false);

  const fetchToday = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/today`);
      if (data && data.end_time) {
        setIsFinishedToday(true);
        const normalizedEntry: Entry = { ...data, breaks: data.breaks || [] };
        setSeconds(calculateElapsedSeconds(normalizedEntry));
      } else if (data && !data.end_time) {
        const normalizedEntry: Entry = { ...data, breaks: data.breaks || [] };
        setEntry(normalizedEntry);
        setSeconds(calculateElapsedSeconds(normalizedEntry));
        setRunning(!normalizedEntry.breaks.some((b) => !b.end_time));
        setIsFinishedToday(false);
      }
    } catch (err) {
      console.error("Fetch today failed", err);
    }
  };

  const calculateElapsedSeconds = (entry: Entry) => {
    const now = Date.now();
    const start = new Date(entry.start_time).getTime();
    let totalElapsedMs = now - start;

    const shiftEnd = entry.end_time ? new Date(entry.end_time).getTime() : now;
    if (entry.end_time) totalElapsedMs = shiftEnd - start;

    entry.breaks.forEach((b) => {
      const breakStart = new Date(b.start_time).getTime();
      const breakEnd = b.end_time ? new Date(b.end_time).getTime() : shiftEnd;
      totalElapsedMs -= breakEnd - breakStart;
    });

    return Math.max(0, Math.floor(totalElapsedMs / 1000));
  };

  useEffect(() => {
    fetchToday();
  }, []);

  useEffect(() => {
    if (!entry || isFinishedToday) return;
    const interval = setInterval(() => {
      setSeconds(calculateElapsedSeconds(entry));
    }, 1000);
    return () => clearInterval(interval);
  }, [entry, isFinishedToday]);

  const handleStart = async () => {
    if (isFinishedToday) return;
    try {
      if (!entry) {
        const { data } = await axios.post(`${API_URL}/api/start`);
        const normalizedEntry: Entry = { ...data, breaks: data.breaks || [] };
        setEntry(normalizedEntry);
        setSeconds(0);
        setRunning(true);
      } else {
        const lastBreak = entry.breaks[entry.breaks.length - 1];
        if (lastBreak && !lastBreak.end_time) {
          await axios.patch(`${API_URL}/api/break-end/${entry.id}`);
          const updatedEntry = { ...entry };
          updatedEntry.breaks[updatedEntry.breaks.length - 1].end_time =
            new Date().toISOString();
          setEntry(updatedEntry);
          setRunning(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBreak = async () => {
    if (!entry) return;
    try {
      await axios.patch(`${API_URL}/api/break-start/${entry.id}`);
      const updatedEntry = { ...entry };
      updatedEntry.breaks.push({
        start_time: new Date().toISOString(),
        end_time: null,
      });
      setEntry(updatedEntry);
      setRunning(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnd = async () => {
    if (!entry) return;
    try {
      await axios.patch(`${API_URL}/api/end/${entry.id}`);
      setEntry(null);
      setRunning(false);
      setShowConfirmEnd(false);
      setIsFinishedToday(true);
      fetchToday();
    } catch (err) {
      console.error(err);
    }
  };

  const onBreak = entry?.breaks?.some((b) => !b.end_time) ?? false;

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return {
      display: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
      seconds: sec.toString().padStart(2, "0"),
    };
  };

  const time = formatTime(seconds);
  const TOTAL_SECONDS = 8 * 60 * 60;
  const progress = Math.min(seconds / TOTAL_SECONDS, 1);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <Wrapper>
      {showConfirmEnd && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setShowConfirmEnd(false)}
          />
          <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20">
                <AlertTriangle size={24} />
              </div>
              <button
                onClick={() => setShowConfirmEnd(false)}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
              Finalize{" "}
              <span className="text-red-500 text-3xl block">Shift?</span>
            </h3>

            <div className="flex gap-2 p-3 bg-red-500/5 border border-red-500/10 rounded-xl mb-6">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider leading-tight">
                Careful: This action is irreversible. You cannot punch back in
                until tomorrow.
              </p>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              Confirming will stop the clock and log your total hours for today.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleEnd}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-900/40 uppercase tracking-widest text-xs"
              >
                Confirm & Lock Shift
              </button>
              <button
                onClick={() => setShowConfirmEnd(false)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 rounded-2xl transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

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
                  stroke={isFinishedToday ? "#10b981" : "#fb923c"}
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
                  {isFinishedToday ? "Total Worked" : "Elapsed"}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white tabular-nums">
                    {time.display}
                  </span>
                  <span
                    className={`text-xl font-bold tabular-nums w-6 ${isFinishedToday ? "text-emerald-500" : "text-orange-500"}`}
                  >
                    {time.seconds}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-10 flex items-center gap-2 px-4 py-2 bg-black/40 border border-zinc-800 rounded-2xl">
              <div
                className={`w-2 h-2 rounded-full ${
                  running
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"
                    : isFinishedToday
                      ? "bg-emerald-500"
                      : onBreak
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-zinc-600"
                }`}
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                {isFinishedToday
                  ? "Shift Completed"
                  : running
                    ? "Active Session"
                    : onBreak
                      ? "On Break"
                      : "System Idle"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              {isFinishedToday ? (
                <button
                  disabled
                  className="col-span-2 flex items-center justify-center gap-3 bg-zinc-800 text-zinc-500 font-black py-4 rounded-2xl cursor-not-allowed opacity-50"
                >
                  <CheckCircle2 size={20} />
                  <span className="uppercase tracking-widest text-sm">
                    Shift Logged
                  </span>
                </button>
              ) : !running ? (
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
                    onClick={() => setShowConfirmEnd(true)}
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
            {isFinishedToday
              ? "Your session for today is locked. See you tomorrow!"
              : "Careful: Once you end your shift, you cannot record more time today. Goal: 8 hours."}
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

export default TimeManagment;
