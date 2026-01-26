import { Router } from "express";
import {
  createEmployeeController,
  deleteAllEmployeesController,
  deleteEmployeeController,
  getEmployeeByIdController,
  getEmployeesController,
  updateEmployeeController,
} from "../controllers/employeesController.js";
import { sendInviteController } from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";
import { getTimeOffRequestsController, requestTimeOffController } from "../controllers/requestTimeOffController.js";

const router = Router();

router.get("/allemployees", getEmployeesController);
router.get("/employee/:id", getEmployeeByIdController);
router.post("/createemployee", createEmployeeController);
router.put("/editemployee/:id", updateEmployeeController);
router.delete("/deleteemployee/:id", deleteEmployeeController);
router.delete("/deleteallemployees", deleteAllEmployeesController);

//Invite routes 
router.post("/sendinvite",protect, sendInviteController);

router.post("/requesttimeoff", protect,requestTimeOffController )
router.get("/requesttimeoff", protect, getTimeOffRequestsController)
export default router;
