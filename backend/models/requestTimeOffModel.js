import db from "../db.js";

export const sendLeaveRequest = async (
  start_date,
  end_date,
  reason,
  user_id,
  company_id,
  leave_type,working_days
) => {
  const result = await db.query(
    `INSERT INTO leave_requests 
     (start_date, end_date, reason, user_id, company_id, status, leave_type, working_days)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING status, leave_type, reason, start_date, end_date, working_days`,
    [
      start_date,
      end_date,
      reason,
      user_id,
      company_id,
      "pending",
      leave_type,
      working_days, 
    ],
  );
  return result.rows[0];
};

export const getLeaveRequests = async (user_id, company_id) => {
  const result = await db.query(
    `SELECT status, start_date, end_date, leave_type, reason 
     FROM leave_requests 
     WHERE user_id = $1 
     AND company_id = $2 
     -- Filters for requests made in the last 2 months
     AND requested_at >= NOW() - INTERVAL '2 months'
     ORDER BY requested_at DESC`,
    [user_id, company_id],
  );
  return result.rows;
};
export const getTimeOffRequestsForAdminModel = async (company_id) => {
  const result = await db.query(
    `
    SELECT 
      lr.id,
      lr.status,
      lr.start_date,
      lr.end_date,
      lr.leave_type,
      lr.reason,
      u.username,
      u.email,
      lr.requested_at
    FROM leave_requests lr
    JOIN users u ON lr.user_id = u.id
    WHERE lr.company_id = $1
    AND (
      lr.status = 'pending' 
      OR 
      (
        lr.status IN ('accepted', 'rejected') 
        AND lr.requested_at >= CURRENT_TIMESTAMP - INTERVAL '1 month'
      )
    )
    ORDER BY 
      CASE WHEN lr.status = 'pending' THEN 1 ELSE 2 END, -- Pending on top
      lr.requested_at DESC
    `,
    [company_id],
  );

  return result.rows;
};

export const adminUpdateTimeOffStatusModel = async (id, status, company_id) => {
  const normalizedStatus = status?.trim().toLowerCase();

  if (!["accepted", "rejected"].includes(normalizedStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const result = await db.query(
    `
    UPDATE leave_requests
    SET status = $1
    WHERE id = $2 AND company_id = $3
    RETURNING *
    `,
    [normalizedStatus, id, company_id],
  );

  return result.rows[0];
};

export const getUsersWithApprovedTimeOffModel = async (
  company_id,
  startDate,
  endDate,
) => {
  const result = await db.query(
    `
    SELECT 
      u.id AS user_id,
      u.username,
      u.email,
      u.country_code, 
      COALESCE(
        json_agg(
          json_build_object(
            'start_date', lr.start_date,
            'end_date', lr.end_date,
            'status', lr.status,
            'leave_type', lr.leave_type  
          )
        ) FILTER (WHERE lr.id IS NOT NULL),
        '[]'
      ) AS leaves
    FROM users u
    LEFT JOIN leave_requests lr 
      ON lr.user_id = u.id 
      AND lr.company_id = $1
      AND lr.status = 'accepted'
      AND (lr.start_date <= $3 AND lr.end_date >= $2) 
    WHERE u.company_id = $1
    GROUP BY u.id, u.username, u.email, u.country_code
    ORDER BY u.username
    `,
    [company_id, startDate, endDate],
  );
  return result.rows;
};
export const getEmployeePendingTimeOffModel = async (user_id) => {
  const res = await db.query(
    "SELECT 1 FROM leave_requests WHERE user_id = $1 AND status = 'pending' LIMIT 1",
    [user_id],
  );

  return {
    userRequestedAbscence: res.rowCount > 0,
  };
};
