import { Router } from "express";
import {
  getInviteCodesForEmployeesController,
  sendInviteController,
} from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";
import {
  adminUpdateTimeOffStatusController,
  getEmployeePendingTimeOffController,
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
  currentMonthWorkController,
  startWorkController,
  getMonthlyHoursEmployeeController,
  getPublicHolidaysController,
} from "../controllers/workTimeController.js";
import { getCurrentCompanyController } from "../controllers/employeesController.js";
import {
  getEmployeeNotificationsController,
  getNotificationsController,
  markEmployeeNotificationsReadController,
  updateStatusNotificationController,
} from "../controllers/notificationController.js";

const router = Router();

// invite routes
router.post("/sendinvite", protect, sendInviteController);
router.get("/all-invitecodes", protect, getInviteCodesForEmployeesController);

//Abscence managment routes
router.post("/requesttimeoff", protect, requestTimeOffController);
router.get("/requesttimeoff", protect, getTimeOffRequestsController);
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
router.get(
  "/abscence-availability",
  protect,
  getEmployeePendingTimeOffController,
);

// routes for approved for employee time off
router.get(
  "/users/approved-timeoff",
  protect,
  getUsersWithApprovedTimeOffController,
);

//Measure time api's
router.post("/start", protect, startWorkController);
router.patch("/break-start/:id", protect, breakStartController);
router.patch("/break-end/:id", protect, breakEndController);
router.patch("/end/:id", protect, endWorkController);
router.get("/today", protect, getTodayController);

//get all work time for past month
router.get("/work/previous-month", protect, currentMonthWorkController);
router.get(
  "/work/montly-hours-employees",
  protect,
  getMonthlyHoursEmployeeController,
);

//get all work time for employyes in week calendar
router.get(
  "/weekcalendar/work-time",
  protect,
  getWorkTimeForAllUsersForWeekCalendarController,
);

router.get("/current-company", protect, getCurrentCompanyController);

//notifications
router.get("/notifications", protect, getEmployeeNotificationsController);
router.patch(
  "/notifications/read",
  protect,
  markEmployeeNotificationsReadController,
);

// admin notifications
router.get("/admin-notifications", protect, getNotificationsController);
router.patch(
  "/admin-notifications/read",
  protect,
  updateStatusNotificationController,
);

// public holidays
router.get("/public-holidays", protect, getPublicHolidaysController);
export default router;
