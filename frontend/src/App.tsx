import { useEffect, useState } from 'react'
import './index.css'

interface Employee {
  id: number;
  name: string
  lastname: string
  createdat: string
}
const App = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/allemployees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const addEmployee = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/createemployee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, lastname }),
      });

      const newEmployee = await response.json();
      setEmployees([...employees, newEmployee]); 
      setName("");
      setLastName("");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div className="text-2xl p-4 " >
      <h1 className="text-3xl font-bold mb-4">Employees</h1>

      <form onSubmit={addEmployee} className="flex flex-col mb-6 gap-2">
        <input
          className="text-black p-2 bg-amber-50"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="text-black p-2 bg-amber-50"
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 mt-2 hover:bg-green-600"
        >
          Add Employee
        </button>
      </form>

      <ul className="flex flex-col gap-2">
         {employees?.map((emp,index) => (
          <li key={emp.id} className="p-2 bg-gray-100 rounded text-black">
            {index + 1}. {emp.name} {emp.lastname}
          </li>
        ))}
      </ul>
    </div>
    
  );
};

export default App;
