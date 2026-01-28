import { json, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { protect } from "../middleware/auth.js";

const router = Router();
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000, //30 days endinng
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//REGISTER User
router.post("/register", async (req, res) => {
  const { username, email, password, role, religion, company_id, code,country_code } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (userExist.rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  let finalCompanyId;

  if (role === "admin") {
    if (!company_id) {
      return res.status(400).json({ message: "Admins must provide company_id" });
    }
    finalCompanyId = company_id;
  } else {
    if (!code) {
      return res.status(400).json({ message: "Invite code is required for employees" });
    }

    const inviteQuery = await pool.query(
      "SELECT * FROM company_invites WHERE code = $1 AND used_by IS NULL",
      [code]
    );

    if (inviteQuery.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or already used invite code" });
    }

    finalCompanyId = inviteQuery.rows[0].company_id;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    "INSERT INTO users (username, email, password, company_id, role, religion, country_code) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, username, email, company_id, role, religion,country_code",
    [username, email, hashedPassword, finalCompanyId, role || "employee", religion || "none", country_code]
  );

  if (code) {
    await pool.query(
      "UPDATE company_invites SET used_by = $1, used_at = NOW() WHERE code = $2",
      [newUser.rows[0].id, code]
    );
  }

  const token = generateToken(newUser.rows[0].id);
  res.cookie("token", token, cookieOptions);

  return res.status(201).json({ user: newUser.rows[0] });
});

//logic route ,,

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide all required  fields "' });
  }

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (user.rows.length === 0) {
    return res.status(400).json({ message: "Invalid credetials" });
  }

  const userData = user.rows[0];

  const isCorrect = await bcrypt.compare(password, userData.password);

  if (!isCorrect) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = generateToken(userData.id);

  res.cookie("token", token, cookieOptions);

  res.json({
    user: {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      company_id: userData.company_id,
      religion: userData.religion
    },
  });
});

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
  //return info from logged in user from protect middleware
});

router.post("/logout", async (req, res) => {
  res.cookie("token", "", { cookieOptions, maxAge: 1 });
  res.json({ message: " Logged out successfully " });
});
export default router;
