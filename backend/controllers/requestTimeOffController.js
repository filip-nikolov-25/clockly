import { createNotificationModel } from "../models/notificationModel.js";
import {
  sendLeaveRequest,
  getLeaveRequests,
  getTimeOffRequestsForAdminModel,
  adminUpdateTimeOffStatusModel,
  getUsersWithApprovedTimeOffModel,
} from "../models/requestTimeOffModel.js";

export const requestTimeOffController = async (req, res) => {
  const { start_date, end_date, reason,leave_type } = req.body;

  const user_id = req.user.id;
  const company_id = req.user.company_id;

  try {
    const result = await sendLeaveRequest(
      start_date,
      end_date,
      reason,
      user_id,
      company_id,leave_type
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTimeOffRequestsController = async (req, res) => {
  const user_id = req.user.id;
  const company_id = req.user.company_id;

  try {
    const result = await getLeaveRequests(user_id, company_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTimeOffRequestsForAdminController = async (req, res) => {
  const company_id = req.user.company_id;

  try {
    const result = await getTimeOffRequestsForAdminModel(company_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const adminUpdateTimeOffStatusController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const company_id = req.user.company_id;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
  
    const updatedRequest = await adminUpdateTimeOffStatusModel(id, status, company_id);

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    //  Create notification 
    const title = status === "accepted" ? "Time Off Approved" : "Time Off Rejected";
    const message = `Your time off request from ${updatedRequest.start_date} to ${updatedRequest.end_date} has been ${status}.`;

    await createNotificationModel(updatedRequest.user_id, title, message);

 
    res.status(200).json(updatedRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const getUsersWithApprovedTimeOffController = async (req, res) => {
  const company_id = req.user.company_id;

  try {
    const users = await getUsersWithApprovedTimeOffModel(company_id);
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
