import express from "express";
import cors from "cors";
import employeesRoutes from "./routes/routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   }),
// );
const allowedOrigins = [
  "https://clockly.it.com",
  "https://www.clockly.it.com",
  "https://clockly-alpha.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("Blocked CORS origin:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", employeesRoutes);

app.listen(PORT, () => {
  console.log(`SERVER HAS STARTED ON PORT ${PORT}`);
});
