import express from "express";
import cors from "cors";
import employeesRoutes from "./routes/routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", employeesRoutes);

app.listen(PORT, () => {
  console.log(`SERVER HAS STARTED ON PORT ${PORT}`);
});
