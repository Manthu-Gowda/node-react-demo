const employeeController = require("../Controller/employeeController");
const authenticateToken = require("../jwtAuthToken");
const express = require('express');
const employeeRouter = express.Router();

employeeRouter.post("/createEmployee", authenticateToken, employeeController.createEmployee);
employeeRouter.post("/getAllEmployees", authenticateToken, employeeController.getAllEmployees);
employeeRouter.get("/getEmployeeById", authenticateToken, employeeController.getEmployeeById);
employeeRouter.post("/updateEmployee", authenticateToken, employeeController.updateEmployee);
employeeRouter.delete("/deleteEmployee", authenticateToken, employeeController.deleteEmployee);



module.exports = employeeRouter;
