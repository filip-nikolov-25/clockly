import express from "express";
import cors from "cors";
import employeesRoutes from "./routes/employeesRoutes.js";
import db from "./db.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api", employeesRoutes);

app.listen(PORT, () => {
  console.log(`SERVER HAS STARTED ON PORT ${PORT}`);
});
