import React from "react";
import type { userType } from "../interfaces/types";

interface Props {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string>>;
  user: userType | null;
}

const Homepage = ({ error, user }: Props) => {
  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      {user ? (
        <h2>Welcome {user.username}</h2>
      ) : (
        <h2>Please login or register</h2>
      )}
    </div>
  );
};

export default Homepage;
