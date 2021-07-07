const express = require('express');
const Users = require('./auth.controller');
const router = express.Router();

router.get('/tokenValidate', Users.validateToken);
router.post('/login', Users.loginUser);
//router.post('/getcrypt', Users.getEncrypted);

module.exports = router;
