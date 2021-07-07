module.exports = (sequelize, type) => {
    return sequelize.define('Team',{
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        structure: type.JSON,
        keys: {
            type: type.BOOLEAN
        }
    });
}
