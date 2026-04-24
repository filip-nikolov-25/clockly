import db from "../db.js";

// GET ONE
export const getEmployeeById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

// CREATE
export const createEmployee = async (name, lastname) => {
  const result = await db.query(
    "INSERT INTO users (name, lastname) VALUES ($1, $2) RETURNING *",
    [name, lastname],
  );
  return result.rows[0];
};

// UPDATE
export const updateEmployee = async (id, name, lastname) => {
  const result = await db.query(
    "UPDATE users SET name = $1, lastname = $2 WHERE id = $3 RETURNING *",
    [name, lastname, id],
  );
  return result.rows[0];
};

// DELETE ONE
export const deleteEmployee = async (id) => {
  await db.query("DELETE FROM users WHERE id = $1", [id]);
};

// Get current comppany
export const getCurrentCompanyModel = async (id) => {
  const res = await db.query("SELECT name FROM companies WHERE id = $1 ", [id]);
  return res.rows[0];
};
//get ALL EmploYees for company
export const getEmployeesForCompanyModel = async (company_id) => {
  const res = await db.query(
    "SELECT id, username, role FROM users WHERE company_id = $1",
    [company_id],
  );
  return res.rows;
};
