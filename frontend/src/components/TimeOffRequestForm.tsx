import { useState } from "react";
import axios from "axios";

interface TimeOffRequestFormProps {
  onClose: () => void;
  onSubmitted?: () => void;
}

const TimeOffRequestForm = ({
  onClose,
  onSubmitted,
}: TimeOffRequestFormProps) => {
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!leaveStart || !leaveEnd || !leaveType) {
      setMessage("Please fill all required fields!");
      return;
    }

    const start = new Date(leaveStart);
    const end = new Date(leaveEnd);

    if (start.getTime() < today.getTime()) {
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
      await axios.post("http://localhost:5000/api/requesttimeoff", {
        start_date: leaveStart,
        end_date: leaveEnd,
        leave_type: leaveType,
        reason: reason,
      });

      setMessage("Request submitted successfully!");
      setLeaveStart("");
      setLeaveEnd("");
      setLeaveType("");
      setReason("");

      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error submitting request.");
    } finally {
      setLoading(false);
    }
  };
    console.log(leaveType,"LEAVE TYPE")
  return (
    <div className="bg-[#202020] mt-4 p-6 rounded-xl ">
      <h2 className="text-white text-2xl font-bold mb-4">New Leave Request</h2>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col text-white">
          <label>Start Date:</label>
          <input
            type="date"
            value={leaveStart}
            onChange={(e) => setLeaveStart(e.target.value)}
            min={todayStr}
            className="bg-black border-2 px-2 py-1 rounded
             [&::-webkit-calendar-picker-indicator]:invert
             [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
        <div className="flex-1 flex flex-col text-white">
          <label>End Date:</label>
      <input
  type="date"
  value={leaveEnd}
  onChange={(e) => setLeaveEnd(e.target.value)}
  min={leaveStart || todayStr}
  className="bg-black border-2 px-2 py-1 rounded
             [&::-webkit-calendar-picker-indicator]:invert
             [&::-webkit-calendar-picker-indicator]:cursor-pointer"
/>
        </div>
      </div>

      <select
        value={leaveType}
        onChange={(e) => setLeaveType(e.target.value)}
        className="mt-3  w-full  bg-black border-2 px-2 py-1 rounded text-white"
      >
        <option value="" disabled>
          Select Leave Type
        </option>
        <option value="Vacation">Vacation</option>
        <option value="Sick Leave">Sick Leave</option>
        <option value="Personal">Personal</option>
      </select>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        className="mt-3 w-full bg-black border-2 px-2 py-1 rounded text-white"
        rows={3}
      />

      <div className="flex justify-between mt-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border-2 hover:text-red-500 duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 border-2  hover:text-green-500 duration-300"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
      {message && <p className="text-white mt-2">{message}</p>}
    </div>
  );
};

export default TimeOffRequestForm;
