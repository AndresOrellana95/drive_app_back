const { Car } = require('../config/db');
const { Op } = require("sequelize");

exports.createCar = async(req, res, next) => {
    try {
        const newCar = {
            code: req.body.code,
            model: req.body.model,
            inUse: false
        }
        const car = await Car.create(newCar);
        res.status(200).send({ code: 200, message: "Registro guardado exitosamente" });
    } catch(e) {
        if(e.name == 'SequelizeUniqueConstraintError') {
            res.status(500).send({ code: 500, message: 'Ya hay un vehículo con esta placa registrada'});
        }
        res.status(500).send({ code: 500, message: e.message});
    }
}

exports.getAllCars = async(req, res ,next) => {
    try {
        const carsCollection = await Car.findAll();
        res.status(200).send({ code: 200, carsCollection });
    } catch(e) {
        if(e.name == 'SequelizeUniqueConstraintError') {
            res.status(500).send({ code: 500, message: 'Ya hay un vehículo con esta placa registrada'});
        }
        res.status(500).send({ code: 500, message: e.message});
    }
}

exports.getAllCarsWF = async(req, res ,next) => {
    try {
        const carsCollection = await Car.findAll({
            where: {
                inUse: {
                    [Op.is] : false
                }
            }
        });
        res.status(200).send({ code: 200, carsCollection });
    } catch(e) {
        if(e.name == 'SequelizeUniqueConstraintError') {
            res.status(500).send({ code: 500, message: 'Ya hay un vehículo con esta placa registrada'});
        }
        res.status(500).send({ code: 500, message: e.message});
    }
}

exports.getByCode = async(req, res, next) => {
    try {
        let filter = req.headers.code;
        if(filter != null) {
            const cars = await Car.findAll({
                where: {
                    code: {
                        [Op.startsWith] : filter
                    }
                }
            });
            res.status(200).send({ code: 200, cars });
        } else {
            res.status(400).send({ code: 400, message: "Parametros incompletos" });
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getByCodeWF = async(req, res, next) => {
    try {
        let filter = req.headers.code;
        if(filter != null) {
            const cars = await Car.findAll({
                where: {
                    code: {
                        [Op.startsWith] : filter
                    },
                    isUse: {
                        [Op.is] : false
                    }
                }
            });
            res.status(200).send({ code: 200, cars });
        } else {
            res.status(400).send({ code: 400, message: "Parametros incompletos" });
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}
