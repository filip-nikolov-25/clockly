import pool from "../db.js";

export const createEntry = async (userId, companyId) => {
  const result = await pool.query(
    `
    INSERT INTO worktime_employees (user_id, company_id, start_time, work_date)
    VALUES ($1, $2, NOW(), CURRENT_DATE)
    RETURNING *
    `,
    [userId, companyId]
  );

  return result.rows[0];
};
//start break
export const startBreak = async (entryId) => {
  await pool.query(
    `
    UPDATE worktime_employees
    SET break_start = NOW()
    WHERE id = $1
    `,
    [entryId]
  );
};
//end break
export const endBreak = async (entryId) => {
  await pool.query(
    `
    UPDATE worktime_employees
    SET break_end = NOW()
    WHERE id = $1
    `,
    [entryId]
  );
};
// end work
export const endWork = async (entryId) => {
  const result = await pool.query(
    `
    UPDATE worktime_employees
    SET end_time = NOW(),
        total_minutes =
          EXTRACT(EPOCH FROM (
            NOW() - start_time
            - COALESCE(break_end - break_start, '0')
          )) / 60
    WHERE id = $1
    RETURNING total_minutes
    `,
    [entryId]
  );

  return result.rows[0];
};
// Get this for my status to fetch the today work and for clock when starting to work aka onClick START 
export const getTodayEntry = async (userId, companyId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM worktime_employees
    WHERE user_id = $1
      AND company_id = $2
      AND work_date = CURRENT_DATE
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [userId, companyId]
  );

  return result.rows[0];
};
// // get working time for employee past 30 days 
export const getEntriesForPeriod = async (user_id, company_id, startDate, endDate) => {
  const query = `
    SELECT *,
      (total_minutes - EXTRACT(EPOCH FROM break_end - break_start)/60) AS worked_minutes,
      (EXTRACT(EPOCH FROM break_end - break_start)/60) AS break_minutes
    FROM worktime_employees
    WHERE user_id = $1
      AND company_id = $2
      AND work_date BETWEEN $3 AND $4
    ORDER BY work_date ASC
  `;
  const values = [user_id, company_id, startDate, endDate];
  const result = await pool.query(query, values);
  return result.rows;
};

export const getWorkTimeForAllUsersForWeekCalendarModel= async (startDate, endDate) => {
  const query = `
    SELECT
      user_id,
      work_date::date AS work_date, -- just the date, no timezone
      total_minutes,
      (COALESCE(total_minutes, 0) - COALESCE(EXTRACT(EPOCH FROM break_end - break_start)/60, 0)) AS worked_minutes
    FROM worktime_employees
    WHERE work_date BETWEEN $1 AND $2
  `;
  const result = await pool.query(query, [startDate, endDate]);
  return result.rows;
};

