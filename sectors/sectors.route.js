const express = require('express');
const router = express.Router();
const Sectors = require('./sectors.controller');

router.get('/getParents',Sectors.getParents);
router.get('/getSectors', Sectors.getSectors);
router.get('/getSector', Sectors.getSector);

module.exports = router;
