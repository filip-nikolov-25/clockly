import db from "../db.js";

export const sendLeaveRequest = async (
  start_date,
  end_date,
  reason,
  user_id,
  company_id,
  leave_type
) => {
  const result = await db.query(
    `INSERT INTO leave_requests (start_date, end_date, reason, user_id, company_id, status,leave_type)
     VALUES ($1, $2, $3, $4, $5, $6,$7)
     RETURNING status,leave_type,reason,start_date,end_date`,
    [start_date, end_date, reason, user_id, company_id, "pending",leave_type],
  );
  return result.rows[0];
};

export const getLeaveRequests = async (user_id, company_id) => {
  const result = await db.query(
    "SELECT status, start_date, end_date, leave_type,reason FROM leave_requests WHERE user_id = $1 AND company_id = $2",
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
      u.username,
      u.email
    FROM leave_requests lr
    JOIN users u ON lr.user_id = u.id
    WHERE lr.company_id = $1
    ORDER BY lr.start_date DESC
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

export const getUsersWithApprovedTimeOffModel = async (company_id) => {
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
        ) FILTER (WHERE lr.status = 'accepted'),
        '[]'
      ) AS leaves
    FROM users u
    LEFT JOIN leave_requests lr 
      ON lr.user_id = u.id AND lr.company_id = $1
    WHERE u.company_id = $1
    GROUP BY u.id, u.username, u.email, u.country_code
    ORDER BY u.username
    `,
    [company_id],
  );

  return result.rows;
};

