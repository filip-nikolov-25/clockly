import { useEffect, useState } from "react";
import Wrapper from "../components/base/Wrapper";
import axios from "axios";
import { Users, Search, ShieldCheck, Clock3 } from "lucide-react";
import type { AllEmployeeType, UserType } from "../interfaces/types";
import EmployeeCard from "../components/EmployeeCard";

interface Props {
  currentCompany: string;
  user: UserType | null;
}

const EmployeePage = ({ currentCompany, user }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [employees, setEmployees] = useState<AllEmployeeType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllEmployees = async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `${API_URL}/api/work/montly-hours-employees`,
        );
        setEmployees(result.data);
      } catch (error) {
        console.error("Failed to load employees", error);
      } finally {
        setLoading(false);
      }
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
      const result = await axios.post(`${API_URL}/api/users/update-free-days`, {
        free_days,
        user_id,
      });

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.user_id === user_id
            ? { ...employee, free_days: result.data.free_days }
            : employee,
        ),
      );
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Wrapper>
      <div className="mt-8 md:mt-16 mb-8 md:mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
            <Users size={20} />
          </div>
          <span className="text-zinc-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px]">
            Workforce Directory
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight md:leading-none">
          <span className="text-orange-500">{currentCompany}</span> Employees
        </h1>

        {user?.role === "admin" && (
          <div className="mt-4 flex items-center gap-2 text-zinc-500">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider italic">
              Admin Access Enabled
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-10 items-center justify-between">
        <div className="relative w-full md:w-80 lg:w-96 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner text-sm md:text-base"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="hidden sm:block w-px h-8 bg-zinc-800 mx-1 md:mx-2" />
          <div className="text-zinc-500 font-bold text-xs md:text-sm px-2 whitespace-nowrap">
            Total:{" "}
            <span className="text-white">{filteredEmployees.length}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Clock3 size={28} className="text-orange-500 animate-spin" />
          <p className="text-zinc-500 font-medium text-sm">
            Syncing company employees...
          </p>
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
          {filteredEmployees.map((employee: AllEmployeeType) => (
            <div
              key={employee.user_id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <EmployeeCard
                user={user}
                employee={employee}
                updateEmployeeFreeDays={updateEmployeeFreeDays}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 md:py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl md:rounded-[3rem] bg-zinc-900/10 px-4">
          <Users className="mx-auto text-zinc-800 mb-4" size={40} />
          <h3 className="text-zinc-500 text-xs md:text-sm font-black uppercase tracking-widest">
            No Employees Found
          </h3>
          <p className="text-zinc-700 text-[11px] md:text-sm font-medium mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </Wrapper>
  );
};

export default EmployeePage;
