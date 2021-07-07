const express = require('express');
const Users = require('./auth.controller');
const router = express.Router();
router.post('/create', Users.createUser);
router.get('/levels', Users.getLevels);

module.exports = router;