const { Store, Employee, Schedule, Team, Job, Product, sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');
const { Op } = require("sequelize");

exports.getAllTeams = async (req, res, next) => {
    try {
        const teams = await Team.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(200).send({ code: 200, teams });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
};

exports.getTeamDetailProducts = async (req, res, next) => {
    try {
        let id = req.headers.id;
        const team = await Team.findOne({
            where: {
                id: id
            },
            include: [
                { model: Product },
                { model: Schedule, as: 'Schedules' }
            ]
        });
        let totals = new TeamHist();
        let totalList = [];
        for(let [key1, value1] of Object.entries(totals)) {
            let key = "";
            let value = 0;
            for(let [key2, value2] of Object.entries(value1)) {
                if(key2 === 'key') {
                    key = key1;
                } else {
                    value = value2;
                }
            }
            totalList.push({ key, value });
        }
        let teamProds = team.Products;
        let lastAssignation = "";
        if(teamProds.length > 0) {
            for(let i = 0; i <= teamProds.length - 1; i++) {
                for(let j = 0; j <= totalList.length - 1; j++) {
                    totalList[j].value += teamProds[i][totalList[j].key];
                    if(i == (teamProds.length - 1)) {
                        lastAssignation = teamProds[i].createdAt.getTime();
                    }
                }
            }
        }
        for(let [key1, value1] of Object.entries(totals)) {
            let key = "";
            let value = 0;
            for(let [key2, value2] of Object.entries(value1)) {
                if(key2 === 'key') {
                    key = key1;
                } else {
                    value = value2;
                }
            }
        }
        const emp = await Employee.findOne({
            attributes: ['code','name'],
            where: {
                code: team.EmployeeCode
            }
        });
        let totalUsed = {
            blancaLtx: 0.0,
            blancaOpt: 0.0,
            amrBrill: 0.0,
            azulBrill: 0.0
        };
        let schedules = team.Schedules;
        for(let k = 0; k <= schedules.length - 1; k++) {
            let job = await Job.findAll({
                where: {
                    ScheduleId: schedules[k].id
                }
            });
            if(job.length > 0) {
                for(let l = 0; l <= job.length - 1; l++) {
                    totalUsed.blancaLtx += job[l].usedBlancaLtx || 0;
                    totalUsed.blancaOpt += job[l].usedBlancaOpt || 0;
                    totalUsed.amrBrill += job[l].usedYellow || 0;
                    totalUsed.azulBrill += job[l].usedBlue || 0;
                }
            }
        }
        team.setDataValue("totalUsed", totalUsed);
        team.setDataValue("totals", totalList);
        team.setDataValue("lastAssignation", lastAssignation);
        team.setDataValue("head", emp);
        res.status(200).send({ code: 200, team });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getTeamsByDate = async (req, res, next) => {
    try {
        let date = req.body.date;
        const teams = await Team.findAll({
            where: {
                assignationDate: date
            }, 
            include: [
                { model: Employee, as: 'head' }
            ]
        });
        res.status(200).send({ code: 200, teams });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.createTeam = async (req, res, next) => {
    try {
        const newTeam = {
            headCode: req.body.headCode,
            structure: req.body.structure,
            keys: req.body.keys,
            CarCode: req.body.CarCode,
            EmployeeCode: req.body.EmployeeCode
        }
        const team = await Team.create(newTeam);
        const struct = req.body.structure;
        for(let i = 0; i<= struct.length - 1; i++) {
            let emp = await Employee.findOne({
                where: {
                    code: struct[i].code
                }
            });
            emp.TeamId = team.id;
            emp.save();
        }
        let head = await Employee.findOne({ where: { code: team.EmployeeCode } });
        head.TeamId = team.id;
        head.save();
        res.status(200).send({ code: 200, message: "Registro de equipo realizado con exito"});
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
};

exports.getDistinctTeams = async (req, res, next) => {
    try {
        const teams = await sequelize.query('SELECT * FROM (SELECT DISTINCT ON ("EmployeeCode") * FROM drive_app."Teams" ORDER BY "EmployeeCode", ID DESC) T ORDER BY ID DESC', {
            model: Team, mapToModel: true
        });
        res.status(200).send({ code: 200, teams });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getSchedules = async (req, res, next) => {
    try {
        const schedules = await Schedule.findAll();
        res.status(200).send({ code: 200, schedules });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
};

exports.createSchedule = async (req, res, next) => {
    try {
        const newSchedule = {
            route: req.body.route,
            routeDistance: req.body.routeDistance,
            TeamId: req.body.TeamId,
            scheduled: true,
            completed: false,
        }
        let date = req.body.date;
        const schedule = await Schedule.create(newSchedule);
        const route = req.body.route;
        for(let i = 0; i<= route.length - 1; i++) {
            let store = await Store.findOne({
                where: {
                    latitude: route[i].latitude,
                    longitude: route[i].longitude
                }
            });
            store.scheduled = true;
            store.save();
            //Creando job
            let newJob = {
                StoreId: store.id,
                active: false,
                completed: false,
                reescheduled: false,
                ScheduleId: schedule.id,
                created: date
            };
            let jobCreate = await Job.create(newJob);
        }
        res.status(200).send({ code: 200, message: "Registro realizado exitosamente" });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
};

exports.getScheduleRoute = async (req, res, next) => {
    try {
        let id = req.headers.id;
        if(id != null) {
            const schedules = await Schedule.findOne({
                where: {
                    id: id
                }
            });
            let dotsCollection = [];
            if(schedules.scheduled) {
                let dots = schedules.route;
                for(let i = 0; i <= dots.length - 1; i++) {
                    const store = await Store.findOne({
                        where: {
                            latitude: dots[i].latitude,
                            longitude: dots[i].longitude
                        }
                    });
                    dotsCollection.push(store);
                }
            }
            res.status(200).send({ code: 200, dotsCollection });
        } else {
            res.status(400).send({ code: 400, message: "Parametros incompletos" });
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
};

exports.getScheduleByDate = async (req, res, next) => {
    try {
        let date = req.body.date;
        if(date != null) {
            const schedules = await Schedule.findAll({
                where: {
                    exceduteDate: date
                }
            });
            res.status(200).send({ code: 200, schedules });
        } else {
            res.status(400).send({ code: 400, message: "Parametros incompletos" });
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
};

exports.getScheduleByCode = async (req, res, next) => {
    try {
        let code = req.header.code;
        if(code != null) {
            const schedules = await Schedule.findAll({
                where: {
                    id: code
                }
            });
            res.status(200).send({ code: 200, schedules });
        } else {
            res.status(400).send({ code: 400, message: "Parametros incompletos" });
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
};

exports.getScheduleByTeamCode = async (req, res, next) => {
    try {
        let teamid = req.headers.teamid;
        if(teamid != null) {
            const schedule = await Schedule.findOne({
                where: {
                    TeamId: teamid,
                    scheduled: true
                }
            });
            if(schedule != null) {
                res.status(200).send({ code: 200, schedule });
            } else {
                res.status(400).send({ code: 404, message: "Parametros incorrectos" });
            }
        } else {
            res.status(400).send({ code: 400, message: "Parametros incompletos" });
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
};

exports.getScheduleActive = async (req, res, next) => {
    try {
        const schedules = await Schedule.findAll({
            where: {
                scheduled: true
            },
            include: [
                { model: Job },
                { model: Team, as: 'Team' }
            ]
        });
        for(let i = 0; i <= schedules.length - 1; i++) {
            const head = await Employee.findOne({
                attributes: ['code','name'],
                where: { 
                    code: schedules[i].Team.EmployeeCode
                }
            });
            schedules[i].setDataValue("head", head);
        }
        res.status(200).send({ code: 200, schedules });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
};

exports.clearSchedule = async (req, res, next) => {
    try {
        let teamid = req.headers.teamid;
        if(teamid) {
            const schedule = await Schedule.findOne({
                where: {
                    scheduled: true,
                    TeamId: teamid
                }
            });
            let jobs = await Job.findAll({
                where: {
                    ScheduleId: schedule.id
                }
            });
            let counter = 0;
            if(jobs.length > 0) {
                for(let i = 0; i <= jobs.length - 1; i++) {
                    let store = await Store.findOne({
                        where: {
                            id: jobs[i].StoreId
                        }
                    });
                    if(!jobs[i].completed || jobs[i].reescheduled) {
                        counter++;
                        store.scheduled = false;
                        store.complete = false;
                        store.save();
                    }
                }
            }
            schedule.scheduled = false;
            schedule.save();
            res.status(200).send({ code: 200, message: "Ruta completada con " + counter + " tareas pendientes por revisar"});
            /*let route = schedule.route;
            let control = true;
            for(let i = 0; i <= route.length - 1; i++) {
                const store = await Store.findOne({
                    where: {
                        id: route[i].id
                    }
                });
                if(!store.complete && store.scheduled) {
                    control = false;
                }
            }
            if(control) {
                schedule.scheduled = false;
                schedule.save();
                res.status(200).send({ code: 200, message: "Ruta completada" });
            } else {
                res.status(200).send({ code: 400, message: "Aun hay tareas sin validar" });
            }*/
        } else {
            res.status(200).send({ code: 400, message: "Parametros incorrectors" });
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.insertProducstToTeam = async (req, res, next) => {
    try {
        let newRecord = req.body.record;
        const products = await Product.create(newRecord);
        res.status(200).send({ code: 200, message: "Registro de asignación de productos creado con éxito"});
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

function TeamHist() {
    this.picture1 = {key: 'Rotulo A', value: 0};
    this.picture2 = {key: 'Rotulo B', value: 0};
    this.picture3 = {key: 'Rotulo C', value: 0};
    this.picture4 = {key: 'Rotulo A', value: 0};
    this.picture5 = {key: 'Rotulo B', value: 0};
    this.picture6 = {key: 'Rotulo C', value: 0};
    this.blancaLtx = { key:"Blanca Latex" , value: 0 };
    this.blancaBrill = { key:"Blanca brillante" , value: 0 };
    this.blancaOpt = { key:"Blanca Optimus" , value: 0 };
    this.amrBrill = { key:"Amarilla Brillante" , value: 0 };
    this.azulBrill = { key:"Azul brillante" , value: 0 };
    this.blancaAntic = { key:"Blanca anticorro" , value: 0 };
    this.blancaTopCover = { key:"Blanco top cover" , value: 0 };
    this.prinPrv1 = { key:"Pin prov 1" , value: 0 };
    this.prinPrv2 = { key:"Pin prov 2" , value: 0 };
    this.prinPrv3 = { key:"Pin prov 3" , value: 0 };
    this.prinPrv4 = { key:"Pin prov 4" , value: 0 };
    this.prinPrv5 = { key:"Pin prov 5" , value: 0 };
    this.alambGalv = { key:"Alambre Galv." , value: 0 };
    this.bandejaRod = { key:"Bandeja para rodillo" , value: 0 };
    this.bidones = { key:"Bidones" , value: 0 };
    this.brocaConc316 = { key:"Broca concreto 3 / 16''" , value: 0 };
    this.brocaCon38 = { key:"Broca concreto 3 / 8''" , value: 0 };
    this.brocaCon516 = { key:"Broca concreto 5 / 16''" , value: 0 };
    this.brocha05 = { key:"Brocha 1 / 2''" , value: 0 };
    this.brocha1 = { key:"Brocha 1''" , value: 0 };
    this.brocha112 = { key:"Brocha 1 1 / 2''" , value: 0 };
    this.brocha2 = { key:"Brocha 2''" , value: 0 };
    this.brocha4 = { key:"Brocha 4''" , value: 0 };
    this.brocha6 = { key:"Brocha 6''" , value: 0 };
    this.cajaHerrRoja = { key:"Caja de herramientras roja" , value: 0 };
    this.cepAlambre = { key:"Cepillo de alambre" , value: 0 };
    this.cinchaPlast14 = { key:"Cincha plastica 14''" , value: 0 };
    this.cintaMetrica = { key:"Cinta métrica" , value: 0 };
    this.destPhilips = { key:"Destornillador philips" , value: 0 };
    this.destPhilipsPlano = { key:"Destornillador plano" , value: 0 };
    this.escaleraExt = { key:"Escalera extensible" , value: 0 };
    this.escaleraTjr = { key:"Escalera tijera" , value: 0 };
    this.escobas = { key:"Escobas" , value: 0 };
    this.espatulas = { key:"Espatulas" , value: 0 };
    this.extElectrica = { key:"Extensión eléctrica" , value: 0 };
    this.extRodillo = { key:"Extensiones rodillo" , value: 0 };
    this.felpas9Plisa = { key:"Felpas de 9'' Pared Lisa" , value: 0 };
    this.felpas9Or = { key:"Felpas de 9'' Ormigon" , value: 0 };
    this.nylon = { key:"Hilo Nylon" , value: 0 };
    this.manRodillo9 = { key:"Manerales para rodillo 9''" , value: 0 };
    this.martillo = { key:"Martillos" , value: 0 };
    this.nivelCaja = { key:"Nivel de Caja" , value: 0 };
    this.pinzas = { key:"Pinzas" , value: 0 };
    this.pPhilipsTal = { key:"Puntas Philips p/ Taladro" , value: 0 };
    this.pPlanaTal = { key:"Punta Plana P/ Taladro" , value: 0 };
    this.taladro = { key:"Taladros" , value: 0 };
    this.cintDobCara = { key:"Cinta doble cara" , value: 0 };
    this.clavoAcr1 = { key:"Clavo de acero 1''" , value: 0 };
    this.torBr1Hex = { key:"Tornillo punta broca 1'' Hexagonal" , value: 0 };
    this.aclaP38 = { key:"Anclas plasticas 3 / 8'' azul" , value: 0 };
    this.wype = { key:"Wype" , value: 0 };
    this.cubo8Tal = { key:"Cubo N°8 para taladro" , value: 0 };
    this.solventeMin = { key:"Solvente mineral" , value: 0 };
    this.itemPrv1 = { key:"ItemPrv1" , value: 0 };
    this.itemPrv2 = { key:"ItemPrv2" , value: 0 };
    this.itemPrv3 = { key:"ItemPrv3" , value: 0 };
    this.itemPrv4 = { key:"ItemPrv4" , value: 0 };
    this.itemPrv5 = { key:"ItemPrv5" , value: 0 };
    this.itemPrv6 = { key:"ItemPrv6" , value: 0 };
    this.itemPrv7 = { key:"ItemPrv7" , value: 0 };
    this.itemPrv8 = { key:"ItemPrv8" , value: 0 };
    this.itemPrv9 = { key:"ItemPrv9" , value: 0 };
    this.itemPrv10 = { key:"ItemPrv10" , value: 0 };
}
