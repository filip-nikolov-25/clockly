import {
  createNotificationModel,
  updateAdminNotificationsModel,
} from "../models/notificationModel.js";
import {
  sendLeaveRequest,
  getLeaveRequests,
  getTimeOffRequestsForAdminModel,
  adminUpdateTimeOffStatusModel,
  getUsersWithApprovedTimeOffModel,
  getEmployeePendingTimeOffModel,
} from "../models/requestTimeOffModel.js";
import { format } from "date-fns";
import {
  getPublicHolidaysModel,
  updateUserRemainingLeaveModel,
} from "../models/workTimeModel.js";
import { getEmployeeById } from "../models/employeesModel.js";

export const countLeaveDays = (startDate, endDate, holidays = []) => {
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
  const user = req.user;
  if (!user) throw new Error("User not found");
  try {
    const { userRequestedAbscence } =
      await getEmployeePendingTimeOffModel(user_id);

    if (userRequestedAbscence) {
      return res.status(400).json({
        message: "You already have an active absence request.",
      });
    }

    const result = await sendLeaveRequest(
      start_date,
      end_date,
      reason,
      user_id,
      company_id,
      leave_type,
    );

    const startStr = format(new Date(start_date), "dd MMM yyyy");
    const endStr = format(new Date(end_date), "dd MMM yyyy");

    await createNotificationModel({
      user_id: null,
      title: "New Time Off Request",
      message: `${req.user.username} requested time off from ${startStr} to ${endStr}.`,
      company_id,
      target_role: "admin",
    });

    res.status(201).json({
      result,
    });
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
    const updatedRequest = await adminUpdateTimeOffStatusModel(
      id,
      status,
      company_id,
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    let calculateTotalLeaveDays;

    if (status === "accepted") {
      const { user_id, start_date, end_date } = updatedRequest;

      const user = await getEmployeeById(user_id);
      if (!user) throw new Error("User not found");

      const employeeCountry = user.country_code;

      const publicHolidays = await getPublicHolidaysModel(
        employeeCountry,
        start_date,
        end_date,
      );

      const holidayDates = publicHolidays.map((h) => h.date);

      const totalRequestedLeaveDays = countLeaveDays(
        start_date,
        end_date,
        holidayDates,
      );

      const freeDays = Number(user.free_days || 0);
      calculateTotalLeaveDays = freeDays - totalRequestedLeaveDays;

      if (!Number.isFinite(freeDays)) {
        throw new Error("Invalid free_days value");
      }

      if (totalRequestedLeaveDays > freeDays) {
        return res.status(400).json({
          message: `User only has ${freeDays} leave days remaining.`,
        });
      }

      await updateUserRemainingLeaveModel(
        user_id,
        calculateTotalLeaveDays,
      );
    }

    const startStr = format(new Date(updatedRequest.start_date), "dd MMM yyyy");
    const endStr = format(new Date(updatedRequest.end_date), "dd MMM yyyy");

    const title =
      status === "accepted" ? "Time Off Approved" : "Time Off Rejected";

    const message = `Your time off request from ${startStr} to ${endStr} has been ${status}.`;

    await createNotificationModel({
      user_id: updatedRequest.user_id,
      title,
      message,
      company_id,
      target_role: "employee",
    });

    await updateAdminNotificationsModel(company_id);

    const responsePayload = {
      ...updatedRequest,
      start_date_formatted: startStr,
      end_date_formatted: endStr,
      notification_message: message,
    };

    if (status === "accepted") {
      responsePayload.free_days = calculateTotalLeaveDays;
    }

    return res.status(200).json(responsePayload);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const getUsersWithApprovedTimeOffController = async (req, res) => {
  const company_id = req.user.company_id;
  const {startDate,endDate} = req.query;
  try {
    const users = await getUsersWithApprovedTimeOffModel(company_id,startDate,endDate);
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
