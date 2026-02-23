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
import { updateUserRemainingLeaveModel } from "../models/workTimeModel.js";


 const countLeaveDays = (startDate, endDate, holidays = []) => {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  const holidaySet = new Set(holidays);

  while (current <= end) {
    const day = current.getDay(); 
    const dateStr = current.toISOString().split("T")[0];

    const isWeekend = day === 0 || day === 6;
    const isHoliday = holidaySet.has(dateStr);

    if (!isWeekend && !isHoliday) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

export const requestTimeOffController = async (req, res) => {
  const { start_date, end_date, reason, leave_type } = req.body;
  const user_id = req.user.id;
  const company_id = req.user.company_id;
  const employeeCountry = req.user.country_code;

  const { userRequestedAbscence } = await getEmployeePendingTimeOffModel(user_id);
  if (userRequestedAbscence) {
    return res.status(400).json({
      message: "You already have an active absence request.",
    });
  }

  try {
const year = new Date(start_date).getFullYear();

const holidayResponses = await Promise.all(
  targetCountries.map(async (c) => {
    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${c}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch holidays for ${c}`);
    }

    return res.json();
  })
);

const allHolidays = holidayResponses.flat();

    const employeeHolidays = allHolidays
      .filter((h) => h.countryCode === employeeCountry)
      .map((h) => h.date); 


    const totalLeaveDays = countLeaveDays(start_date, end_date, employeeHolidays);
    console.log(`Total leave days counted (working days only): ${totalLeaveDays}`);

    
    const user = await getUserById(user_id); 
    if (!user) throw new Error("User not found");

    if (totalLeaveDays > user.remaining_leave) {
      return res.status(400).json({
        message: `You only have ${user.remaining_leave} leave days remaining.`,
      });
    }

    await updateUserRemainingLeaveModel(user_id, user.remaining_leave - totalLeaveDays);


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
