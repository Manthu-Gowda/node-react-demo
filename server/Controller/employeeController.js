const employeeServices = require("../Services/employeeServices");

async function createEmployee(req, res) {
  let response = await employeeServices.createEmployee(req);
  res.json(response);
}

async function getAllEmployees(req, res) {
  let response = await employeeServices.getAllEmployees(req);
  res.json(response);
}

async function getEmployeeById(req, res) {
  let response = await employeeServices.getEmployeeById(req);
  res.json(response);
}
async function updateEmployee(req, res) {
  let response = await employeeServices.updateEmployee(req);
  res.json(response);
}
async function deleteEmployee(req, res) {
  let response = await employeeServices.deleteEmployee(req);
  res.json(response);
}


module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
