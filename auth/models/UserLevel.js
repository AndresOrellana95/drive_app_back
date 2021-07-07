module.exports = (sequelize, type) => {
    return sequelize.define('UserLevel', {
        code: {
            type: type.INTEGER,
            primaryKey: true
        },
        description: type.STRING
    });
}