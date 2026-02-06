import db from "../db.js";

export const createNotificationModel = async (user_id, title, message,company_id) => {
  const result = await db.query(
    `
    INSERT INTO notifications (user_id, title, message,company_id)
    VALUES ($1, $2, $3,$4)
    RETURNING title,message
    `,
    [user_id, title, message,company_id]
  );

  return result.rows[0];
};

export const getNotificationsByUserModel = async (user_id) => {
  const res = await db.query(
    `SELECT title, message, is_read 
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user_id]
  );
  return res.rows;
};

export const updateStatusNotificationModel = async (user_id) => {
  const res = await db.query(`UPDATE notifications SET is_read = 'true' WHERE user_id = $1 RETURNING is_read`,[user_id])
  return res.rows[0];
}
export const getNotificationsForAdminModel = async (company_id) => {
  const res = await db.query("SELECT title,message,is_read FROM notifications WHERE company_id = $1",[company_id])
  return res.rows;
}
