import {
  sendLeaveRequest,
  getLeaveRequests,
  getTimeOffRequestsForAdminModel,
  adminUpdateTimeOffStatusModel,
  getUsersWithApprovedTimeOffModel,
} from "../models/requestTimeOffModel.js";

export const requestTimeOffController = async (req, res) => {
  const { start_date, end_date, reason } = req.body;

  const user_id = req.user.id;
  const company_id = req.user.company_id;

  try {
    const result = await sendLeaveRequest(
      start_date,
      end_date,
      reason,
      user_id,
      company_id,
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

  console.log("Updating Request ID:", id, "to Status:", status);

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const result = await adminUpdateTimeOffStatusModel(id, status, company_id);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
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
