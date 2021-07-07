const { sequelize } = require("../../config/db")

module.exports = (sequelize, type) => {
    return sequelize.define('Binnacle', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employee: {
            type: type.STRING,
            allowNull: false
        },
        schedule: {
            type: type.INTEGER,
            allowNull: false
        },
        localCreation: {
            type: type.STRING,
            allowNull: false
        },
        latitude: {
            type: type.STRING,
            allowNull: false
        },
        longitude: {
            type: type.STRING,
            allowNull: false
        },
        storeCode: {
            type: type.STRING,
            allowNull: false
        }
    });
}
