import { useEffect, useState } from "react";
import Wrapper from "../components/base/Wrapper";
import axios from "axios";
import type { RequestTimeOffType } from "../interfaces/types";
import { formatDate } from "../helperFunctions";

const AboutMe = () => {
  const [requestTimeOff, setRequestTimeOff] = useState<RequestTimeOffType[]>(
    [],
  );

  useEffect(() => {
    const fetchRequestTimeOff = async () => {
      const result = await axios.get(
        "http://localhost:5000/api/requesttimeoff",
      );
      setRequestTimeOff(result.data);
      console.log("Time Off Requests:", result.data);
    };
    fetchRequestTimeOff();
  }, []);

  return (
    <Wrapper>
      <h1 className="text-5xl font-bold mt-10 mb-3">About Me</h1>
      <h2 className="text-lg text-gray-400 mb-8">Your requests for off days</h2>

      {requestTimeOff.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {requestTimeOff.map((request: any, index: number) => {
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
                {/* Status Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full border ${statusColor}`}
                  >
                    {request.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>From</span>
                    <span className="text-white">
                      {formatDate(request.start_date)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>To</span>
                    <span className="text-white">
                      {formatDate(request.end_date)}
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
