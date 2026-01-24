import React from "react";
import type { userType } from "../interfaces/types";

interface Props {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string>>;
  user: userType | null;
}

const Homepage = ({ error, user }: Props) => {
  console.log("Current User in Homepage:", user?.role);
  return (
    <div className="bg-black text-white">
      {/* {error && <div className="text-red-500">{error}</div>}
      {user ? (
        <h2>Welcome {user.username}</h2>
      ) : (
        <h2>Please login or register</h2>
      )} */}

      <div className="flex justify-center p-20 items-center">
        <div>
          <h1 className="mb-10 text-center font-bold text-9xl">Clockly</h1>
          <h2 className="text-center text-3xl text-orange-300 font-bold">Modern time management, Simple,elegant,powerfull.</h2>
          <div className="text-center mt-10 ">

          <button className=" px-10 py-3 rounded-lg hover:bg-orange-300 hover:text-white bg-white text-black mb-20">Get started</button>
          </div>
        </div>
      </div>
      <div className=" bg-black py-[550px]"></div>
    </div>
  );
};

export default Homepage;
