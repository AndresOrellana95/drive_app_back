const {Store} = require('../config/db');
const { Op } = require("sequelize");

exports.saveDots = async (req, res, next) => {
    const newStore = {
        code: req.body.CodTienda,
        name: req.body.Tienda,
        contactILC: req.body.ContactoILC,
        dir1: req.body.Dir1,
        dir2: req.body.Dir2,
        dir3: req.body.Dir3,
        phoneILC: req.body.TelILC,
        client: req.body.Cliente,
        phone: req.body.Telefono,
        phone2: req.body.Telefono2,
        reference: req.body.Referencia,
        gradeLat: req.body.Latitud,
        gradeLong: req.body.Longitud,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        department: req.body.department,
        sector: req.body.sector,
        scheduled: false,
        complete: false
    }
    try {
        
        const store = await Store.create(newStore);
        res.status(200).send({ code: 200, message: "Registro almacenado exitosamente"});
    } catch(e) {
        if(e.name == 'SequelizeUniqueConstraintError') {
            res.status(500).send({ code: 500, message: 'Un local con este codigo ya ha sido registrado'});
        }
        res.status(500).send({ code: 500, message: e.message});
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const dotsCollection = await Store.findAll();
        res.send({ code: 200, dotsCollection });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message});
    }
}

exports.getStoresFiltered = async (req, res, next) => {
    try {
        const dotsCollection = await Store.findAll({
            where: {
                sector: req.headers.sector
            }
        });
        res.status(200).send({ code: 200, dotsCollection })
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getAllWF = async (req, res, next) => {
    try {
        const dotsCollection = await Store.findAll({
            where: {
                [Op.and]: [
                    { scheduled: { [Op.is]: false } },{ complete: { [Op.is]: false } }
                ]
            }
        });
        res.send({ code: 200, dotsCollection });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message});
    }
}

exports.getStoresFilteredWF = async (req, res, next) => {
    try {
        const dotsCollection = await Store.findAll({
            where: {
                sector: req.headers.sector,
                [Op.or]: [
                    { scheduled: { [Op.is]: false } },{ complete: { [Op.is]: false } }
                ]
            }
        });
        res.status(200).send({ code: 200, dotsCollection })
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}
