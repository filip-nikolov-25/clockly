import { useState, useEffect, type FormEvent } from "react";
import type { TimeOffRequest, UserType } from "../interfaces/types";
import axios from "axios";
import Wrapper from "../components/base/Wrapper";
import { formatDateDisplay } from "../helperFunctions";

interface Props {
  user: UserType | null;
}

const Admin = ({ user }: Props) => {
  const [inviteCodes, setInviteCodes] = useState<string[]>([]);
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
    if (inviteCodes.length > 0) {
      setErrorMessage(
        `You still have ${inviteCodes.length} unused invite code(s).`,
      );
      return;
    }
    if (!count || count < 1) {
      setErrorMessage("Please enter an invite code");
      return;
    }

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

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: res.data.status } : r)),
      );
    } catch (err) {
      console.error("Error updating request status:", err);
    }
  };

  useEffect(() => {
    const fetchRemainingInviteCodes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/all-invitecodes",
        );
        console.log(res.data.codes, "RESPONSE Inv code");
        setInviteCodes(res.data.codes);
      } catch (error) {
        console.error("Error getting all inv codes:", error);
      }
    };
    fetchRemainingInviteCodes();
  }, []); //count

  return (
    <Wrapper>
      <div className="text-white min-h-screen p-10">
        <h1 className="text-6xl text-center">Admin Panel</h1>
        <p className="text-center text-3xl mt-10">
          Admin:{" "}
          <span className="font-bold text-orange-400"> {user?.username} </span>
        </p>

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
     {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
          {inviteCodes?.length > 0 && (
            <div className="bg-[#202020] p-7 rounded-xl mt-5">
              <h2 className="text-2xl mb-2">
                Your invite codes for the employees:
              </h2>
              <ul>
                {inviteCodes?.map((code, index) => (
                  <li key={index} className="text-lg text-red-500">
                    <span className="text-white">{index + 1} - </span> {code}
                  </li>
                ))}
              </ul>
            </div>
          )}

         
        </form>

        <div className="mt-16">
          <h2 className="text-4xl mb-10 text-start font-bold ">
            Employee's Absence Requests
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
                    className={`bg-[#202020] ${request.status === "pending" && "shadow-2xl shadow-orange-100"} border border-white/10 rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200`}
                  >
                    <p className="text-2xl font-extrabold mb-2">
                      {request.leave_type}
                    </p>
                    <p className="font-semibold">{request.username}</p>
                    <p className="text-sm text-gray-400">{request.email}</p>
                    <p className="text-sm text-gray-400">{request.reason}</p>

                    <div className="mt-2 flex  justify-between  text-sm">
                      <span className="mr-5 mb-2">
                        Start: {formatDateDisplay(request.start_date)}
                      </span>
                      <span>End: {formatDateDisplay(request.end_date)}</span>
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
                              request.id &&
                              updateRequestStatus(request.id, "accepted")
                            }
                            className="bg-green-500 hover:bg-green-700 px-3 py-1 rounded text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              request.id &&
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
