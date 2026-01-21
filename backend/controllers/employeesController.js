import db from "../db.js"

// GET ALL
export const getEmployees = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM employees");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET ONE
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM employees WHERE id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createEmployee = async (req, res) => {
  try {
    const { name, lastname } = req.body;

    const result = await db.query(
      "INSERT INTO employees (name, lastname) VALUES ($1, $2) RETURNING *",
      [name, lastname]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastname } = req.body;

    const result = await db.query(
      "UPDATE employees SET name = $1, lastname = $2 WHERE id = $3 RETURNING *",
      [name, lastname, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE ONE
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM employees WHERE id = $1", [id]);
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE ALL
export const deleteAllEmployees = async (req, res) => {
  try {
    await db.query("DELETE FROM employees");
    res.json({ message: "All employees deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
