const { Schedule, Team, Job, Product, Binnacle, Ratio, Store, sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');
const { Op } = require("sequelize");


exports.insertTeamRatios = async (req, res, next) => {
    try {
        const insertRatios = {
            blancaLtx: req.body.ratios.blancaLtx,
            blancaBrill: req.body.ratios.blancaBrill,
            blancaOpt: req.body.ratios.blancaOpt,
            amrBrill: req.body.ratios.amrBrill,
            azulBrill: req.body.ratios.azulBrill,
            blancaAntic: req.body.ratios.blancaAntic,
            blancaTopCover: req.body.ratios.blancaTopCover,
            TeamRatioId: req.body.ratios.TeamRatioId
        }
        const team = await Ratio.create(insertRatios);
        res.status(200).send({ code: 200, message: "Registro de razones realizado con exito"});
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
};

exports.getLastRatios = async (req, res, next) => {
    try {
        const team = req.headers.teamid;
        const ratios = await sequelize.query('SELECT * FROM (SELECT DISTINCT ON ("TeamRatioId") * FROM drive_app."Ratios" ORDER BY "TeamRatioId", ID DESC) T WHERE "TeamRatioId" = :teamid ORDER BY ID DESC LIMIT 1;',
        {
            replacements: { teamid: team },
            type: QueryTypes.SELECT
        },
        {
            model: Ratio, mapToModel: true
        });
        res.status(200).send({ code: 200, ratios });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.createRecordArrival = async (req, res, next) => {
    try {
        const newBin = {
            employee: req.body.employee,
            schedule: req.body.schedule,
            localCreation: req.body.localCreation,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            storeCode: req.body.storeCode
        }
        const bin = await Binnacle.create(newBin);
        res.status(200).send({ code: 200, message: "Operacion realizada con exito" });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getArrivalRecordsBySchedule = async (req, res, next) => {
    try {
        const id = req.headers.id;
        if(id) {
            let arrivals = await Binnacle.findAll({
                where: {
                    schedule: id
                }
            });
            res.status(200).send({ code: 200, arrivals });
        } else {
            res.status(200).send({ code: 400, message: "Parametros incorrectors" });
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.updateJob = async (req, res, next) => {
    try {
        const attributes = {
            id: req.body.id,
            store: req.body.store,
            before1: req.body.before1,
            before2: req.body.before2,
            before3: req.body.before3,
            after1: req.body.after1,
            after2: req.body.after2,
            after3: req.body.after3,
            accepted: req.body.accepted,
            name: req.body.name,
            picture1: req.body.picture1,
            picture2: req.body.picture2,
            picture3: req.body.picture3,
            picture4: req.body.picture4,
            picture5: req.body.picture5,
            picture6: req.body.picture6,
            structureP: req.body.structureP,
            structureWP: req.body.structureWP,
            painted: req.body.painted,
            surplus: req.body.surplus,
            remaining: req.body.remaining,
            comments: req.body.comments,
            arrival: req.body.arrival,
            departure: req.body.departure,
            active: req.body.active,
            completed: req.body.completed,
            totalBlancaLtx: req.body.totalBlancaLtx,
            totalBlancaOpt: req.body.totalBlancaOpt,
            totalAmrBrill: req.body.totalAmrBrill,
            totalAzulBrill: req.body.totalAzulBrill,
            usedBlancaLtx: req.body.usedBlancaLtx,
            usedBlancaOpt: req.body.usedBlancaOpt,
            usedYellow: req.body.usedYellow,
            usedBlue: req.body.usedBlue,
        }
        let job = await Job.findOne({
            where: {
                id: attributes.id
            }
        });
        job.before1 = attributes.before1;
        job.before2 = attributes.before2;
        job.before3 = attributes.before3;
        job.after1 = attributes.after1;
        job.after2 = attributes.after2;
        job.after3 = attributes.after3;
        job.accepted = attributes.accepted;
        job.name = attributes.name;
        job.picture1 = attributes.picture1;
        job.picture2 = attributes.picture2;
        job.picture3 = attributes.picture3;
        job.picture4 = attributes.picture4;
        job.picture5 = attributes.picture5;
        job.picture6 = attributes.picture6;
        job.structureP = attributes.structureP;
        job.structureWP = attributes.structureWP;
        job.painted = attributes.painted;
        job.surplus = attributes.surplus;
        job.remaining = attributes.remaining;
        job.comments = attributes.comments;
        job.arrival = attributes.arrival;
        job.departure = attributes.departure;
        job.active = attributes.active;
        job.completed = attributes.completed;
        job.totalBlancaLtx = attributes.totalBlancaLtx;
        job.totalBlancaOpt = attributes.totalBlancaOpt;
        job.totalAmrBrill = attributes.totalAmrBrill;
        job.totalAzulBrill = attributes.totalAzulBrill;
        job.usedBlancaLtx = attributes.usedBlancaLtx,
        job.usedBlancaOpt = attributes.usedBlancaOpt,
        job.usedYellow = attributes.usedYellow,
        job.usedBlue = attributes.usedBlue,
        await job.save();
        res.status(200).send({ code: 200, message: "Registro almacenado con exito" });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getSchedulejobs  = async (req, res, next) => {
    try {
        const code = req.headers.code;
        let jobs = [];
        let activeRecord = await Team.findAll({
            attributes: ['id'],
            where: {
                EmployeeCode: code,
                "$Schedules.scheduled$" : true
            },
            include: [ { model: Schedule, as: 'Schedules'} ]
        });
        if(activeRecord.length > 0) {
            jobs = await Job.findAll({
                where: {
                    ScheduleId: activeRecord[0].Schedules[0].id,
                    active: false,
                    completed: false
                }
            });
        }
        let scheduleTmp = activeRecord[0].Schedules[0];
        for(let i = 0; i <= jobs.length - 1; i++) {
            for(let j = 0; j <= scheduleTmp.route.length - 1; j++) {
                if(jobs[i].StoreId == scheduleTmp.route[j].id) {
                    jobs[i].setDataValue("storeInfo", scheduleTmp.route[j]);
                }
            }
        }
        let response = {
            schedule: scheduleTmp,
            jobs: jobs,
            teamId: activeRecord[0].id
        }
        res.status(200).send({ code: 200, response });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getTeamJobs  = async (req, res, next) => {
    try {
        const teamid = req.headers.teamid;
        const jobs = await Job.findAll({
            where: {
                active: true,
                completed: false
            }
        });
        res.status(200).send({ code: 200, jobs });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getJobDetails = async (req, res, next) => {
    try {
        const code = req.headers.code;
        const job = await Job.findOne({
            where: {
                id: code
            },
            include: [ { model: Store, as: 'Store' }, { model: Schedule, attributes:['id','TeamId'], as: 'Schedule'} ]
        });
        res.status(200).send({ code: 200, job });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getPaintTotalAvailable = async (req, res, next )=> {
    try {
        const teamid = req.headers.id;
        if(teamid) {
            let totalUsed = {
                blancaLtx: 0.0,
                blancaOpt: 0.0,
                amrBrill: 0.0,
                azulBrill: 0.0
            };
            const team = await Team.findOne({
                where: {
                    id: teamid
                },
                include: [
                    { model: Product, as: 'Products' },
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
            let schedules = team.Schedules;
            for(let i = 0; i <= schedules.length - 1; i++ ) {
                if(schedules.length > 0) {
                    for(let j = 0; j <= schedules.length - 1; j++) {
                        let jobs = await Job.findAll({
                            where: {
                                ScheduleId: schedules[j].id
                            }
                        });
                        for(let k = 0; k <= jobs.length - 1; k++) {
                            totalUsed.blancaLtx += jobs[k].usedBlancaLtx || 0;
                            totalUsed.blancaOpt += jobs[k].usedBlancaOpt || 0;
                            totalUsed.amrBrill += jobs[k].usedYellow || 0;
                            totalUsed.azulBrill += jobs[k].usedBlue || 0;
                        }
                    }
                }
            }
            let totalAvailable = {
                blancaLtx:  (totalList.find(f => { return f.key == "blancaLtx"}).value || 0) - totalUsed.blancaLtx,
                blancaOpt: (totalList.find( f=> { return f.key == "blancaOpt" }).value || 0) - totalUsed.blancaOpt ,
                amrBrill: (totalList.find(f => { return f.key == "amrBrill" }).value || 0) - totalUsed.amrBrill,
                azulBrill: (totalList.find(f => { return f.key == "azulBrill" } ).value || 0) - totalUsed.azulBrill,
            }
            res.status(200).send({ code: 200, totalAvailable });
        } else {
            res.status(400).send({ code: 200, message: "Sin parametros" });
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getAllJobs = async (req, res, next) => {
    try
    {
        let jobList = [];
        jobList = await Job.findAll({
            attributes: ['id','createdAt','active'],
            order: [
                ['createdAt', 'DESC']
            ],
            include: [
                {
                    attributes: ['id','code','name'], 
                    model: Store, 
                    as:'Store' 
                }
            ]
        });
        res.status(200).send({ code: 200, jobList });
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.getAllJobsByDate = async (req, res, next) => {
    let date = req.body.date;
    if(date) {
        try
        {
            let jobList = [];
            jobList = await Job.findAll({
                attributes: ['id','createdAt','active','completed','reescheduled'],
                where: {
                    created: date
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [
                    {
                        attributes: ['id','code','name'], 
                        model: Store, 
                        as:'Store' 
                    }
                ]
            });
            res.status(200).send({ code: 200, jobList });
        } catch(e) {
            res.status(500).send({ code: 500, message: e.message });
        }
    } else {
        res.status(400).send({ code: 400, message: "Parametros incompletos" });
    }
}

exports.markJobCompleted = async (req, res, next) => {
    try {
        let jobid = req.body.id;
        let storeid = req.body.storeid;
        if(jobid && storeid) { 
            let job = await Job.findOne({
                where: {
                    id: jobid
                }
            });
            job.completed = true;
            job.save();
            let store = await Store.findOne({
                where: {
                    id: storeid
                }
            });
            store.scheduled = false;
            store.complete = true;
            store.save();
            res.status(200).send({ code: 200, message: "Operacion realziada con exito" });
        } else {
            res.status(400).send({ code: 400, message: "Parametros incorrectos" });
        }
    } catch(e) {
        res.status(500).send({ code: 500, message: e.message });
    }
}

exports.markJobReescheduled = async (req, res, next) => {
    try {
        let jobid = req.body.id;
        let storeid = req.body.storeid;
        if(jobid && storeid) { 
            let job = await Job.findOne({
                where: {
                    id: jobid
                }
            });
            job.completed = true;
            job.reescheduled = true;
            job.save();
            let store = await Store.findOne({
                where: {
                    id: storeid
                }
            });
            store.scheduled = false;
            store.complete = false;
            store.save();
            res.status(200).send({ code: 200, message: "Operacion realziada con exito" });
        } else {
            res.status(400).send({ code: 400, message: "Parametros incorrectos" });
        }
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
