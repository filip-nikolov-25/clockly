import db from "../db.js";

export const createEntry = async (userId, companyId) => {
  const result = await db.query(
    `
    INSERT INTO worktime_employees (user_id, company_id, start_time, work_date)
    VALUES ($1, $2, NOW(), CURRENT_DATE)
    RETURNING *
    `,
    [userId, companyId],
  );

  return result.rows[0];
};
//start break
export const startBreak = async (entryId) => {
  await db.query(
    `
    UPDATE worktime_employees
    SET break_start = NOW()
    WHERE id = $1
    `,
    [entryId],
  );
};
//end break
export const endBreak = async (entryId) => {
  await db.query(
    `
    UPDATE worktime_employees
    SET break_end = NOW()
    WHERE id = $1
    `,
    [entryId],
  );
};
// end work
export const endWork = async (entryId) => {
  const result = await db.query(
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
    [entryId],
  );

  return result.rows[0];
};
// Get this for my status to fetch the today work and for clock when starting to work aka onClick START
export const getTodayEntry = async (userId, companyId) => {
  const result = await db.query(
    `
    SELECT *
    FROM worktime_employees
    WHERE user_id = $1
      AND company_id = $2
      AND work_date = CURRENT_DATE
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [userId, companyId],
  );

  return result.rows[0];
};
// // get working time for employee past 30 days
export const getEntriesForPeriod = async (
  user_id,
  company_id,
  startDate,
  endDate,
) => {
  const query = `
  SELECT *,
  (
    total_minutes
    - COALESCE(EXTRACT(EPOCH FROM (break_end - break_start)) / 60, 0)
  ) AS worked_minutes,
  COALESCE(
    EXTRACT(EPOCH FROM (break_end - break_start)) / 60,
    0
  ) AS break_minutes
FROM worktime_employees
WHERE user_id = $1
  AND company_id = $2
  AND work_date BETWEEN $3 AND $4
ORDER BY work_date DESC, created_at DESC
  `;
  const values = [user_id, company_id, startDate, endDate];
  const result = await db.query(query, values);
  return result.rows;
};

export const getWorkTimeForAllUsersForWeekCalendarModel = async (
  startDate,
  endDate,
) => {
  const query = `
    SELECT
      user_id,
      work_date::date AS work_date,
      COALESCE(total_minutes, 0) AS total_minutes,
      ROUND(
        COALESCE(total_minutes, 0)
        - COALESCE(EXTRACT(EPOCH FROM (break_end - break_start)) / 60, 0)
      )::int AS worked_minutes
    FROM worktime_employees
    WHERE work_date::date BETWEEN $1::date AND $2::date
    ORDER BY work_date ASC
  `;

  const result = await db.query(query, [startDate, endDate]);
  return result.rows;
};

export const getMonthlyHoursEmployeeModel = async (
  company_id,
  startDate,
  endDate,
) => {
  const query = `
    SELECT
      u.id AS user_id,
      u.username,
      u.email,
      u.role,
      u.country_code,
      u.free_days,
      COALESCE(
        SUM(
          w.total_minutes
          - COALESCE(EXTRACT(EPOCH FROM (w.break_end - w.break_start)) / 60, 0)
        ),
        0
      ) AS worked_minutes
    FROM users u
    LEFT JOIN worktime_employees w
      ON u.id = w.user_id
      AND w.company_id = $1
      AND w.work_date BETWEEN $2 AND $3
    WHERE u.company_id = $1
    GROUP BY u.id, u.username, u.email, u.role, u.country_code
    ORDER BY worked_minutes DESC;
  `;

  const result = await db.query(query, [company_id, startDate, endDate]);
  return result.rows;
};

export const updateUserRemainingLeaveModel = async (
  user_id,
  newRemainingLeave,
) => {
  try {
    const query = `
      UPDATE users
      SET free_days = $1
      WHERE id = $2
      RETURNING free_days
    `;
    const values = [newRemainingLeave, user_id];

    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user remaining leave:", error);
    throw error;
  }
};
//CALENDAR PUBLIC HOLIDAYS
export const getPublicHolidaysModel = async (
  country_code,
  startDate,
  endDate,
) => {
  const result = await db.query(
    `SELECT date, country_code, name AS local_name
     FROM public_holidays
     WHERE country_code = $1
       AND date BETWEEN $2 AND $3
     ORDER BY date ASC`,
    [country_code, startDate, endDate],
  );
  return result.rows;
};
export const updateUserFreeDaysModel = async (user_id, free_days) => {
  const result = await db.query(
    "UPDATE users SET free_days = $1 WHERE id = $2 RETURNING free_days",
    [free_days, user_id],
  );
  return result.rows[0];
};
