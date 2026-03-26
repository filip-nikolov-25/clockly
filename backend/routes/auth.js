import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { protect } from "../middleware/auth.js";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { sendPasswordResetEmail } from "../controllers/services/sendPassResetEmail.js";

const router = Router();
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    message: "Too many requests, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//REGISTER user
router.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    religion,
    company_id,
    code,
    country_code,
  } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (userExist.rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  let finalCompanyId;
  if (role === "admin") {
    if (!company_id) {
      return res
        .status(400)
        .json({ message: "Admins must provide company_id" });
    }
    finalCompanyId = company_id;
  } else {
    if (!code) {
      return res
        .status(400)
        .json({ message: "Invite code is required for employees" });
    }
    const inviteQuery = await pool.query(
      "SELECT * FROM company_invites WHERE code = $1 AND used_at IS NULL",
      [code],
    );
    if (inviteQuery.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or already used invite code" });
    }
    finalCompanyId = inviteQuery.rows[0].company_id;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await pool.query(
    "INSERT INTO users (username, email, password, company_id, role, religion, country_code, free_days) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, username, email, company_id, role, religion,country_code, free_days",
    [
      username,
      email,
      hashedPassword,
      finalCompanyId,
      role || "employee",
      religion || "none",
      country_code,
      20,
    ],
  );

  if (code) {
    await pool.query(
      "UPDATE company_invites SET created_by = $1, used_at = NOW() WHERE code = $2",
      [newUser.rows[0].id, code],
    );
  }

  const token = generateToken(newUser.rows[0].id);
  res.cookie("token", token, cookieOptions);
  return res.status(201).json({ user: newUser.rows[0] });
});

//LOGIN Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (user.rows.length === 0) {
    return res.status(400).json({ message: "Invalid credentials" });
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
      religion: userData.religion,
      free_days: userData.free_days,
      country_code: userData.country_code,
    },
  });
});

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

router.post("/logout", async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: " Logged out successfully " });
});

// FORGOT pass
router.post("/forgot-password", passwordResetLimiter, async (req, res) => {
  const { email } = req.body;
  try {
    const fetchUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (fetchUser.rows.length === 0) {
      return res.json({
        message: "If an account exists, a reset link has been sent.",
      });
    }

    const user = fetchUser.rows[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await pool.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
      [hashedToken, expires, user.id],
    );

   const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetURL);

    res.json({ message: "If an account exists, a reset link has been sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const { rows } = await pool.query(
    "SELECT id, reset_password_token FROM users WHERE reset_password_expires > NOW() AND reset_password_token IS NOT NULL",
  );

  let user = null;
  for (const searchingUser of rows) {
    if (await bcrypt.compare(token, searchingUser.reset_password_token)) {
      user = searchingUser;
      break;
    }
  }

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
    [hashedPassword, user.id],
  );

  res.json({ message: "Password updated successfully" });
});

export default router;
