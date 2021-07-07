const express = require('express');
const Cars = require('./cars.controller');
const router = express.Router();

router.post('/create', Cars.createCar);
router.get('/getAll', Cars.getAllCars);
router.get('/filterCar', Cars.getByCode);
router.get('/getAllWF', Cars.getAllCarsWF);
router.get('/filterCarWF', Cars.getByCodeWF);

module.exports = router;