import type { userType } from "../interfaces/types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface props {
  user?: userType | null;
  setUser: (user: userType | null) => void;
}

const NavBar = ({ user, setUser }: props) => {
  const navigate = useNavigate();
  return (
    <ul className="flex justify-between items-center px-5 py-3 bg-black text-white">
      <Link to="/">
        <li className="cursor-pointer hover:text-indigo-500">Home</li>
      </Link>

      <div className="flex gap-4">
        {user ? (
          <li>
            <button
              onClick={async () => {
                await axios.post("http://localhost:5000/api/auth/logout");
                setUser(null);
                navigate("/login");
              }}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
            >
              Logout
            </button>
          </li>
        ) : (
          <>
            <Link to="/login">
              <li className="cursor-pointer hover:text-indigo-500">Login</li>
            </Link>
            <Link to="/register">
              <li className="cursor-pointer hover:text-indigo-500">Register</li>
            </Link>
          </>
        )}
      </div>
    </ul>
  );
};

export default NavBar;
