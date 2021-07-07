module.exports = (sequelize, type) => {
    return sequelize.define('Employee', {
        code: {
            type: type.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        name: {
            type: type.STRING
        },
        password: {
            type: type.STRING,
            allowNull: false
        },
        partner: {
            type: type.BOOLEAN
        },
        lastAssign: {
            type: type.STRING
        },
        TeamId: type.INTEGER
    });
}