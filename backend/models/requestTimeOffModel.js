import db from "../db.js";

export const sendLeaveRequest = async (
  start_date,
  end_date,
  reason,
  user_id,
  company_id,
) => {
  const result = await db.query(
    `INSERT INTO leave_requests (start_date, end_date, reason, user_id, company_id, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING status`,
    [start_date, end_date, reason, user_id, company_id, "pending"],
  );
  return result.rows[0];
};

export const getLeaveRequests = async (user_id, company_id) => {
  const result = await db.query(
    "SELECT status, start_date, end_date FROM leave_requests WHERE user_id = $1 AND company_id = $2",
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

  return result;
};

export const getUsersWithApprovedTimeOffModel = async (company_id) => {
  const result = await db.query(
    `
    SELECT 
      u.id AS user_id,
      u.username,
      u.email,
      COALESCE(
        json_agg(
          json_build_object(
            'start_date', lr.start_date,
            'end_date', lr.end_date,
            'status', lr.status
          )
        ) FILTER (WHERE lr.status = 'accepted'),
        '[]'
      ) AS leaves
    FROM users u
    LEFT JOIN leave_requests lr 
      ON lr.user_id = u.id AND lr.company_id = $1
    WHERE u.company_id = $1
    GROUP BY u.id, u.username, u.email
    ORDER BY u.username
    `,
    [company_id],
  );

  return result.rows;
};
