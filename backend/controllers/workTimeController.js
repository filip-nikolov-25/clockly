import {
  createEntry,
  endBreak,
  endWork,
  getEntriesForPeriod,
  getTodayEntry,
  getWorkTimeForAllUsersForWeekCalendarModel,
  startBreak,
} from "../models/workTimeModel.js";

/* START WORK */
export const startWorkController = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const user_id = req.user.id;
    console.log(company_id, "COMPANY ID ASDASD");

    console.log(user_id, "USER ID FROM START WORK");
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

// Previous Month Work Entries
export const previousMonthWorkController = async (req, res) => {
  try {
    const user_id = req.user.id;
    const company_id = req.user.company_id;

    // Current month range
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1); 
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); 

    console.log("Fetching previous month work:", start, end);

    const entries = await getEntriesForPeriod(user_id, company_id, start, end);
    res.json(entries);
  } catch (err) {
    console.error("Previous month fetch failed", err);
    res.status(500).json({ error: "Failed to fetch previous month work" });
  }
};


export const getWorkTimeForAllUsersForWeekCalendarController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; 
    const entries = await getWorkTimeForAllUsersForWeekCalendarModel(startDate, endDate);
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch work entries" });
  }
};

