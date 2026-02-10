import { createNotificationModel, updateAdminNotificationsModel, updateEmployeeNotificationsModel } from "../models/notificationModel.js";
import {
  sendLeaveRequest,
  getLeaveRequests,
  getTimeOffRequestsForAdminModel,
  adminUpdateTimeOffStatusModel,
  getUsersWithApprovedTimeOffModel,
  getEmployeePendingTimeOffModel,
} from "../models/requestTimeOffModel.js";
import { format } from "date-fns";
export const requestTimeOffController = async (req, res) => {
  const { start_date, end_date, reason, leave_type } = req.body;
  const user_id = req.user.id;
  const company_id = req.user.company_id;

      const { userRequestedAbscence } = await getEmployeePendingTimeOffModel(user_id);
    if (userRequestedAbscence) {
      return res.status(400).json({
        message: "You already have an active absence request.",
      });
    }


  try {
    const result = await sendLeaveRequest(
      start_date,
      end_date,
      reason,
      user_id,
      company_id,
      leave_type
    );

    const startStr = format(new Date(start_date), "dd MMM yyyy");
    const endStr = format(new Date(end_date), "dd MMM yyyy");


    const title = "New Time Off Request";
    const message = `${req.user.username} requested time off from ${startStr} to ${endStr}.`;

    await createNotificationModel({
      user_id: null,         
      title,
      message,
      company_id,
      target_role: "admin",    
    });


    res.status(201).json(result);
  } catch (error) {
    console.error(error);
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
    const startStr = format(new Date(updatedRequest.start_date), "dd MMM yyyy");
    const endStr = format(new Date(updatedRequest.end_date), "dd MMM yyyy");

    const title = status === "accepted" ? "Time Off Approved" : "Time Off Rejected";
    const message = `Your time off request from ${startStr} to ${endStr} has been ${status}.`;


    await createNotificationModel({
      user_id: updatedRequest.user_id,
      title,
      message,
      company_id,
      target_role: "employee",
    });

 
    await updateAdminNotificationsModel(company_id);


    res.status(200).json({
      ...updatedRequest,
      start_date_formatted: startStr,
      end_date_formatted: endStr,
      notification_message: message,
    });
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
export const getEmployeePendingTimeOffController = async (req, res) => {
  const user_id = req.user.id;

  try {
    const response = await getEmployeePendingTimeOffModel(user_id);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
