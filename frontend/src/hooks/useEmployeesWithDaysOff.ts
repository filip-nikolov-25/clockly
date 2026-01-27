import { useState, useEffect } from "react";
import axios from "axios";

interface TimeOff {
  start_date: string;
  end_date: string;
  status: "accepted";
}

interface Employee {
  user_id: string;
  username: string;
  email: string;
  leaves?: TimeOff[];
  daysOff?: string[];
}

const formatLeavesToDays = (leaves: TimeOff[] = []) => {
  const days: string[] = [];
  leaves.forEach((leave) => {
    if (!leave.start_date || !leave.end_date) return;
    let current = new Date(leave.start_date);
    const end = new Date(leave.end_date);
    while (current <= end) {
      days.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  });
  return days;
};

const useEmployeesWithDaysOff = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/approved-timeoff",
          {},
        );

        const map = new Map<string, Employee>();
        res.data.forEach((row: any) => {
          if (!map.has(row.user_id)) {
            map.set(row.user_id, {
              user_id: row.user_id,
              username: row.username,
              email: row.email,
              leaves: [],
            });
          }
          if (row.start_date && row.status === "accepted") {
            map.get(row.user_id)?.leaves?.push({
              start_date: row.start_date,
              end_date: row.end_date,
              status: row.status,
            });
          }
        });

        const usersWithDaysOff = Array.from(map.values()).map((user) => ({
          ...user,
          daysOff: formatLeavesToDays(user.leaves),
        }));

        setEmployees(usersWithDaysOff);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, loading };
};

export default useEmployeesWithDaysOff;
