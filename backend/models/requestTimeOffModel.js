import db from "../db.js";

export const sendLeaveRequest = async (start_date, end_date, reason, user_id, company_id) => {
  const result = await db.query(
    `INSERT INTO leave_requests (start_date, end_date, reason, user_id, company_id, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING status`,
    [start_date, end_date, reason, user_id, company_id, 'pending']
  );
  return result.rows[0];
};

export const getLeaveRequests = async (user_id, company_id) => {
  const result = await db.query(
    "SELECT status, start_date, end_date FROM leave_requests WHERE user_id = $1 AND company_id = $2",
    [user_id, company_id]
  );
  return result.rows;
};
