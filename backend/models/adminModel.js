import db from "../db.js";
export const sendInviteToEmployee = async (company_id, code, created_by) => {
  const result = await db.query(
    `INSERT INTO company_invites (company_id, code, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [company_id, code, created_by]
  );
  return result.rows[0];
};
