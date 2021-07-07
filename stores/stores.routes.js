const express = require('express');
const router = express.Router();
const Stores = require('./stores.controller');

router.post('/saveDots',Stores.saveDots);
router.get('/getDots', Stores.getAll);
router.get('/getFilteredDots', Stores.getStoresFiltered);
router.get('/getDotsWF', Stores.getAllWF);
router.get('/getFilteredDotsWF', Stores.getStoresFilteredWF);

module.exports = router;