import {
  createEntry,
  endBreak,
  endWork,
  getLastMonthWorkTimeModel,
  getMonthlyHoursEmployeeModel,
  getPublicHolidaysModel,
  getTodayEntry,
  getWorkTimeForAllUsersForWeekCalendarModel,
  startBreak,
  updateUserFreeDaysModel,
} from "../models/workTimeModel.js";

/* START WORK */
export const startWorkController = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const user_id = req.user.id;

    const entry = await createEntry(user_id, company_id);
    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Start work failed" });
  }
};

/* BREAK START */
export const breakStartController = async (req, res) => {
  try {
    const { id } = req.params;

    await startBreak(id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Break start failed" });
  }
};

/* BREAK END */
export const breakEndController = async (req, res) => {
  try {
    const { id } = req.params;

    await endBreak(id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Break end failed" });
  }
};

/* END WORK */
export const endWorkController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await endWork(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "End work failed" });
  }
};

//* GET TODAY
export const getTodayController = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const user_id = req.user.id;

    const entry = await getTodayEntry(user_id, company_id);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: "Fetch today failed" });
  }
};

export const getLastMonthWorkTimeController = async (req, res) => {
  try {
    const user_id = req.user.id;
    const company_id = req.user.company_id;

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const params = req.query;
    const limit = parseInt(params.limit) || 6;
    const offset = parseInt(params.offset) || 0;

    const entries = await getLastMonthWorkTimeModel(user_id, company_id, start, end, limit, offset);
    res.json(entries);
  } catch (err) {
    console.error("Previous month fetch failed", err);
    res.status(500).json({ error: "Failed to fetch previous month work" });
  }
};

export const getWorkTimeForAllUsersForWeekCalendarController = async (
  req,
  res,
) => {
  try {
    const { startDate, endDate } = req.query;
    const entries = await getWorkTimeForAllUsersForWeekCalendarModel(
      startDate,
      endDate,
    );
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch work entries" });
  }
};
export const getMonthlyHoursEmployeeController = async (req, res) => {
  try {
    const company_id = req.user.company_id;

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const data = await getMonthlyHoursEmployeeModel(company_id, start, end);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch monthly hours" });
  }
};

export const getPublicHolidaysController = async (req, res) => {
  try {
    const { country_code, start_date, end_date } = req.query;
    if (!country_code || !start_date || !end_date) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const holidays = await getPublicHolidaysModel(
      country_code,
      start_date,
      end_date,
    );
    res.status(200).json(holidays);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching public holidays" });
  }
};

export const updateUserFreeDaysController = async (req,res) => {
  try {
    const { user_id, free_days } = req.body;
    const updatedUser = await updateUserFreeDaysModel(user_id, free_days);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user free days:", error);
    res.status(500).json({ message: "Error updating user free days" });
  }
}