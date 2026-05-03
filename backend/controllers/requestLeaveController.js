import {
  createNotificationModel,
  updateAdminNotificationsModel,
} from "../models/notificationModel.js";
import {
  getUsersWithApprovedTimeOffModel,
  getEmployeePendingTimeOffModel,
  getLeaveRequestsForEmployeeModel,
  sendLeaveRequestForEmployee,
  getLeaveRequestsForAdminModel,
  updateAdminLeaveRequestStatusModel,
} from "../models/requestLeaveModel.js";
import { format } from "date-fns";
import {
  getPublicHolidaysModel,
  updateUserRemainingLeaveModel,
} from "../models/workTimeModel.js";
import { getEmployeeById } from "../models/employeesModel.js";
import { calculateWorkingDays, formatDateLocal } from "../utils/dateUtils.js";
import { getAdminEmailByCompanyId } from "../models/adminModel.js";
import { sendLeaveRequestEmailToAdmin } from "./services/sendLeaveRequests.js";
import { sendLeaveStatusEmailToEmployee } from "./services/sendLeaveStatusEmailToEmployee.js";

export const requestLeaveController = async (req, res) => {
  const { start_date, end_date, reason, leave_type } = req.body;
  const user_id = req.user.id;
  const country_code = req.user.country_code;
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
    const publicHolidays = await getPublicHolidaysModel(
      country_code,
      start_date,
      end_date,
    );
    const holidayDates = publicHolidays.map((h) => {
      return formatDateLocal(h.date);
    });

    const workingDays = calculateWorkingDays(
      start_date,
      end_date,
      holidayDates,
    );
    const result = await sendLeaveRequestForEmployee(
      start_date,
      end_date,
      reason,
      user_id,
      company_id,
      leave_type,
      workingDays,
    );

    const startStr = format(new Date(start_date), "dd MMM yyyy");
    const endStr = format(new Date(end_date), "dd MMM yyyy");
    const adminEmails = await getAdminEmailByCompanyId(company_id);

    await Promise.allSettled(
      adminEmails.map((admin) =>
        sendLeaveRequestEmailToAdmin({
          adminEmail: admin.email,
          username: req.user.username,
          startStr,
          endStr,
          leave_type,
          reason,
        }),
      ),
    );
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

export const getLeaveRequestsForEmployeeController = async (req, res) => {
  const user_id = req.user.id;
  const company_id = req.user.company_id;

  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const startDate = req.query.startDate || null;
  const endDate = req.query.endDate || null;

  try {
    const result = await getLeaveRequestsForEmployeeModel(
      user_id,
      company_id,
      limit,
      offset,
      startDate,
      endDate,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLeaveRequestsForAdminController = async (req, res) => {
  const company_id = req.user.company_id;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const employee = req.query.employee || null;
  const startDate = req.query.startDate || null;
  const endDate = req.query.endDate || null;

  try {
    const result = await getLeaveRequestsForAdminModel(
      company_id,
      limit,
      offset,
      employee,
      startDate,
      endDate,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAdminLeaveRequestStatusController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const company_id = req.user.company_id;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updatedRequest = await updateAdminLeaveRequestStatusModel(
      id,
      status,
      company_id,
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    let calculateTotalLeaveDays;

    if (status === "accepted") {
      const { user_id, start_date, end_date, leave_type } = updatedRequest;

      const user = await getEmployeeById(user_id);
      if (!user) throw new Error("User not found");

      const employeeCountry = user.country_code;

      const publicHolidays = await getPublicHolidaysModel(
        employeeCountry,
        start_date,
        end_date,
      );

      const holidayDates = publicHolidays.map((h) => formatDateLocal(h.date));

      const totalRequestedLeaveDays = calculateWorkingDays(
        start_date,
        end_date,
        holidayDates,
      );

      const freeDays = Number(user.free_days || 0);

      if (!Number.isFinite(freeDays)) {
        throw new Error("Invalid free_days value");
      }

      if (leave_type !== "Sick Leave" && totalRequestedLeaveDays > freeDays) {
        return res.status(400).json({
          message: `User only has ${freeDays} leave days remaining.`,
        });
      }

      if (leave_type !== "Sick Leave") {
        calculateTotalLeaveDays = freeDays - totalRequestedLeaveDays;

        await updateUserRemainingLeaveModel(user_id, calculateTotalLeaveDays);
      } else {
        calculateTotalLeaveDays = freeDays;
      }
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

    const employee = await getEmployeeById(updatedRequest.user_id);

    let emailResult = null;

    if (employee?.email) {
      emailResult = await sendLeaveStatusEmailToEmployee({
        employeeEmail: employee.email,
        username: employee.username,
        startStr,
        endStr,
        status,
      });

    } else {
      console.error("Employee email missing, skipping email send");
    }

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
  const { startDate, endDate } = req.query;
  try {
    const users = await getUsersWithApprovedTimeOffModel(
      company_id,
      startDate,
      endDate,
    );
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
