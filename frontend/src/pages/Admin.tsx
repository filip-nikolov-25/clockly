import { useState, useEffect, type FormEvent } from "react";
import type { TimeOffRequest, userType } from "../interfaces/types";
import axios from "axios";
import Wrapper from "../components/base/Wrapper";
import { formatDate } from "../helperFunctions";

interface Props {
  user: userType | null;
}

const Admin = ({ user }: Props) => {
  const [inviteCodes, setInviteCodes] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [count, setCount] = useState(0);

  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // time off requests for admin
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoadingRequests(true);
        const res = await axios.get(
          "http://localhost:5000/api/requesttimeoff/admin",
        );
        console.log("Admin Time Off Requests:", res.data);
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching admin requests:", err);
      } finally {
        setLoadingRequests(false);
      }
    };
    console.log("Fetching admin time off requests...");

    fetchRequests();
  }, []);

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

  const updateRequestStatus = async (
    id: string,
    status: "accepted" | "rejected",
  ) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/requesttimeoff/admin/${id}`,
        { status },
      );
      console.log("Updated Request Status:", res.data);

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: res.data.status } : r)),
      );
    } catch (err) {
      console.error("Error updating request status:", err);
    }
  };

  return (
    <Wrapper>
      <div className="text-white min-h-screen p-10">
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
              onChange={(e) => setCount(Number(e.target.value))}
              className="border-2 rounded p-2 text-white bg-[#202020] border-white/20"
            />
          </div>

          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 p-3 cursor-pointer rounded text-xl"
          >
            Create Invite Codes
          </button>

          {inviteCodes?.length > 0 && (
            <div className="bg-gray-700 p-10 rounded mt-5">
              <h2 className="text-2xl mb-2">
                Your invite codes for the employees:
              </h2>
              <ul>
                {inviteCodes?.map((code, index) => (
                  <li key={index} className="text-lg">
                    {index + 1}. {code}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
        </form>

        <div className="mt-16">
          <h2 className="text-3xl mb-5 text-center">
            Employees' Time Off Requests
          </h2>

          {loadingRequests ? (
            <p className="text-center text-gray-400">Loading requests...</p>
          ) : requests.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {requests.map((request) => {
                const statusColor =
                  request.status === "accepted"
                    ? "bg-green-500/15 text-green-400 border-green-500/30"
                    : request.status === "rejected"
                      ? "bg-red-500/15 text-red-400 border-red-500/30"
                      : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";

                return (
                  <div
                    key={request.id}
                    className="bg-[#202020] border border-white/10 rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
                  >
                    <p className="font-semibold">{request.username}</p>
                    <p className="text-sm text-gray-400">{request.email}</p>

                    <div className="flex justify-between mt-2 text-sm">
                      <span>{formatDate(request.start_date)}</span>
                      <span>{formatDate(request.end_date)}</span>
                    </div>

                    <span
                      className={`text-xs mt-2 inline-block px-2 py-1 rounded ${statusColor}`}
                    >
                      {request.status.toUpperCase()}
                    </span>

                    <div className="flex justify-end gap-2 mt-3">
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateRequestStatus(request.id, "accepted")
                            }
                            className="bg-green-500 hover:bg-green-700 px-3 py-1 rounded text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              updateRequestStatus(request.id, "rejected")
                            }
                            className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded text-xs"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-5">
              No time off requests found.
            </p>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Admin;
