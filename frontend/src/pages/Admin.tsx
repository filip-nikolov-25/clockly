import { useState, type FormEvent } from "react";
import type { userType } from "../interfaces/types";
import axios from "axios";

interface Props {
  user: userType | null;
}

const Admin = ({ user }: Props) => {
  const [inviteCode, setInviteCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  console.log(inviteCode,)
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!inviteCode) {
    setErrorMessage("Please enter an invite code");
    setSuccessMessage("");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/sendinvite",
      { code: inviteCode },
      {
        withCredentials: true, 
      }
    );

    // Success: show the invite code
    setSuccessMessage(`INVITE CODE: ${response.data.invite.code}`);
    setErrorMessage("");
    setInviteCode(""); // clear input
  } catch (err: any) {
    console.error(err.response?.data || err);

    // Show error message from backend if available
    setErrorMessage(
      err.response?.data?.message || "Something went wrong on the server"
    );
    setSuccessMessage("");
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
            type="text"
            placeholder="Enter invite code"
            id="invite"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="border-2  rounded p-2 text-white"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 p-3 rounded text-xl"
        >
          Create Invite
        </button>

        {successMessage && (
          <p className="text-green-400 mt-3">{successMessage}</p>
        )}
        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Admin;
