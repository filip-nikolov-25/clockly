import db from "../db.js";
export const sendInviteToEmployee = async (company_id, code, created_by) => {
  const result = await db.query(
    `INSERT INTO company_invites (company_id, code, created_by)
     VALUES ($1, $2, $3)
     RETURNING code`,
    [company_id, code, created_by],
  );
  return result.rows[0];
};
export const getInviteCodesForEmployeesModel = async (company_id) => {
  const res = await db.query(
    "SELECT code FROM company_invites WHERE company_id = $1 AND used_at IS NULL",
    [company_id],
  );
  return res.rows;
};
export const getAdminEmailByCompanyId = async (company_id) => {
  const res = await db.query(
    `SELECT email FROM users WHERE company_id = $1 AND role = 'admin'`,
    [company_id]
  );
  return res.rows; 
};
