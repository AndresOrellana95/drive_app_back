module.exports = (sequelize, type) => {
    return sequelize.define('Sector', {
        code: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        parent: {
            type: type.INTEGER,
            allowNull: true,
        },
        name: {
            type: type.STRING,
            allowNull: false
        }
    });
}