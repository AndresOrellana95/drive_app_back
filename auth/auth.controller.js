const {Employee, UserLevel, Team, Schedule} = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const SECRET_KEY = 'SET A SECRET KEY FOR THE HASH';

exports.validateToken = async (req, res, next) => {
    const token = req.headers.token;
    if(!token) {
        return res.status(401).send({ code: 401, message: "Sin token disponible" });
    } 
    try {
        const verify = jwt.verify(token, SECRET_KEY);
        res.status(200).send({ code: 200, message: "Token valido"});
    } catch(e) {
        res.status(400).send({ code: 400, message: "Token invalido" });
    }
}

exports.createUser = async (req, res, next) => {
    try {
        const newUser = {
            username: req.body.code,
            password: bcrypt.hashSync(req.body.password),
            complete_name: req.body.complete_name,
            UserLevelCode: req.body.level
        }
    
        const user = await Employee.create(newUser);
        const expiresIn = 24*60*60;
        const accessToken = jwt.sign({id: User.id},
            SECRET_KEY, {
                expiresIn: expiresIn
            });
        const dataUser = {
            code: 200,
            name: user.code,
            level: user.UserLevelCode,
            accessToken: accessToken,
            expiresIn: expiresIn
        }
        res.send({ dataUser });
    } catch(e) {
        if(e.name == 'SequelizeUniqueConstraintError') {
            res.status(500).send({ code: 500, message: 'Un usuario con este correo electrónico ya ha sido registrado'});
        }
        res.status(500).send({ code: 500, message: e.message});
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        const userData = {
            code: req.body.code,
            password: req.body.password
        }
        const user = await Employee.findOne({
            where: {
                code: userData.code
            }
        });
        if(!user) {
            return res.status(404).send({message:'Usuario no existe en la base de datos'});
        }
        const resultPassword = bcrypt.compareSync(userData.password, user.password);
        if(resultPassword) {
            if(user.get("UserLevelCode") == 2) {
                let activeRecord = await Team.findAll({
                    attributes: ['id'],
                    where: {
                        EmployeeCode: user.code,
                        "$Schedules.scheduled$" : true
                    },
                    include: [ { model: Schedule, as: 'Schedules'} ]
                });
                if(activeRecord.length == 0) {
                    return res.status(403).send({ code: 403, message: 'No tiene acceso a la plataforma'});
                }
            }
            const expiresIn = 24*60*60;
            const accessToken = jwt.sign({ code: user.code, role: user.get("UserLevelCode")}, SECRET_KEY, { expiresIn: expiresIn });
            const dataUser = {
                code: 200,
                name: user.code,
                accessToken: accessToken,
                expiresIn: expiresIn,
                role: user.get("UserLevelCode")
            }
            res.status(200).send({dataUser});
        } else {
            res.status(401).send({ code: 401, message: 'Credenciales incorrectas'});
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message});
    }
}

exports.getLevels = async (req, res, next) => {
    try {
        const levels = await UserLevel.findAll();
        res.status(200).send({ code: 200, levels });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getEncrypted = async (req, res, next) => {
    try {
        let value = req.body.value;
        value = bcrypt.hashSync(value),
        res.status(200).send({ code: 200, val: value });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.meesage });
    }
}
