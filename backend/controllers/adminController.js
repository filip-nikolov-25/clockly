import { sendInviteToEmployee } from "../models/adminModel.js";

export const sendInviteController = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can create invites" });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Invite code is required" });
    }

    const company_id = req.user.company_id;
    const created_by = req.user.id;

    console.log("Received invite creation request with code:", code, "for company_id:", company_id, "by user_id:", created_by);
    // const newInvite = await sendInviteToEmployee(code, company_id, created_by);
    const newInvite = await sendInviteToEmployee(company_id, code, created_by);


    res.status(201).json({ invite: newInvite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
