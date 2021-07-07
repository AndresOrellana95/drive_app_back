module.exports = (sequelize, type) => {
    return sequelize.define('Car', {
        code: {
            type: type.STRING,
            primaryKey: true,
            unique: true
        },
        model: {
            type: type.STRING
        },
        inUse: {
            type: type.BOOLEAN
        }
    });
}