import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  deleteAllEmployees,
} from "../models/employeesModel.js";

// GET ALL
export const getEmployeesController = async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET ONE
export const getEmployeeByIdController = async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createEmployeeController = async (req, res) => {
  try {
    const { name, lastname } = req.body;
    const employee = await createEmployee(name, lastname);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateEmployeeController = async (req, res) => {
  try {
    const { name, lastname } = req.body;
    const employee = await updateEmployee(req.params.id, name, lastname);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE ONE
export const deleteEmployeeController = async (req, res) => {
  try {
    await deleteEmployee(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE ALL
export const deleteAllEmployeesController = async (req, res) => {
  try {
    await deleteAllEmployees();
    res.json({ message: "All employees deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
