import { useEffect, useState } from "react";
import Wrapper from "../components/base/Wrapper";
import axios from "axios";
import type { AllEmployeeType } from "../interfaces/types";
import {
  formatMinutesToHoursAndMinutes,
} from "../helperFunctions";

interface Props {
  currentCompany: string;
}

const EmployeePage = ({ currentCompany }: Props) => {
  const [employees, setEmployees] = useState<AllEmployeeType[]>([]);
  console.log(employees, "asd");
  useEffect(() => {
    const getAllEmployees = async () => {
      const result = await axios.get(
        "http://localhost:5000/api/work/montly-hours-employees",
      );
      setEmployees(result.data);
    };

    getAllEmployees();
  }, []);

  return (
    <Wrapper>
      <h1 className=" text-5xl font-extrabold mt-20">
        <span className="text-orange-400">{currentCompany}'s</span> Employees
      </h1>

      <div className="grid grid-cols-3 gap-3 mt-20">
        {employees.map((employee) => (
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
            <p className="text-sm text-gray-400">
              Country: {employee.country_code}
            </p>
            <div>
              <span>Role: </span>
              <span
                className={`text-xs ${employee.role === "admin" ? "bg-red-500" : "bg-white/10"} mt-2 inline-block px-2 py-1 rounded `}
              >
                {employee.role.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default EmployeePage;
