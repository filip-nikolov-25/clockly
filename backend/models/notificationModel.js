import db from "../db.js";

export const createNotificationModel = async (user_id, title, message) => {
  const result = await db.query(
    `
    INSERT INTO notifications (user_id, title, message)
    VALUES ($1, $2, $3)
    RETURNING title,message
    `,
    [user_id, title, message]
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
