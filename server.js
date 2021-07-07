'use strict'
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const app = express();
require('./config/db');
const bodyParser = require('body-parser');
const bodyParserJSON = bodyParser.json({ limit: '50mb', extended: true });
const bodyParserURLEncoded = bodyParser.urlencoded({ limit: '50mb',extended: true });

app.use(cors());
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);


const authRoutes = require('./auth/auth.routes');
const unsecured = require('./auth/unsecured.routes');
const manageRoutes = require('./manage/manage.routes');
const storeRoutes = require('./stores/stores.routes');
const sectorRoutes = require('./sectors/sectors.route');
const carsRoutes = require('./cars/cars.routes');
const employeeRoutes = require('./employees/employee.route');
const router = express.Router();
const accessVerify = require('./auth/validateToken');
router.get('/', (req, res) => {
    res.send('Home method');
});
app.use('/user',accessVerify, authRoutes);
app.use('/', unsecured);
app.use('/manage', accessVerify, manageRoutes);
app.use('/sectors',accessVerify, sectorRoutes);
app.use('/cars', accessVerify, carsRoutes);
app.use('/employees', accessVerify, employeeRoutes);
app.use('/stores', accessVerify, storeRoutes);
app.use('/',router);

app.listen(port,() => {
    console.log("Server running ok in port " + port);
} );
