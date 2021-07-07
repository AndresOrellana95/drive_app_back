const express = require('express');
const router = express.Router();
const Employees = require('./employee.controller');
const Employee = require('./models/Employee');

router.post('/create', Employees.createEmployee);
router.get('/getAll', Employees.getAllEmployees);
router.get('/getAvailable', Employees.getAvailableEmployees);
router.get('/getByCode', Employees.getEmployeeByCode);
router.get('/getAllHeads', Employees.getAllEmployeesHead);

module.exports = router;
