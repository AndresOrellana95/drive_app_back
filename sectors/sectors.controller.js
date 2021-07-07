const {Sector} = require('../config/db');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const { response } = require('express');
const SECRET_KEY = '';

exports.getParents = async (req, res, next) => {
    try {
        const parents = await Sector.findAll({
            where: {
                parent: {
                    [Op.is]: null
                }
            }
        });
        res.status(200).send({ code: 200, parents });
    } catch(e) {
        res.status(500).send({code: 500, message: e.message});
    }
}

exports.getSectors = async (req, res, next) => {
    try {
        const sectors = await Sector.findAll({
            where: {
                parent: req.headers.parent
            }
        });
        res.status(200).send({code: 200, sectors});
    } catch(e) {
        res.status(500).send({code: 500, message: e.message});
    }
}

exports.getSector = async (req, res, next) => {
    try {
        const sector = await Sector.findAll({
            where: {
                code: req.headers.sector
            }
        });
        res.status(200).send({ code: 200, sector });
    } catch(e) {
        res.status(500).send({code: 500, message: e.message});
    }
}
