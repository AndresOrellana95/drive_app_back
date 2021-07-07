module.exports = (sequelize, type) => {
    return sequelize.define('Job', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ratio: type.FLOAT,
        before1: type.TEXT,
        before2: type.TEXT,
        before3: type.TEXT,
        after1: type.TEXT,
        after2: type.TEXT,
        after3: type.TEXT,
        accepted: type.TEXT,
        name: type.BOOLEAN,
        picture1: type.BOOLEAN,
        picture2: type.BOOLEAN,
        picture3: type.BOOLEAN,
        picture4: type.BOOLEAN,
        picture5: type.BOOLEAN,
        picture6: type.BOOLEAN,
        structureP: type.JSON,
        structureWP: type.JSON,
        painted: type.FLOAT,
        surplus: type.FLOAT,
        remaining: type.FLOAT,
        comments: type.TEXT,
        arrival: type.STRING,
        departure: type.STRING,
        totalBlancaLtx: type.FLOAT,
        totalBlancaOpt: type.FLOAT,
        totalAmrBrill: type.FLOAT,
        totalAzulBrill: type.FLOAT,
        usedBlancaLtx: type.FLOAT,
        usedBlancaOpt: type.FLOAT,
        usedYellow: type.FLOAT,
        usedBlue: type.FLOAT,
        created: type.STRING,
        active: {
            type: type.BOOLEAN,
            allowNull: false
        },
        completed: {
            type: type.BOOLEAN,
            allowNull: false
        },
        reescheduled: {
            type: type.BOOLEAN,
            allowNull: false
        }
    });
}
