import { Router } from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  deleteAllEmployees
} from "../controllers/employeesController.js";

const router = Router();

router.get("/allemployees", getEmployees);
router.get("/employee/:id", getEmployeeById);
router.post("/createemployee", createEmployee);
router.put("/editemployee/:id", updateEmployee);
router.delete("/deleteemployee/:id", deleteEmployee);
router.delete("/deleteallemployees", deleteAllEmployees);

export default router;
