import {
  getInviteCodesForEmployeesModel,
  sendInviteToEmployee,
} from "../models/adminModel.js";
import crypto from "crypto";

const generateInviteCode = () => {
  return "INV-" + crypto.randomBytes(6).toString("hex").toUpperCase();
};

export const sendInviteController = async (req, res) => {
  const { count } = req.body;
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can create invites" });
  }

  if (count < 1) {
    return res.status(400).json({ message: "Enter how much codes to create" });
  }

  const company_id = req.user.company_id;
  const created_by = req.user.id;
  try {
    const codes = [];

    for (let i = 0; i < count; i++) {
      const code = generateInviteCode();

      const invite = await sendInviteToEmployee(company_id, code, created_by);

      codes.push(invite.code);
    }

    res.status(201).json({ codes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getInviteCodesForEmployeesController = async (req, res) => {
  const company_id = req.user.company_id;
  try {
    const inviteCodes = await getInviteCodesForEmployeesModel(company_id);

    const codeList = inviteCodes.map((c) => c.code);

    return res.status(200).json({ codes: codeList });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
