import { useState } from "react";
import { formatMinutesToHoursAndMinutes } from "../helperFunctions";
import type { AllEmployeeType, UserType } from "../interfaces/types";

interface Props {
  employee: AllEmployeeType;
  user:UserType | null;
  updateEmployeeFreeDays:(user_id:string, free_days:number) => void;
}
const EmployeeCard = ({ employee, user, updateEmployeeFreeDays }: Props) => {
    const [freeDaysInput, setFreeDaysInput] = useState<number>(employee.free_days);
  return (
    <div
      key={employee.user_id}
      className="bg-[#202020] border border-white/10 rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
    >
      <p className="text-3xl font-extrabold mb-2">{employee.username}</p>
      <p className="text-lg text-gray-400">
        Worked this month :{" "}
        <span className="text-orange-400 font-bold">
          {formatMinutesToHoursAndMinutes(employee.worked_minutes)}
        </span>
      </p>
      <p className="text-sm text-gray-400">Email: {employee.email}</p>
      <p className="text-sm text-gray-400">Country: {employee.country_code}</p>
      <div>
        <span>Role: </span>
        <span
          className={`text-xs ${employee.role === "admin" ? "bg-red-500" : "bg-white/10"} mt-2 inline-block px-2 py-1 rounded `}
        >
          {employee.role.toUpperCase()}
        </span>
      </div>
    { user?.role === "admin" && <div>
        <input
        type="text"
        onChange={(e) => setFreeDaysInput(Number(e.target.value))}
        value={freeDaysInput}
        className="mt-3 w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
      />{" "}
      <button
        className="mt-3 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition"
        onClick={() => updateEmployeeFreeDays(employee.user_id, freeDaysInput)}
      >
        Update Free Days
      </button>
      </div>}
    </div>
  );
};

export default EmployeeCard;
