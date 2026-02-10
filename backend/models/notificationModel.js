import db from "../db.js";


export const createNotificationModel = async ({
  user_id = null,
  title,
  message,
  company_id,
  target_role, 
}) => {
  const result = await db.query(
    `
    INSERT INTO notifications (
      user_id,
      title,
      message,
      company_id,
      target_role
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, message, target_role
    `,
    [user_id, title, message, company_id, target_role]
  );

  return result.rows[0];
};

export const getNotificationsModel = async ({ role, user_id, company_id }) => {
  console.log("GOES HERE ",role)
  if (role === "admin") {
    const res = await db.query(
      `
      SELECT id, title, message, is_read, created_at
      FROM notifications
      WHERE company_id = $1
        AND target_role = 'admin'
        AND EXISTS (
          SELECT 1 
          FROM leave_requests lr
          WHERE lr.company_id = $1
            AND lr.status = 'pending'
        )
      ORDER BY is_read ASC, created_at DESC
      `,
      [company_id]
    );

    return res.rows;
  }

  const res = await db.query(
    `
    SELECT id, title, message, is_read, created_at
    FROM notifications
    WHERE company_id = $1
      AND target_role = 'employee'
      AND user_id = $2
    ORDER BY is_read ASC, created_at DESC
    `,
    [company_id, user_id]
  );

  return res.rows;
};


export const updateStatusNotificationModel = async ({
  role,
  user_id,
  company_id,
}) => {
  const res = await db.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE company_id = $1
      AND is_read = false
      AND (
        (target_role = 'admin' AND $2 = 'admin')
        OR
        (target_role = 'employee' AND user_id = $3)
      )
    RETURNING id, title, target_role
    `,
    [company_id, role, user_id]
  );
  return res.rows;
};

export const getNotificationsForEmployeeModel = async (user_id, company_id) => {
  const res = await db.query(
    `
    SELECT n.id, n.title, n.message, n.is_read, n.created_at
    FROM notifications n
    JOIN leave_requests lr ON lr.user_id = n.user_id
    WHERE n.user_id = $1
      AND n.company_id = $2
      AND lr.status != 'pending'
    ORDER BY n.is_read ASC, n.created_at DESC
    `,
    [user_id, company_id]
  );

  return res.rows;
};
export const updateEmployeeNotificationsModel = async (user_id, company_id) => {
  const res = await db.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE user_id = $1
      AND company_id = $2
      AND is_read = false
    RETURNING id
    `,
    [user_id, company_id]
  );
  return res.rows;
};

export const updateAdminNotificationsModel = async (company_id) => {
  const res = await db.query(
    `UPDATE notifications
     SET is_read = true
     WHERE company_id = $1
       AND target_role = 'admin'
     RETURNING id`,
    [company_id]
  );
  return res.rows;
};

