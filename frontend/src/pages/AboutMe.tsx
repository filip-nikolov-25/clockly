import { useEffect, useState } from "react";
import Wrapper from "../components/base/Wrapper";
import axios from "axios";
import {
  formatDateDisplay,
  formatTimeDisplay,
  getBreakMinutes,
} from "../helperFunctions";
import type { TimeOffRequest, UserType } from "../interfaces/types";
interface Props {
  user: UserType | null;
}
const AboutMe = ({ user }: Props) => {
  const [todayWork, setTodayWork] = useState<any>(null);
  const [previousMonthWork, setPreviousMonthWork] = useState<any[]>([]);
  const [requestTimeOff, setRequestTimeOff] = useState<TimeOffRequest[]>([]);
  console.log(requestTimeOff, "requestTimeOff");

  const formatWorkedTime = (minutes: number) => {
    if (!minutes) return "0h 0m";
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hrs}h ${mins}m`;
  };

  useEffect(() => {
    const fetchTodayWork = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/today");

        if (!data) return;

        const breakMinutes = getBreakMinutes(data.break_start, data.break_end);

        setTodayWork({
          ...data,
          totalBreak: breakMinutes,
          workedMinutes: Math.max(0, (data.total_minutes ?? 0) - breakMinutes),
        });
      } catch (err) {
        console.error("Fetch today work failed", err);
      }
    };

    fetchTodayWork();
  }, []);

  useEffect(() => {
    const fetchPreviousMonthWork = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/work/previous-month",
          {
            params: { t: new Date().getTime() },
          },
        );
        setPreviousMonthWork(data);
      } catch (err) {
        console.error("Fetch previous month work failed", err);
      }
    };
    fetchPreviousMonthWork();
  }, []);

  useEffect(() => {
    const fetchRequestTimeOff = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/requesttimeoff",
        );
        setRequestTimeOff(data);
      } catch (err) {
        console.error("Time off requests failed", err);
      }
    };
    fetchRequestTimeOff();
  }, []);

  return (
    <Wrapper>
      <div className="flex justify-between mt-10 mb-10">
        <h1 className="text-5xl font-bold  mb-3">About Me</h1>
        <h2 className=" text-5xl font-bold">{user?.username}</h2>
      </div>

      <h2 className="text-lg text-gray-400 mb-3">Today's Work</h2>
      {todayWork ? (
        <div className="bg-[#202020] border border-white/10 rounded-2xl p-5 mb-8">
          <div className="flex justify-between text-gray-400">
            <span>Start Time:</span>
            <span className="text-white">
              {formatTimeDisplay(todayWork.start_time)}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>End Time:</span>
            <span className="text-white">
              {todayWork.end_time ? formatTimeDisplay(todayWork.end_time) : "-"}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Total Break:</span>
            <span className="text-white">
              {`${todayWork.totalBreak ?? "-"} min`}
            </span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Worked Time:</span>
            <span className="text-white">
              {formatWorkedTime(todayWork.workedMinutes)}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-[#202020] border border-white/10 rounded-xl p-6 text-center text-gray-400 mb-8">
          No work entry for today.
        </div>
      )}

      <h2 className="text-lg text-gray-400 mb-3">Previous Month</h2>
      {previousMonthWork.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {previousMonthWork.map((entry: any) => (
            <div
              key={entry.id}
              className="bg-[#202020] border border-white/10 rounded-2xl p-5"
            >
              <div className="flex justify-center  text-gray-400">
                <span className="text-center text-xl  text-orange-400">
                  Worked Time:
                </span>
                <span className="text-white text-xl ms-2 text-center">
                  {formatWorkedTime(entry.worked_minutes)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Date:</span>
                <span className="text-white">
                  {formatDateDisplay(entry.work_date)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Start:</span>
                <span className="text-white">
                  {formatTimeDisplay(entry.start_time)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>End:</span>
                <span className="text-white">
                  {entry.end_time ? formatTimeDisplay(entry.end_time) : "-"}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Break:</span>
                <span className="text-white">
                  {formatWorkedTime(entry.break_minutes)} min
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#202020] border border-white/10 rounded-xl p-6 text-center text-gray-400 mb-8">
          No work entries for previous month.
        </div>
      )}

      <h2 className="text-lg text-gray-400 mb-3">Your Requests for Off Days</h2>
      {requestTimeOff.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {requestTimeOff.map((request: TimeOffRequest, index: number) => {
            const statusColor =
              request.status === "accepted"
                ? "bg-green-500/15 text-green-400 border-green-500/30"
                : request.status === "rejected"
                  ? "bg-red-500/15 text-red-400 border-red-500/30"
                  : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";

            return (
              <div
                key={index}
                className="bg-[#202020] border border-white/10 rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
              >
                <h2 className="text-center">STATUS</h2>
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full border ${statusColor}`}
                  >
                    {request.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <div className="flex text-gray-400">
                    <span className="mr-2">From</span>
                    <span className="text-white">
                      {formatDateDisplay(request.start_date)}
                    </span>
                  </div>
                  <div className="flex text-gray-400">
                    <span className="mr-2">To</span>
                    <span className="text-white">
                      {formatDateDisplay(request.end_date)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mt-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Abscence Type</span>
                    <span className="text-white">{request.leave_type}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Reason</span>
                    <span className="text-white">
                      {request.reason ? request.reason : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#202020] border border-white/10 rounded-xl p-6 text-center text-gray-400">
          No time off requests found.
        </div>
      )}
    </Wrapper>
  );
};

export default AboutMe;
