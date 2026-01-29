import { useEffect, useState } from "react";
import Wrapper from "../components/base/Wrapper";
import axios from "axios";

const TimeManagment = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [entry, setEntry] = useState<any>(null);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

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
          const breakEnd = data.break_end ? new Date(data.break_end).getTime() : now;
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
      const interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (timerInterval) clearInterval(timerInterval);
    }
  }, [running]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  // api cals
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
      setEntry({ ...entry, break_start: new Date().toISOString(), break_end: null });
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

  
  const TOTAL_SECONDS = 8 * 60 * 60;
  const progress = Math.min(seconds / TOTAL_SECONDS, 1);
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <Wrapper>
      <h1 className="mt-20 font-bold text-5xl text-white text-center">
        Work Time Management
      </h1>

      <div className="flex flex-col items-center w-105 mx-auto mt-20 rounded-3xl py-16 shadow-md shadow-orange-400 bg-linear-to-b from-gray-400 to-gray-900 text-white">
        <p className="text-2xl font-semibold mb-8">Today’s Working Time</p>

        <div className="relative w-56 h-56 mb-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 224 224">
            <circle
              cx="112"
              cy="112"
              r={radius}
              stroke="#2a2a2a"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="112"
              cy="112"
              r={radius}
              stroke="#fb923c"
              strokeWidth="10"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
            {formatTime(seconds)}
          </div>
        </div>

        <div className="flex gap-4">
          {!running && (
            <button
              onClick={handleStart}
              className="px-8 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition"
            >
              {onBreak ? "Resume" : "Start"}
            </button>
          )}
          {running && !onBreak && (
            <button
              onClick={handleBreak}
              className="px-8 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 transition"
            >
              Break
            </button>
          )}
          {entry && !onBreak && (
            <button
              onClick={handleEnd}
              className="px-8 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition"
            >
              End
            </button>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default TimeManagment;
