import { useEffect, useState } from "react";
import Wrapper from "../components/base/Wrapper";
import axios from "axios";
import type { AllEmployeeType, UserType } from "../interfaces/types";
import EmployeeCard from "../components/EmployeeCard";
interface Props {
  currentCompany: string;
  user:UserType | null;
}

const EmployeePage = ({ currentCompany, user }: Props) => {
  const [employees, setEmployees] = useState<AllEmployeeType[]>([]);

  useEffect(() => {
    const getAllEmployees = async () => {
      const result = await axios.get(
        "http://localhost:5000/api/work/montly-hours-employees",
      );
      setEmployees(result.data);
    };

    getAllEmployees();
  }, []);
  const updateEmployeeFreeDays = async (user_id: string, free_days: number) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.user_id === user_id
          ? { ...employee, free_days: free_days }
          : employee,
      ),
    );
    try {
      const result = await axios.post(
        "http://localhost:5000/api/users/update-free-days",
        { free_days, user_id },
      );
          setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.user_id === user_id
          ? { ...employee, free_days: result.data.free_days }
          : employee,
      ),
    );
    } catch (error) {}
  };

  return (
    <Wrapper>
      <h1 className=" text-5xl font-extrabold mt-20">
        <span className="text-orange-400">{currentCompany}'s</span> Employees
      </h1>

      <div className="grid grid-cols-3 gap-3 mt-20">
        {employees.map((employee: AllEmployeeType) => (
          <EmployeeCard
          user={user}
            key={employee.user_id}
            employee={employee}
            updateEmployeeFreeDays={updateEmployeeFreeDays}
          />
        ))}
      </div>
    </Wrapper>
  );
};

export default EmployeePage;
