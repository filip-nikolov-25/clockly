import { Router } from "express";
import { sendInviteController } from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";
import {
  adminUpdateTimeOffStatusController,
  getTimeOffRequestsController,
  getTimeOffRequestsForAdminController,
  getUsersWithApprovedTimeOffController,
  requestTimeOffController,
} from "../controllers/requestTimeOffController.js";
import {
  breakEndController,
  breakStartController,
  endWorkController,
  getTodayController,
  getWorkTimeForAllUsersForWeekCalendarController,
  previousMonthWorkController,
  startWorkController,
} from "../controllers/workTimeController.js";
import { getCurrentCompanyController } from "../controllers/employeesController.js";
import { getNotificationsByUserController } from "../controllers/notificationController.js";

const router = Router();

// i nvite routes
router.post("/sendinvite", protect, sendInviteController);

router.post("/requesttimeoff", protect, requestTimeOffController);
router.get("/requesttimeoff", protect, getTimeOffRequestsController);

//ADMIN ROUTES
router.get(
  "/requesttimeoff/admin",
  protect,
  getTimeOffRequestsForAdminController,
);
router.patch(
  "/requesttimeoff/admin/:id",
  protect,
  adminUpdateTimeOffStatusController,
);
// routes for approved for employee time off
router.get(
  "/users/approved-timeoff",
  protect,
  getUsersWithApprovedTimeOffController,
);

router.post("/start", protect, startWorkController);
router.patch("/break-start/:id", protect, breakStartController);
router.patch("/break-end/:id", protect, breakEndController);
router.patch("/end/:id", protect, endWorkController);
router.get("/today", protect, getTodayController);

//get all work time for past month
router.get("/work/previous-month", protect, previousMonthWorkController);

//get all work time for employyes in week calendar
router.get(
  "/weekcalendar/work-time",
  protect,
  getWorkTimeForAllUsersForWeekCalendarController,
);

router.get("/current-company",protect,getCurrentCompanyController);


//MOTIFICATIONS
router.get("/notifications", protect,getNotificationsByUserController)

export default router;
