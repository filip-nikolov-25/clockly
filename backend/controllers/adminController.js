import { sendInviteToEmployee } from "../models/adminModel.js";
import crypto from "crypto";

// export const sendInviteController = async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Only admins can create invites" });
//   }

//   try {
//     const { count } = req.body;

//     if (!count) {
//       return res.status(400).json({ message: "Please enter how much employees to invite" });
//     }

//     const company_id = req.user.company_id;
//     const created_by = req.user.id;

//     // const newInvite = await sendInviteToEmployee(code, company_id, created_by);

//     for(let i = 0 ; i< count ; i++){
//         const newGeneratedCode = Math.random().toString(36).substring(2, 10).toUpperCase();

//     }
//     const newInvite = await sendInviteToEmployee(company_id, count, created_by);

//     res.status(201).json({ invite: newInvite });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const generateInviteCode = () => {
  return "INV-" + crypto.randomBytes(6).toString("hex").toUpperCase();
};

export const sendInviteController = async (req, res) => {
  const { count } = req.body;
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can create invites" });
  }

  if ( count < 1) {
    return res.status(400).json({ message: "Enter how much codes to create" });
  }

  const company_id = req.user.company_id;
  const created_by = req.user.id;
  try {

    const codes = [];

    for (let i = 0; i < count; i++) {
      const code = generateInviteCode();

      console.log("Generated:", code);

      const invite = await sendInviteToEmployee(company_id, code, created_by);

      codes.push(invite.code);
    }
  
    res.status(201).json({ codes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
