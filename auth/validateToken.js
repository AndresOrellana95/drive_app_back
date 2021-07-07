const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const SECRET_KEY = 'SET A SECRET KEY FOR THE HASH';

const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if(!token) {
        return res.status(401).send({ code: 401, message: "Sin token disponible" });
    } 
    try {
        const verify = jwt.verify(token, SECRET_KEY);
        next();
    } catch(e) {
        res.status(400).send({ code: 400, message: "Token invalido" });
    }
}

module.exports = verifyToken;
