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
  const { username, email, password } = req.body;

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUserRegistered = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id,username,email",
    [username, email, hashedPassword],
  );

  const token = generateToken(newUserRegistered.rows[0].id);

  res.cookie("token", token, cookieOptions);

  return res.status(201).json({ user: newUserRegistered.rows[0] });
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

  const token = generateToken(userData);

  res.cookie("token", token, cookieOptions);

  res.json({
    user: {
      id: userData.id,
      username: userData.username,
      email: userData.email,
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
