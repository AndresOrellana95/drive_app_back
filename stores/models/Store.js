module.exports = (sequelize, type) => {
    return sequelize.define('Store', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: type.STRING,
            allowNull: false
        },
        contactILC: {
            type: type.STRING
        },
        dir1: type.STRING,
        dir2: type.STRING,
        dir3: type.STRING,
        phoneILC: type.STRING,
        client: type.STRING,
        phone: type.STRING,
        phone2: type.STRING,
        reference: type.STRING,
        gradeLat: {
            type: type.STRING,
            allowNull: false
        },
        gradeLong: {
            type: type.STRING,
            allowNull: false
        },
        latitude: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        longitude: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        department: {
            type: type.INTEGER,
            allowNull: false
        },
        sector: {
            type: type.INTEGER,
            allowNull: false
        },
        scheduled: type.BOOLEAN,
        complete: type.BOOLEAN
    })
}
