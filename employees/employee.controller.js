const { Employee, Team } = require('../config/db');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const SECRET_KEY = '';

exports.createEmployee = async (req, res, next) => {
    try {
        const newEmployee = {
            code: req.body.code,
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password),
            UserLevelCode: 2,
            partner: false,
            lastAssign: null
        }
        const employee = await Employee.create(newEmployee);
        res.status(200).send({ code: 200, message: "Operación realizada con éxito" });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.meesage });
    }
}

exports.getAllEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.findAll({
            attributes: ['code','name'],
            where: {
                UserLevelCode: 2
            }
        });
        res.status(200).send({ code: 200, employees });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getAllEmployeesHead = async (req, res, next) => {
    try {
        const employees = await Employee.findAll({
            attributes: ['code','name'],
            where: {
                UserLevelCode: 2
            },
            include: [{ model: Team, as: 'Head'}],
            order: [
                [ {model: Team, as: 'Head' }, 'createdAt', 'DESC']
            ]
        });
        let employeesColl = [];
        for(let i = 0; i <= employees.length - 1; i++) {
            if(employees[i].Head.length > 0) {
                employeesColl.push(employees[i]);
            }
        }
        res.status(200).send({ code: 200, employeesColl });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getEmployeeByCode = async (req, res, next) => {
    try {
        let code = req.headers.code
        if(code != null) {
            const employee = await Employee.findOne({
                attributes: ['code','name'],
                where: {
                    code: code
                }
            });
            res.status(200).send({ code: 200, employee });
        } else {
            res.status(400).send({ code: 400, message: "Parametros incompletos" });
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getAvailableEmployees = async (req, res, next) => {
    try {
        let level = req.headers.level;
        const employees = await Employee.findAll({
            attributes: ['code','name'],
            where: {
                partner: {
                    [Op.is] : false
                },
                UserLevelCode: level
            }
        });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}
