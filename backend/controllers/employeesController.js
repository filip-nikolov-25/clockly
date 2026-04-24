import {
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getCurrentCompanyModel,
  getEmployeesForCompanyModel,
} from "../models/employeesModel.js";

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

//Get current company
export const getCurrentCompanyController = async (req, res) => {
  const company_id = req.user.company_id;
  try {
    const selectCompany = await getCurrentCompanyModel(company_id);
    res.status(200).json(selectCompany);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
export const getEmployeesForCompanyController = async (req, res) => {
  const company_id = req.user.company_id;
  try {
    const allEmployees = await getEmployeesForCompanyModel(company_id);
    res.status(200).json(allEmployees);
  } catch (error) {
    res.status(500).json({ error: "Server error nestp" });
  }
}
