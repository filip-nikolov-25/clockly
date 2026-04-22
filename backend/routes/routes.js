import { Router } from "express";
import {
  getInviteCodesForEmployeesController,
  sendInviteController,
} from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";
import {
  getEmployeePendingTimeOffController,
  getLeaveRequestsForAdminController,
  getLeaveRequestsForEmployeeController,
  getUsersWithApprovedTimeOffController,
  requestLeaveController,
  updateAdminLeaveRequestStatusController,
} from "../controllers/requestLeaveController.js";
import {
  breakEndController,
  breakStartController,
  endWorkController,
  getTodayController,
  getWorkTimeForAllUsersForWeekCalendarController,
  startWorkController,
  getMonthlyHoursEmployeeController,
  getPublicHolidaysController,
  updateUserFreeDaysController,
  getLastMonthWorkTimeController,
} from "../controllers/workTimeController.js";
import { getCurrentCompanyController } from "../controllers/employeesController.js";
import {
  getEmployeeNotificationsController,
  getNotificationsForAdminController,
  markEmployeeNotificationsReadController,
  updateStatusNotificationController,
} from "../controllers/notificationController.js";

const router = Router();

// invite routes
router.post("/sendinvite", protect, sendInviteController);
router.get("/all-invitecodes", protect, getInviteCodesForEmployeesController);

//Abscence managment routes
router.post("/request-leave", protect, requestLeaveController);
router.get("/employee-leave-requests", protect, getLeaveRequestsForEmployeeController);
router.get(
  "/request-leave/admin",
  protect,
  getLeaveRequestsForAdminController,
);
router.patch(
  "/update-leave-status/admin/:id",
  protect,
  updateAdminLeaveRequestStatusController,
);
router.get(
  "/abscence-availability",
  protect,
  getEmployeePendingTimeOffController,
);
router.post(
  "/users/update-free-days",
  protect,
  updateUserFreeDaysController,
);

// routes for approved for employee time off for WEEK CALENDAR
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
router.get("/work/previous-month", protect, getLastMonthWorkTimeController);
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
router.get("/admin-notifications", protect, getNotificationsForAdminController);
router.patch(
  "/admin-notifications/read",
  protect,
  updateStatusNotificationController,
);

// public holidays
router.get("/public-holidays", getPublicHolidaysController);
export default router;
