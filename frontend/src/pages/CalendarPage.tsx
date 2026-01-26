import { useState } from "react";
import Wrapper from "../components/base/Wrapper";
import axios from "axios";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openRequestModal, setOpenRequestModal] = useState(false);

  // form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayString = new Date().toISOString().split("T")[0];

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

const handleSubmit = async () => {
  if (!startDate || !endDate || !leaveType) {
    setMessage("Please fill all required fields!");
    return;
  }

const today = new Date();
const start = new Date(startDate);
const end = new Date(endDate);

if (start.getTime() < today.setHours(0, 0, 0, 0)) {
  setMessage("Start date cannot be in the past!");
  return;
}

if (end.getTime() < start.getTime()) {
  setMessage("End date cannot be before start date!");
  return;
}
  setLoading(true);
  setMessage("");

  try {
    const res = await axios.post(
      "http://localhost:5000/api/requesttimeoff",
      {
        start_date: startDate,
        end_date: endDate,
        reason,
        type: leaveType,
      },
      { withCredentials: true }
    );

    setMessage("Request submitted successfully!");
    setStartDate("");
    setEndDate("");
    setReason("");
    setLeaveType("");
    console.log(res.data);
  } catch (err: any) {
    console.error(err);
    setMessage(err.response?.data?.message || "Error submitting request. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Wrapper>
      <h1 className="pt-10 text-7xl font-bold">Calendar</h1>
      <div className="flex justify-between">
        <h2 className="pt-5 text-2xl">
          Manage schedules and time off requests
        </h2>
        <button
          onClick={() => setOpenRequestModal(!openRequestModal)}
          className="px-8 border-2 hover:bg-orange-50 hover:text-black"
        >
          Request Time Off
        </button>
      </div>

      {openRequestModal && (
        <div className="bg-[#202020] mt-10 p-10 rounded-xl">
          <h2 className="font-bold mb-5 text-2xl text-white">
            New Time Off Request
          </h2>
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col text-white">
              <label className="mb-2">Start Date:</label>
              <input
                type="date"
                className="bg-black py-2 px-3 rounded-lg border-2 w-full"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={todayString}
              />
            </div>
            <div className="flex-1 flex flex-col text-white">
              <label className="mb-2">End Date:</label>
              <input
                type="date"
                className="bg-black py-2 px-3 rounded-lg border-2 w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || todayString}
              />
            </div>
          </div>

          <select
            className="mt-5 w-full bg-black py-2 px-3 rounded-lg border-2 text-white"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            <option value="" disabled>
              Select Type of Leave
            </option>
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal Day</option>
          </select>

          <label className="mt-5 block text-white">Reason:</label>
          <textarea
            className="mt-2 w-full bg-black py-2 px-3 rounded-lg border-2 text-white"
            rows={4}
            placeholder="Provide a brief reason for your time off request..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>

          <button
            className="mt-5 py-2 px-5 border-2 hover:bg-gray-200"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>

          {message && (
            <p className="mt-3 text-white font-semibold">{message}</p>
          )}
        </div>
      )}

      {/* Calendar display */}
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

        <div className="grid grid-cols-7 text-center font-bold">
          {days.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
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
            return (
              <div
                key={date}
                className={`border h-28 flex items-start justify-start p-2 cursor-pointer transition
                  ${isToday ? "bg-orange-400 text-black" : "hover:bg-orange-300"}`}
              >
                <span className="font-semibold">{date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
};

export default CalendarPage;
