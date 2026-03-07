import { useState } from "react";
import axios from "axios";
import type { UserType } from "../interfaces/types";

interface TimeOffRequestFormProps {
  onClose: () => void;
  onSubmitted?: () => void;
  user: UserType | null;
}

const TimeOffRequestForm = ({
  onClose,
  onSubmitted,user
}: TimeOffRequestFormProps) => {
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const handleSubmit = async () => {
    if(user?.free_days === 0){
      setErrorMessage("You don't have any free days left!");
      return;
    }
    if (!leaveStart || !leaveEnd || !leaveType) {
      setErrorMessage("Please fill all required fields!");
      return;
    }

    const start = new Date(leaveStart);
    const end = new Date(leaveEnd);
  
    
const diffTime = end.getTime() - start.getTime();
const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;




    if (start.getTime() < today.getTime()) {
      setErrorMessage("Start date cannot be in the past!");
      return;
    }

    if (end.getTime() < start.getTime()) {
      setErrorMessage("End date cannot be before start date!");
      return;
    }

    if (requestedDays > user!.free_days! ) {
      setErrorMessage(
        `You only have ${user!.free_days} free days left, but you requested ${requestedDays} days!`,
      );
      return;
    }
    setLoading(true);
    setErrorMessage("");

    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/abscence-availability",
      );

      if (data.userRequestedAbscence) {
        setErrorMessage("You already have an active absence request.");
        setLoading(false);
        return;
      }

      await axios.post("http://localhost:5000/api/requesttimeoff", {
        start_date: leaveStart,
        end_date: leaveEnd,
        leave_type: leaveType,
        reason,

      });

      setSuccessMessage("Request submitted successfully!");
      setLeaveStart("");
      setLeaveEnd("");
      setLeaveType("");
      setReason("");

      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Error submitting request.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-[#202020] mt-4 p-6 rounded-xl ">
      <h2 className="text-white text-2xl font-bold mb-4">
        New Absence Request
      </h2>

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
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      {successMessage && (
        <p className="text-green-500 mt-2">{successMessage}</p>
      )}
    </div>
  );
};

export default TimeOffRequestForm;
