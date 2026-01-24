import { useState, type FormEvent } from "react";
import type { userType } from "../interfaces/types";
import axios from "axios";

interface Props {
  user: userType | null;
}

const Admin = ({ user }: Props) => {
  const [inviteCodes, setInviteCodes] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [count, setCount] = useState(0);

  console.log("scs msg:", successMessage);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!count || count < 1) {
      setErrorMessage("Please enter an invite code");
      setSuccessMessage("");
      return;
    }

    console.log("Submitting invite code:", inviteCodes);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/sendinvite",
        { count },
      );
      setInviteCodes(response.data.codes);
      setErrorMessage("");
    } catch (err: any) {
      console.error(err.response?.data || err);
      setErrorMessage(err.response?.data?.message);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-10">
      <h1 className="text-6xl text-center">Admin Panel</h1>
      <p className="text-center text-3xl mt-10">Welcome, {user?.username}</p>

      <form
        className="mt-10 w-1/3 mx-auto flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label htmlFor="invite" className="mb-3">
            Invite Code:
          </label>
          <input
            type="number"
            min={1}
            max={50}
            placeholder="Enter invite code"
            id="invite"
            value={count}
            onChange={(e) => {
              // setInviteCode(e.target.value)
              setCount(Number(e.target.value));
            }}
            className="border-2  rounded p-2 text-white"
          />
        </div>

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-700 p-3 cursor-pointer rounded text-xl"
        >
          Create Invite Codes
        </button>

        {inviteCodes?.length > 0 && (
          <div className="bg-gray-700 p-10 rounded">
            <h2 className="text-2xl mb-2">
              Your invite codes for the employees:
            </h2>
            <ul className=" ">
              {inviteCodes?.map((code, index) => (
                <li key={index} className="text-lg">
                  {index + 1} {code}
                </li>
              ))}
            </ul>
          </div>
        )}
        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Admin;
